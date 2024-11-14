const { spawn } = require('child_process');
const fs = require('fs');
const crypto = require('crypto');
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const caBaseDir = process.env.CA_BASEDIR || __dirname;
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

// Check if current user is in sudoers
const checkSudoers = async () => {
    try {
        const output = await safeExec('sudo', ['-l']);
        if (output instanceof Error) { return res.status(500).json({ error: 'You don\'t have sudo privileges.' }); }
    } catch (error) {
        throw new Error('You don\'t have sudo privileges.');
    }
};

// Safe command execution
const safeExec = (command, args = []) => {
    return new Promise((resolve, reject) => {
        const process = spawn(command, args, { shell: true });
        let output = '';
        let errorOutput = '';

        process.stdout.on('data', (data) => {
            output += data;
        });

        process.stderr.on('data', (data) => {
            errorOutput += data;
        });

        process.on('close', (code) => {
            if (code === 0) {
                resolve(output.trim());
            } else {
                resolve(new Error(errorOutput.trim() || `Command failed with code ${code}`));
            }
        });
    });
};

// Setup
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

// Route to serve main page & select a default profile
app.get('/', (req, res) => {
    if (req.session.currentProfile) {
        req.session.srcFolder = path.join(caBaseDir, req.session.currentProfile);
        res.sendFile(path.join(caBaseDir, 'index.html'));
    }
});

// Route to get all available profiles
app.get('/profiles', (req, res) => {
    fs.readdir(caBaseDir, { withFileTypes: true }, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to scan directory: ' + err });
        }
        const profiles = files
            .filter(file => file.isDirectory() && file.name !== '.git' 
                && file.name !== 'images' && file.name !== 'node_modules')
            .map(file => file.name);
        res.json(profiles);
    });
});

// Route to get current profile
app.get('/current-profile', (req, res) => {
    const currentProfile = req.session.currentProfile;
    if (!currentProfile) {
        fs.readdir(caBaseDir, { withFileTypes: true }, (err, files) => { 
            if (err) {
                return res.status(500).json({ error: 'Unable to scan directory: ' + err });
            } else {
                req.session.srcFolder = path.join(caBaseDir, files
                    .filter(file => file.isDirectory() && file.name !== '.git' 
                        && file.name !== 'images' && file.name !== 'node_modules')
                    .map(file => file.name)[0])
                    .split('/').pop()
                res.json({ currentProfile: req.session.srcFolder });
            }
        });
    }
    else if (currentProfile) res.json({ currentProfile });
    else return 'Select a profile';
});

// Route to get the list of certificates
app.get('/list', (req, res, next) => {
    if (!req.session.pkiaccess) return res.status(400).json({ error: 'Session expired.' });

    if (!req.session.srcFolder) return res.status(400).json({ error: 'Current profile directory is not set.' });
    try {
        await checkSudoers();
        const output = await safeExec(zpkiCmd, ['-C', req.session.srcFolder, 'ca-list', '--json']);
        if (output instanceof Error) { return res.status(500).json({ error: 'Error while listing certificates.' }); }
        res.json(JSON.parse(output));
    } catch (error) {
        res.status(400).json({ error: 'Error while listing certificates.' });
    }
});

