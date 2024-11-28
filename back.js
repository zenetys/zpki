const crypto = require('crypto');
const child_process = require('child_process');
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const app = express();

const listenAddress = process.env.LISTEN_ADDRESS || '0.0.0.0';
const listenPort = parseInt(process.env.LISTEN_PORT) || 3000;
const passwordExpireMs = parseInt(process.env.PASSWORD_EXPIRE_MS) || 600000;
const cookieMaxAgeMs = parseInt(process.env.COOKIE_MAX_AGE_MS) || 86400000;
const logHttpRequests = Boolean(parseInt(process.env.LOG_HTTP_REQUESTS ?? '1'));
const caBaseDir = process.env.CA_BASEDIR || __dirname;
const caFoldersCmd = process.env.CA_FOLDERS_CMD || __dirname + '/ca-folders';
const caFoldersCacheMs = process.env.CA_FOLDERS_CACHE_MS || 300000;
const zpkiCmd = process.env.ZPKI_CMD || __dirname + '/zpki';
app.set('trust proxy', process.env.TRUST_PROXY || false);

// Centralized error handling middleware
const handleError = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: err.message });
};

// Validate certificate name
const checkCommonName = (name) => {
    const regex = /^[a-zA-Z0-9-_ .*]+$/;
    return regex.test(name) && name.length > 0 && name.length < 64;
};

// Get available CA folders, with cache
var caFoldersCache;
async function getCaFolders(forceRefresh = false) {
    if (!caFoldersCache || forceRefresh) {
        const result = await safeExec(caFoldersCmd, [ caBaseDir ]);
        let folders = result.stdout.replace(/\r?\n$/, '');
        caFoldersCache = folders.length > 0 ? folders.split('\n') : [];
        setTimeout(() => { caFoldersCache = undefined }, caFoldersCacheMs);
    }
    return caFoldersCache;
}

// Adjust session variables to change profile
async function switchProfile(req, wantedProfile) {
    let caFolders = await getCaFolders();
    if (!caFolders.includes(wantedProfile))
        throw new Error('Invalid profile.');
    delete req.session.caPassword;
    req.session.currentProfile = wantedProfile;
    req.session.srcFolder = path.join(caBaseDir, wantedProfile);
}

// Safe command execution
function shQuote(arg) {
    return "'" + arg.toString().replace(/\x27/g, "'\\''") + "'";
}
function safeExec(unsafeCmd, args = [], execOptions = {}) {
    let cmd = '{ ';
    cmd += (unsafeCmd ?? '') + ' ';
    args.forEach((a) => { cmd += shQuote(a) + ' ' });
    cmd += '; } < /dev/null'
    return new Promise((resolve, reject) => {
        child_process.exec(cmd, execOptions, (error, stdout, stderr) => {
            if (error) {
                error.stdout = stdout;
                error.stderr = stderr;
                return reject(error);
            }
            return resolve({ stdout, stderr });
        });
    });
};

function rfc3339LocalDate(d) {
    d ||= new Date();
    var out = d.getFullYear() +
        '-' + (d.getMonth() + 1).toString().padStart(2, '0') +
        '-' + d.getDate().toString().padStart(2, '0') +
        'T' + d.getHours().toString().padStart(2, '0') +
        ':' + d.getMinutes().toString().padStart(2, '0') +
        ':' + d.getSeconds().toString().padStart(2, '0') +
        '.' + d.getMilliseconds().toString().padStart(3, '0');
    var tzOffset = d.getTimezoneOffset() * -1;
    if (tzOffset == 0)
        out += 'Z'
    else {
        let tzOffsetHours = Math.floor(tzOffset / 60);
        let tzOffsetMinutes = tzOffset % 60;
        out += (tzOffset >= 0 ? '+' : '-') +
            tzOffsetHours.toString().padStart(2, '0') + ':' +
            tzOffsetMinutes.toString().padStart(2, '0');
    }
    return out;
};

// ----------- ----------- APP SETUP ----------- ----------- //

