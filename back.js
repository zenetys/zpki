const { spawn } = require('child_process');
const fs = require('fs');
const crypto = require('crypto');
const child_process = require('child_process');
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const caBaseDir = process.env.CA_BASEDIR || __dirname;
const caFolders = process.env.CA_FOLDERS || __dirname + '/ca-folders';
const zpkiCmd = process.env.PKI_CMD || __dirname + '/zpki';

// Centralized error handling middleware
const handleError = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: err.message });
};

// Validate certificate name
const checkCommonName = (name) => {
    const regex = /^[a-zA-Z0-9-_ ]+$/;
    return regex.test(name) && name.length > 0 && name.length < 64;
};

// Safe command execution
function shQuote(arg) {
    return "'" + arg.toString().replace(/\x27/g, "'\\''") + "'";
}
function safeExec(unsafeCmd, args = [], execOptions = {}) {
    let cmd = '';
    cmd += (unsafeCmd ?? '') + ' ';
    args.forEach((a) => { cmd += shQuote(a) + ' ' });
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
    cookie: {}
}));

// ----------- ----------- GET REQUESTS ----------- ----------- //

// Route to serve main page & select a default profile
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to get all available profiles
app.get('/profiles', async (req, res) => {
    try {
        const result = await safeExec(caFolders);
        const profiles = result.stdout
            .split('\n')
            .filter(line => line.trim().length > 0);
        res.json(profiles);
    } catch (error) {
        console.error('Error executing ca-folders:', error);
        res.status(500).json({ error: 'Unable to retrieve profiles.' });
    }
});

// Route to get current profile
app.get('/current-profile', async (req, res) => {
    const currentProfile = req.session.currentProfile;
    if (!currentProfile) {
        try {
            const result = await safeExec(caFolders);
            const profiles = result.stdout
                .split('\n')
                .filter(line => line.trim().length > 0);
            if (profiles.length === 0) return res.status(404).json({ error: 'No profiles available.' });
            req.session.srcFolder = profiles[0];
            res.json({ currentProfile: req.session.srcFolder });
        } catch (error) {
            console.error('Error executing ca-folders:', error);
            res.status(500).json({ error: 'Unable to retrieve current profile.' });
        }
    } else res.json({ currentProfile });
});

// Route to get the list of certificates
app.get('/list', async (req, res) => {
    if (!req.session.srcFolder) return res.status(400).json({ error: 'Current profile directory is not set.' });
    try {
        const output = await safeExec(zpkiCmd, ['-C', req.session.srcFolder, 'ca-list', '--json']);
        if (output instanceof Error) { return res.status(500).json({ error: 'Error while listing certificates.' }); }
        res.json(JSON.parse(output));
    } catch (error) {
        res.status(400).json({ error: 'Error while listing certificates.' });
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

        if (output instanceof Error) { return res.status(500).json({ error: 'Certificate not found.' }); }

        res.setHeader('Content-Disposition', `attachment; filename=${commonName}.crt`);
        res.setHeader('Content-Type', 'application/x-x509-ca-cert');
        res.end(output);
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

        if (output instanceof Error) { return res.status(500).json({ error: 'Certificate not found.' }); }

        res.setHeader('Content-Disposition', `attachment; filename=${commonName}.csr`);
        res.setHeader('Content-Type', 'application/x-x509-ca-cert');
        res.end(output);
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

        if (output instanceof Error) { return res.status(500).json({ error: 'Certificate not found.' }); }

        res.setHeader('Content-Disposition', `attachment; filename=${commonName}.key`);
        res.setHeader('Content-Type', 'application/x-x509-ca-cert');
        res.end(output);
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

        if (output instanceof Error) { return res.status(500).json({ error: 'Certificate not found.' }); }

        const jsonOutput = JSON.parse(output);
        const san = jsonOutput["X509v3 Subject Alternative Name"];
        if (!san) return res.json({ error: 'SAN not found.' });

        const dns = [], ip = [];
        san.split(',').forEach(part => {
            part = part.trim();
            if (part.startsWith('DNS:')) dns.push(part.split(':')[1].trim());
            else if (part.startsWith('IP Address:')) ip.push(part.split(':')[1].trim());
        });

        res.json({ dns, ip });
    } catch (e) {
        res.status(500).json({ error: 'Certificate not found.' });
    }
});

// Route to get session passphrase
app.get('/is-locked', async (req, res) => {
    if (!req.session.caPassword) return res.json({ response: true });
    if (!req.session.srcFolder) return res.status(400).json({ error: 'Current profile directory is not set.' });

    try {
        const output = await safeExec(`
            CA_PASSWORD=${req.session.caPassword} \
            ${zpkiCmd} \
            -C "${req.session.srcFolder}" \
            ca-test-password
        `);
        if (output instanceof Error) { return res.json({ response: true }); }
        return res.json({ response: false });
    } catch (error) {
        res.json({ response: true });
    }
});

// ----------- ----------- POST REQUESTS ----------- ----------- //

// Route to switch profile
app.post('/switch-profile', async (req, res) => {
    const { profile } = req.body;
    const currentPath = path.join(caBaseDir, profile);

    try {
        const stats = await fs.promises.stat(currentPath);
        if (!stats.isDirectory()) {
            return res.status(400).json({ error: 'Invalid profile.' });
        }
        req.session.caPassword = null;
        req.session.srcFolder = currentPath;
        req.session.currentProfile = profile;
        return res.json({ response: `Profile switched to ${profile}.` });
    } catch (err) {
        return res.status(400).json({ error: 'Invalid profile.' });
    }
});

