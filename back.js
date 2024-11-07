const { exec } = require('child_process');

const fs = require('fs');
const crypto = require('crypto');

const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');

const cors = require('cors');
const express = require('express');
const session = require('express-session');

// Set basic variables
const app = express();
const port = 3000;
let srcDir;

// Centralized error handling middleware
const handleError = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: err.message });
};

// Validate certificate name
const validateName = (name) => {
    const regex = /^[a-zA-Z0-9-_ ]+$/;
    return regex.test(name) && name.length > 0 && name.length < 64;
};

// Check if current user is in sudoers
const checkSudoers = () => {
    return new Promise((resolve, reject) => {
        exec('sudo -l', (error, stdout, stderr) => {
            if (error) {
                reject(new Error("You don't have sudo privileges."));
            } else {
                resolve(true);
            }
        });
    });
};

// Setup
app.use(cors({ methods: ['GET', 'POST'] }));
app.use(express.static(__dirname));
app.use(rateLimit({ windowMs: 1 * 60 * 1000, max: 1000, message: { error: 'API Rate Limit Exceeded.' }}));
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
        maxAge: 600000,
        secure: false,
        httpOnly: true,
    }
}));

// Route to serve main page & select a default profile
app.get('/', (req, res) => {
    if (req.session.currentProfile) {
        srcDir = path.join(__dirname, req.session.currentProfile);
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});

// Route to get all available profiles
app.get('/profiles', (req, res) => {
    fs.readdir(__dirname, { withFileTypes: true }, (err, files) => {
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
        fs.readdir(__dirname, { withFileTypes: true }, (err, files) => { 
            if (err) {
                return res.status(500).json({ error: 'Unable to scan directory: ' + err });
            } else {
                srcDir = path.join(__dirname, files
                    .filter(file => file.isDirectory() && file.name !== '.git' 
                        && file.name !== 'images' && file.name !== 'node_modules')
                    .map(file => file.name)[0])
                    .split('/').pop()
                res.json({ currentProfile: srcDir });
            }
        });
    }
    else if (currentProfile) res.json({ currentProfile });
    else return 'Select a profile';
});

// Route to get the list of certificates
app.get('/list', (req, res, next) => {
    if (!srcDir) return res.status(400).json({ error: 'Current profile directory is not set.' });
    }

    checkSudoers();
    exec('sudo -n $PWD/zpki -C ' + srcDir + ' ca-list --json', (error, stdout) => {
        if (error) return res.status(400).json({ error: 'No certificate found, please create one.' });
        res.json(JSON.parse(stdout));
    });
});

// Route to switch profile
app.post('/switch-profile', (req, res) => {
    const { profile } = req.body;
    const currentPath = path.join(__dirname, profile);

    fs.stat(currentPath, (err, stats) => {
        if (err || !stats.isDirectory()) {
            return res.status(400).json({ error: 'Invalid profile.' });
        }

        srcDir = currentPath;
        req.session.currentProfile = profile;
        req.session.pkiaccess = '';
        return res.json({ response: `Profile switched to ${profile}.` });
    });
});

// Route to create certificates
app.post('/create', async (req, res, next) => {
    const { commonName, subject, sanIP, sanDNS, ca_password } = req.body;
    const type = 'server_ext'; // Will be used above in the future
    const password = ''; // Will be used above in the future

    if (!srcDir) return res.status(400).json({ error: 'Current profile directory is not set.' });
    if (!commonName) return res.status(400).json({ error: 'Common Name argument is empty.' });
    if (!validateName(commonName)) return res.status(400).json({ error: `Invalid certificate name (${commonName}). Only alphanumeric characters, spaces, hyphens, and underscores are allowed, and the length must be between 1 and 64 characters.` });

    try {
        await checkSudoers();
        await execPromise(`
            CA_PASSWORD=${ca_password} \
            PASSWORD=${password === '' ? '' : password} \
            EXT=${type} \
            sudo -n $PWD/zpki \
            -C "${srcDir}" \
            -y ${password === '' ? '-c none' : ''} \
            ca-create-crt "${subject === '' ? commonName : subject}" \
            ${(sanIP || []).map(ip => `IP:${ip}`).join(' ')} \
            ${(sanDNS || []).map(dns => `DNS:${dns}`).join(' ')}
        `);
        res.json({ response: 'Certificate created successfully!' });
    } catch (error) {
        res.status(400).json({ error: 'Certificate creation error.' });
    }
});

// Route to renew certificates
app.post('/renew', async (req, res, next) => {
    const { commonName, ca_password } = req.body;

    if (!srcDir) return res.status(400).json({ error: 'Current profile directory is not set.' });
    if (!commonName) return res.status(400).json({ error: 'Common Name argument is empty.' });
    if (!validateName(commonName)) return res.status(400).json({ error: `Invalid certificate ID (${commonName}).` });

    try {
        await checkSudoers();
        await execPromise(`
            CA_PASSWORD=${ca_password} \
            sudo -n $PWD/zpki \
            -C "${srcDir}" \
            -y -c none \
            ca-update-crt "${commonName}"
        `);
        res.json({ response: 'Certificate renewed successfully!' });
    } catch (error) {
        res.status(400).json({ error: 'Certificate renewal error.' });
    }
});

// Route to revoke certificates
app.post('/revoke', async (req, res, next) => {
    const { commonName, ca_password } = req.body;

    if (!srcDir) return res.status(400).json({ error: 'Current profile directory is not set.' });
    if (!commonName) return res.status(400).json({ error: 'Common Name argument is empty.' });
    if (!validateName(commonName)) return res.status(400).json({ error: `Invalid certificate ID (${commonName}).` });

    try {
        await checkSudoers();
        await execPromise(`
            CA_PASSWORD=${ca_password} \
            sudo -n $PWD/zpki \
            -C "${srcDir}" \
            -y -c none \
            ca-revoke-crt "${commonName}"
        `);
        res.json({ response: 'Certificate revoked successfully!' });
    } catch (error) {
        res.status(400).json({ error: 'Certificate revocation error.' });
    }
});

// Route to disable certificates
app.post('/disable', async (req, res, next) => {
    const { commonName, ca_password } = req.body;

    if (!srcDir) return res.status(400).json({ error: 'Current profile directory is not set.' });
    if (!commonName) return res.status(400).json({ error: 'Common Name argument is empty.' });
    if (!validateName(commonName)) return res.status(400).json({ error: `Invalid certificate ID (${commonName}).` });

    try {
        await checkSudoers();
        await execPromise(`
            CA_PASSWORD=${ca_password} \
            sudo -n $PWD/zpki \
            -C "${srcDir}" \
            -y -c none \
            ca-disable-crt "${commonName}"
        `);
        res.json({ response: 'Certificate disabled successfully!' });
    } catch (error) {
        res.status(400).json({ error: 'Certificate deactivation error.' });
    }
});

// Execute command
const execPromise = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                return reject(new Error(stderr));
            }
            resolve(stdout.trim());
        });
    });
};

// Route to define session passphrase
app.post('/set-password', async (req, res, next) => {
    const { ca_password } = req.body;

    if (!srcDir) return res.status(400).json({ error: 'Current profile directory is not set.' });

    try {
        await checkSudoers();
        await execPromise(`
            CA_PASSWORD=${ca_password} \
            sudo -n $PWD/zpki \
            -C "${srcDir}" \
            ca-test-password
        `);
        req.session.pkiaccess = ca_password;
        return res.json({ response: 'Passphrase saved!' });
    } catch (error) {
        res.status(400).json({ error: 'Incorrect passphrase.' });
    }
});

// Route to get session passphrase
app.get('/get-password', (req, res) => { 
    if (req.session.pkiaccess) res.json({ pkiaccess: req.session.pkiaccess });
    else res.json({ pkiaccess: '' });
});

app.listen(port, () => {
    console.log(`Server started: http://localhost:${port}`);
});