app.use(cors({ methods: ['GET', 'POST'] }));
app.use(express.static(__dirname));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(handleError);
app.use(helmet());
app.use(session({
    secret: crypto.randomBytes(16).toString('hex'),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: cookieMaxAgeMs,
    }
}));
logHttpRequests && app.use((req, res, next) => {
    let reqDate = new Date();
    res.on('finish', () => {
        let accessLog =
            `${(req?.ips?.length > 0 && req.ips.join('/') + '/' + req.socket.remoteAddress) || req.socket.remoteAddress || '-'} ` +
            `- - [${rfc3339LocalDate(reqDate)}] ` +
            `"${req.method || '-'} ${req.originalUrl || req.url || '-'} HTTP/${req.httpVersion || '-'}" ` +
            `${(res.headersSent && res.statusCode) || '-'} ${res.getHeader('content-length') || '-'} ` +
            `${(new Date()) - reqDate}`;
        console.log(accessLog);
    });
    next();
});

// ----------- ----------- GET REQUESTS ----------- ----------- //

// Route to serve main page & select a default profile
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to get all available profiles & get current profile
app.get('/profiles', async (req, res) => {
    try {
        let profiles = await getCaFolders();
        if (profiles.length === 0)
            return res.status(404).json({ error: 'No profiles available.' });
        if (!req.session.currentProfile)
            await switchProfile(req, profiles[0]);
        res.json({ profiles, currentProfile: req.session.currentProfile });
    } catch (error) {
        console.error('Error retrieving profiles and current profile:', error);
        res.status(500).json({ error: 'Unable to retrieve profiles and current profile.' });
    }
});

// Route to get the list of certificates
app.get('/list', async (req, res) => {
    if (!req.session.srcFolder) return res.status(400).json({ error: 'Current profile directory is not set.' });
    try {
        const output = await safeExec(zpkiCmd, ['-C', req.session.srcFolder, 'ca-list', '--json']);
        res.json(JSON.parse(output.stdout));
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error while listing certificates.' });
    }
});

// Route to download a certificate file (.crt)
app.get('/download-crt', async (req, res) => {
    const commonName = req.query.cert;

    if (!req.session.srcFolder) return res.status(400).json({ error: 'Current profile directory is not set.' });
    if (!commonName) return res.status(400).json({ error: 'Common Name argument is empty.' });
    if (!checkCommonName(commonName)) return res.status(400).json({ error: `Invalid certificate name (${commonName}).` });

    try {
        const output = await safeExec(zpkiCmd, ['-C', req.session.srcFolder, 'ca-dump-crt', commonName]);

        res.setHeader('Content-Disposition', `attachment; filename=${commonName}.crt`);
        res.setHeader('Content-Type', 'application/x-x509-ca-cert');
        res.end(output.stdout);
    } catch (error) {
        console.error('Error executing command:', error);
        res.status(500).json({ error: 'Certificate not found.' });
    }
});

// Route to download a certificate signing request (.csr)
app.get('/download-csr', async (req, res) => {
    const commonName = req.query.cert;

    if (!req.session.srcFolder) return res.status(400).json({ error: 'Current profile directory is not set.' });
    if (!commonName) return res.status(400).json({ error: 'Common Name argument is empty.' });
    if (!checkCommonName(commonName)) return res.status(400).json({ error: `Invalid certificate name (${commonName}).` });

    try {
        const output = await safeExec(zpkiCmd, ['-C', req.session.srcFolder, 'ca-dump-csr', commonName]);

        res.setHeader('Content-Disposition', `attachment; filename=${commonName}.csr`);
        res.setHeader('Content-Type', 'application/x-x509-ca-cert');
        res.end(output.stdout);
    } catch (error) {
        console.error('Error executing command:', error);
        res.status(500).json({ error: 'Certificate not found.' });
    }
});