// Route to get DNS & IP data
app.get('/subject-alt', (req, res, next) => {
    const commonName = req.query.cert;

    if (!req.session.pkiaccess) return res.status(400).json({ error: 'Session expired.' });
    if (!req.session.srcFolder) return res.status(400).json({ error: 'Current profile directory is not set.' });
    if (!commonName) return res.status(400).json({ error: 'Common Name argument is empty.' });
    if (!validateName(commonName)) return res.status(400).json({ error: `Invalid certificate name (${commonName}). Only alphanumeric characters, spaces, hyphens, and underscores are allowed, and the length must be between 1 and 64 characters.` });

    if (!checkCommonName(commonName)) return res.status(400).json({ error: `Invalid certificate name (${commonName}).` });
    try {
        const output = await safeExec(zpkiCmd, ['-C', req.session.srcFolder, 'ca-display-crt', commonName, '--json']);

        if (output instanceof Error) { return res.status(500).json({ error: 'Process stopped.' }); }

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

// Route to switch profile
app.post('/switch-profile', (req, res) => {
    const { profile } = req.body;
    const currentPath = path.join(caBaseDir, profile);

    fs.stat(currentPath, (err, stats) => {
        if (err || !stats.isDirectory()) {
            return res.status(400).json({ error: 'Invalid profile.' });
        }

        req.session.srcFolder = currentPath;
        req.session.currentProfile = profile;
        req.session.pkiaccess = '';
        return res.json({ response: `Profile switched to ${profile}.` });
    });
});

// Route to create certificates
app.post('/create', async (req, res, next) => {
    const { commonName, subject, sanIP, sanDNS } = req.body;
    const type = 'server_ext'; // Will be used above in the future
    const password = ''; // Will be used above in the future

    if (!req.session.pkiaccess) return res.status(400).json({ error: 'Session expired.' });
    if (!req.session.srcFolder) return res.status(400).json({ error: 'Current profile directory is not set.' });
    if (!commonName) return res.status(400).json({ error: 'Common Name argument is empty.' });
    if (!validateName(commonName)) return res.status(400).json({ error: `Invalid certificate name (${commonName}). Only alphanumeric characters, spaces, hyphens, and underscores are allowed, and the length must be between 1 and 64 characters.` });

    try {
        await checkSudoers();
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
app.post('/renew', async (req, res, next) => {
    const { commonName } = req.body;

    if (!req.session.pkiaccess) return res.status(400).json({ error: 'Session expired.' });
    if (!req.session.srcFolder) return res.status(400).json({ error: 'Current profile directory is not set.' });
    if (!commonName) return res.status(400).json({ error: 'Common Name argument is empty.' });
    if (!validateName(commonName)) return res.status(400).json({ error: `Invalid certificate ID (${commonName}).` });

    try {
        await checkSudoers();
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
app.post('/revoke', async (req, res, next) => {
    const { commonName } = req.body;

    if (!req.session.pkiaccess) return res.status(400).json({ error: 'Session expired.' });
    if (!req.session.srcFolder) return res.status(400).json({ error: 'Current profile directory is not set.' });
    if (!commonName) return res.status(400).json({ error: 'Common Name argument is empty.' });
    if (!validateName(commonName)) return res.status(400).json({ error: `Invalid certificate ID (${commonName}).` });

    try {
        await checkSudoers();
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
app.post('/disable', async (req, res, next) => {
    const { commonName } = req.body;

    if (!req.session.pkiaccess) return res.status(400).json({ error: 'Session expired.' });
    if (!req.session.srcFolder) return res.status(400).json({ error: 'Current profile directory is not set.' });
    if (!commonName) return res.status(400).json({ error: 'Common Name argument is empty.' });
    if (!validateName(commonName)) return res.status(400).json({ error: `Invalid certificate ID (${commonName}).` });

    try {
        await checkSudoers();
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
app.post('/set-password', async (req, res, next) => {
    const { ca_password } = req.body;

    if (!ca_password) return res.status(400).json({ error: 'Passphrase argument is empty.' });
    if (!req.session.srcFolder) return res.status(400).json({ error: 'Current profile directory is not set.' });

    try {
        await checkSudoers();
        const output = await safeExec(`
            CA_PASSWORD=${ca_password} \
            ${zpkiCmd} \
            -C "${req.session.srcFolder}" \
            ca-test-password
        `);
        req.session.pkiaccess = ca_password;
        if (output instanceof Error) { return res.status(500).json({ error: 'Incorrect passphrase.' }); }
        return res.json({ response: 'Passphrase saved!' });
    } catch (error) {
        res.status(400).json({ error: 'Incorrect passphrase.' });
    }
});

// Route to get session passphrase
app.get('/is-locked', async (req, res) => {
    if (!req.session.pkiaccess) return res.json({ response: false });
    if (!req.session.srcFolder) return res.status(400).json({ error: 'Current profile directory is not set.' });

    try {
        await checkSudoers();
        const output = await safeExec(`
            CA_PASSWORD=${req.session.caPassword} \
            ${zpkiCmd} \
            -C "${req.session.srcFolder}" \
            ca-test-password
        `);
        return res.json({ response: true });
        if (output instanceof Error) { return res.json({ response: true }); }
    } catch (error) {
        res.json({ response: false });
    }
});

app.listen(port, () => {
    console.log(`Server started: http://localhost:${port}`);
});