// Route to create certificates
app.post('/create', async (req, res) => {
    const { commonName, subject, sanIP, sanDNS } = req.body;
    const type = 'server_ext';
    const password = '';

    if (!req.session.caPassword) return res.status(400).json({ error: 'Session expired.' });
    if (!req.session.srcFolder) return res.status(400).json({ error: 'Current profile directory is not set.' });
    if (!commonName) return res.status(400).json({ error: 'Common Name argument is empty.' });
    if (!checkCommonName(commonName)) return res.status(400).json({ error: `Invalid certificate name (${commonName}).` });

    try {
        const output = await safeExec(`
            CA_PASSWORD=${req.session.caPassword} \
            PASSWORD=${password === '' ? '' : password} \
            EXT=${type} \
            ${zpkiCmd} \
            -C "${req.session.srcFolder}" \
            -y ${password === '' ? '-c none' : ''} \
            ca-create-crt "${subject === '' ? commonName : subject}" \
            ${sanIP && sanIP.length > 0 ? sanIP.map(ip => `IP:${ip}`).join(' ') : ''} \
            ${sanDNS && sanDNS.length > 0 ? sanDNS.map(dns => `DNS:${dns}`).join(' ') : ''}
        `);
        if (output instanceof Error) { return res.status(500).json({ error: 'Certificate creation error.' }); }
        res.json({ response: 'Certificate created successfully!' });
    } catch (error) {
        res.status(400).json({ error: 'Certificate creation error.' });
    }
});

// Route to renew certificates
app.post('/renew', async (req, res) => {
    const { commonName } = req.body;

    if (!req.session.caPassword) return res.status(400).json({ error: 'Session expired.' });
    if (!req.session.srcFolder) return res.status(400).json({ error: 'Current profile directory is not set.' });
    if (!commonName) return res.status(400).json({ error: 'Common Name argument is empty.' });
    if (!checkCommonName(commonName)) return res.status(400).json({ error: `Invalid certificate ID (${commonName}).` });

    try {
        const output = await safeExec(`
            CA_PASSWORD=${req.session.caPassword} \
            ${zpkiCmd} \
            -C "${req.session.srcFolder}" \
            -y -c none \
            ca-update-crt "${commonName}"
        `);
        if (output instanceof Error) { return res.status(500).json({ error: 'Certificate renewal error.' }); }
        res.json({ response: 'Certificate renewed successfully!' });
    } catch (error) {
        res.status(400).json({ error: 'Certificate renewal error.' });
    }
});

// Route to revoke certificates
app.post('/revoke', async (req, res) => {
    const { commonName } = req.body;

    if (!req.session.caPassword) return res.status(400).json({ error: 'Session expired.' });
    if (!req.session.srcFolder) return res.status(400).json({ error: 'Current profile directory is not set.' });
    if (!commonName) return res.status(400).json({ error: 'Common Name argument is empty.' });
    if (!checkCommonName(commonName)) return res.status(400).json({ error: `Invalid certificate ID (${commonName}).` });

    try {
        const output = await safeExec(`
            CA_PASSWORD=${req.session.caPassword} \
            ${zpkiCmd} \
            -C "${req.session.srcFolder}" \
            -y -c none \
            ca-revoke-crt "${commonName}"
        `);
        if (output instanceof Error) { return res.status(500).json({ error: 'Certificate revocation error.' }); }
        res.json({ response: 'Certificate revoked successfully!' });
    } catch (error) {
        res.status(400).json({ error: 'Certificate revocation error.' });
    }
});

// Route to disable certificates
app.post('/disable', async (req, res) => {
    const { commonName } = req.body;

    if (!req.session.caPassword) return res.status(400).json({ error: 'Session expired.' });
    if (!req.session.srcFolder) return res.status(400).json({ error: 'Current profile directory is not set.' });
    if (!commonName) return res.status(400).json({ error: 'Common Name argument is empty.' });
    if (!checkCommonName(commonName)) return res.status(400).json({ error: `Invalid certificate ID (${commonName}).` });

    try {
        const output = await safeExec(`
            CA_PASSWORD=${req.session.caPassword} \
            ${zpkiCmd} \
            -C "${req.session.srcFolder}" \
            -y -c none \
            ca-disable-crt "${commonName}"
        `);
        if (output instanceof Error) { return res.status(500).json({ error: 'Certificate deactivation error.' }); }
        res.json({ response: 'Certificate disabled successfully!' });
    } catch (error) {
        res.status(400).json({ error: 'Certificate deactivation error.' });
    }
});

// Route to define session passphrase
app.post('/set-password', async (req, res) => {
    const { ca_password } = req.body;

    if (!req.session.srcFolder) return res.status(400).json({ error: 'Current profile directory is not set.' });
    if (ca_password === null) {
        req.session.caPassword = null;
        return res.json({ response: 'Passphrase removed.' });
    }

    try {
        const output = await safeExec(`
            CA_PASSWORD=${ca_password} \
            ${zpkiCmd} \
            -C "${req.session.srcFolder}" \
            ca-test-password
        `);
        if (output instanceof Error) { return res.status(500).json({ error: 'Incorrect passphrase.' }); }
        req.session.caPassword = ca_password;
        setTimeout(() => { req.session.caPassword = null }, 600000);
        return res.json({ response: 'Passphrase saved!' });
    } catch (error) {
        res.status(400).json({ error: 'Incorrect passphrase.' });
    }
});

app.listen(port, () => {
    console.log(`Server started: http://localhost:${port}`);
});