// Route to download a key file (.key)
app.get('/download-key', async (req, res) => {
    const commonName = req.query.cert;

    if (!req.session.srcFolder) return res.status(400).json({ error: 'Current profile directory is not set.' });
    if (!commonName) return res.status(400).json({ error: 'Common Name argument is empty.' });
    if (!checkCommonName(commonName)) return res.status(400).json({ error: `Invalid certificate name (${commonName}).` });

    try {
        const output = await safeExec(zpkiCmd, ['-C', req.session.srcFolder, 'ca-dump-key', commonName]);

        res.setHeader('Content-Disposition', `attachment; filename=${commonName}.key`);
        res.setHeader('Content-Type', 'application/x-x509-ca-cert');
        res.end(output.stdout);
    } catch (error) {
        console.error('Error executing command:', error);
        res.status(500).json({ error: 'Certificate not found.' });
    }
});

// Route to get DNS & IP data
app.get('/subject-alt', async (req, res) => {
    const commonName = req.query.cert;

    if (!req.session.srcFolder) return res.status(400).json({ error: 'Current profile directory is not set.' });
    if (!commonName) return res.status(400).json({ error: 'Common Name argument is empty.' });
    if (!checkCommonName(commonName)) return res.status(400).json({ error: `Invalid certificate name (${commonName}).` });

    try {
        const output = await safeExec(zpkiCmd, ['-C', req.session.srcFolder, 'ca-display-crt', commonName, '--json']);

        const jsonOutput = JSON.parse(output.stdout);
        const san = jsonOutput["X509v3 Subject Alternative Name"];
        if (!san) return res.json({ error: 'SAN not found.' });

        const dns = [], ip = [];
        san.split(',').forEach(part => {
            part = part.trim();
            if (part.startsWith('DNS:')) dns.push(part.split(':')[1].trim());
            else if (part.startsWith('IP Address:')) ip.push(part.split(':')[1].trim());
        });

        res.json({ dns, ip });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Certificate not found.' });
    }
});

// Route to get session passphrase
app.get('/is-locked', async (req, res) => {
    if (req.session.caPassword === undefined) return res.json({ response: true });
    if (!req.session.srcFolder) return res.status(400).json({ error: 'Current profile directory is not set.' });

    try {
        await safeExec(zpkiCmd, ['-C', req.session.srcFolder, 'ca-test-password'],
            { env: { ...process.env, CA_PASSWORD: req.session.caPassword } });
        return res.json({ response: false });
    } catch (error) {
        console.log(error);
        res.json({ response: true });
    }
});

// ----------- ----------- POST REQUESTS ----------- ----------- //

// Route to switch profile
app.post('/switch-profile', async (req, res) => {
    const { profile } = req.body;
    try {
        await switchProfile(req, profile);
        return res.json({ response: `Profile switched to ${profile}.` });
    } catch (err) {
        console.error('Error switching profile:', err);
        return res.status(400).json({ error: err.message });
    }
});

// Route to create certificates
app.post('/create', async (req, res) => {
    const { commonName, subject, sanIP, sanDNS } = req.body;
    const type = 'server_ext';
    const password = '';

    if (req.session.caPassword === undefined) return res.status(400).json({ error: 'Password expired.' });
    if (!req.session.srcFolder) return res.status(400).json({ error: 'Current profile directory is not set.' });
    if (!commonName) return res.status(400).json({ error: 'Common Name argument is empty.' });
    if (!checkCommonName(commonName)) return res.status(400).json({ error: `Invalid certificate name (${commonName}).` });

    try {
        let args = ['-C', req.session.srcFolder, '-y', ];
        if (password === '') args.push('-c', 'none');
        args.push('ca-create-crt', subject === '' ? commonName : subject);
        if (sanIP && sanIP.length > 0) args.push(...sanIP.map(ip => `IP:${ip}`));
        if (sanDNS && sanDNS.length > 0) args.push(...sanDNS.map(dns => `DNS:${dns}`));

        await safeExec(zpkiCmd, args, { env: { ...process.env,
            CA_PASSWORD: req.session.caPassword,
            PASSWORD: password === '' ? '' : password, EXT: type } });
        res.json({ response: 'Certificate created successfully!' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Certificate creation error.' });
    }
});

// Route to renew certificates
app.post('/renew', async (req, res) => {
    const { commonName } = req.body;

    if (req.session.caPassword === undefined) return res.status(400).json({ error: 'Password expired.' });
    if (!req.session.srcFolder) return res.status(400).json({ error: 'Current profile directory is not set.' });
    if (!commonName) return res.status(400).json({ error: 'Common Name argument is empty.' });
    if (!checkCommonName(commonName)) return res.status(400).json({ error: `Invalid certificate ID (${commonName}).` });

    try {
        await safeExec(zpkiCmd, ['-C', req.session.srcFolder, '-y', '-c', 'none',
            'ca-update-crt', commonName], { env: { ...process.env, CA_PASSWORD: req.session.caPassword } });
        res.json({ response: 'Certificate renewed successfully!' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Certificate renewal error.' });
    }
});

// Route to revoke certificates
app.post('/revoke', async (req, res) => {
    const { commonName } = req.body;

    if (req.session.caPassword === undefined) return res.status(400).json({ error: 'Password expired.' });
    if (!req.session.srcFolder) return res.status(400).json({ error: 'Current profile directory is not set.' });
    if (!commonName) return res.status(400).json({ error: 'Common Name argument is empty.' });
    if (!checkCommonName(commonName)) return res.status(400).json({ error: `Invalid certificate ID (${commonName}).` });

    try {
        await safeExec(zpkiCmd, ['-C', req.session.srcFolder, '-y', '-c', 'none',
            'ca-revoke-crt', commonName], { env: { ...process.env, CA_PASSWORD: req.session.caPassword } });
        res.json({ response: 'Certificate revoked successfully!' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Certificate revocation error.' });
    }
});

// Route to disable certificates
app.post('/disable', async (req, res) => {
    const { commonName } = req.body;

    if (req.session.caPassword === undefined) return res.status(400).json({ error: 'Password expired.' });
    if (!req.session.srcFolder) return res.status(400).json({ error: 'Current profile directory is not set.' });
    if (!commonName) return res.status(400).json({ error: 'Common Name argument is empty.' });
    if (!checkCommonName(commonName)) return res.status(400).json({ error: `Invalid certificate ID (${commonName}).` });

    try {
        await safeExec(zpkiCmd, ['-C', req.session.srcFolder, '-y', '-c', 'none',
            'ca-disable-crt', commonName], { env: { ...process.env, CA_PASSWORD: req.session.caPassword } });
        res.json({ response: 'Certificate disabled successfully!' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Certificate deactivation error.' });
    }
});

// Route to define session passphrase
app.post('/set-password', async (req, res) => {
    const { ca_password } = req.body;

    if (!req.session.srcFolder) return res.status(400).json({ error: 'Current profile directory is not set.' });
    if (ca_password === null) {
        delete req.session.caPassword;
        return res.json({ response: 'Passphrase removed.' });
    }

    try {
        await safeExec(zpkiCmd, ['-C', req.session.srcFolder, 'ca-test-password' ],
            { env: { ...process.env, CA_PASSWORD: ca_password } });
        req.session.caPassword = ca_password;

        // Note this is most likely racy if a request modifies session data at same time.
        setTimeout(() => {
            req.sessionStore.get(req.sessionID, (error, sessionData) => {
                if (error)
                    console.log('Failed to expire password for session', req.sessionID, error);
                else if (sessionData) {
                    console.log('Password expired for session', req.sessionID);
                    delete sessionData.caPassword;
                    req.sessionStore.set(req.sessionID, sessionData);
                }
            });
        }, passwordExpireMs);

        return res.json({ response: 'Passphrase saved!' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Incorrect passphrase.' });
    }
});

app.listen(listenPort, listenAddress, () => {
    console.log(`Server listening on ${listenAddress}:${listenPort}`);
});
