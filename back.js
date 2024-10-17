const { exec, spawn } = require('child_process');

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

// Function to validate certificate name
const validateName = (name) => {
    const regex = /^[a-zA-Z0-9-_ ]+$/;
    return regex.test(name) && name.length > 0 && name.length < 64;
};

// Setup
app.use(rateLimit({ windowMs: 1 * 60 * 1000, max: 1000, message: { error: 'API Rate Limit Exceeded.' }}));
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
        maxAge: 600000,
        secure: false,
        httpOnly: true,
    }
}));

// Route to serve index.html
app.get('/', (req, res) => {
    if (!req.session.currentProfile) {
        const directoryPath = __dirname;
        fs.readdir(directoryPath, { withFileTypes: true }, (err, files) => {
            if (err) {
                return res.status(500).json({ error: 'Unable to scan directory: ' + err });
            }
            const profiles = files
                .filter(file => file.isDirectory() && file.name !== 'images' && file.name !== '.git')
                .map(file => file.name);

            if (profiles.length > 0) {
                req.session.currentProfile = profiles[0];
                srcDir = path.join(__dirname, req.session.currentProfile);
            } else {
                return res.status(404).json({ error: 'No valid profiles found.' });
            }
            res.sendFile(path.join(__dirname, 'index.html'));
        });
    } else {
        srcDir = path.join(__dirname, req.session.currentProfile);
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});

// Route to get all available profiles
app.get('/profiles', (req, res) => {
    const directoryPath = __dirname;
    fs.readdir(directoryPath, { withFileTypes: true }, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to scan directory: ' + err });
        }
        const profiles = files
            .filter(file => file.isDirectory() && file.name !== 'images' && file.name !== '.git')
            .map(file => file.name);
        res.json(profiles);
    });
});

// Route to get current profile
app.get('/current-profile', (req, res) => {
    const currentProfile = req.session.currentProfile || 'Select a profile';
    res.json({ currentProfile });
});

// Route to get the list of certificates
app.get('/list', (req, res, next) => {
    if (!srcDir) {
        return res.status(400).json({ error: 'Current profile directory is not set.' });
    }

    exec('./zpki -C ' + srcDir + ' ca-list --json', (error, stdout) => {
        if (error) return next(error);
        res.json(JSON.parse(stdout));
    });
});

// Route to switch profile
app.post('/switch-profile', (req, res) => {
    const { profile } = req.body;
    const currentPath = path.join(__dirname, profile);

    fs.stat(currentPath, (err, stats) => {
        if (err || !stats.isDirectory()) {
            return res.status(400).json({ error: 'Invalid profile' });
        }

        srcDir = currentPath;
        req.session.currentProfile = profile;
        return res.json({ message: `Profile switched to ${profile}` });
    });
});

// Route to create certificates
app.post('/create', async (req, res, next) => {
    const { name, passphrase } = req.body;

    // Validate certificate name
    if (!validateName(name)) {
        return res.status(400).json({ error: `Invalid certificate name (${name}). Only alphanumeric characters, spaces, hyphens, and underscores are allowed, and the length must be between 1 and 64 characters.` });
    }

    const createCert = (uniqueCertName) => {
        return new Promise((resolve, reject) => {
            const process = spawn('./zpki', ['-C', srcDir, '-y', '-c', 'none', 'create-crt', uniqueCertName]);

            let stdout = '';
            let stderr = '';

            process.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            process.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            process.on('close', (code) => {
                if (code !== 0) {
                    return reject(new Error(`Creation error: ${stderr}`));
                }
                resolve(stdout);
            });
        });
    };

    try {
        const result = await createCert(name);
        res.json({ message: 'Certificate created successfully', output: result });
    } catch (error) {
        next(error);
    }
});

// Route to renew certificates
app.post('/renew', (req, res, next) => {
    const { id } = req.body;
    if (!Array.isArray(id)) {
        return res.status(400).json({ error: 'Invalid list of certificates.' });
    }

    for (const name of id) {
        if (!validateName(name)) {
            return res.status(400).json({ error: `Invalid certificate name (${name}).` });
        }
    }

    const renewCert = (name) => {
        return new Promise((resolve, reject) => {
            const process = spawn('./zpki', ['-C', srcDir, '-y', '-c', 'none', 'ca-update-crt', name]);
            let stdout = '';
            let stderr = '';

            process.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            process.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            process.on('close', (code) => {
                if (code !== 0) {
                    return reject(new Error(`Renewal error: ${stderr}`));
                }
                resolve(stdout);
            });
        });
    };

    Promise.all(id.map(renewCert))
        .then(results => res.json({ message: 'Certificates renewed successfully', outputs: results }))
        .catch(next);
});

// Route to revoke certificates
app.post('/revoke', (req, res, next) => {
    const { id } = req.body;
    if (!Array.isArray(id)) {
        return res.status(400).json({ error: 'Invalid list of certificates.' });
    }

    for (const name of id) {
        if (!validateName(name)) {
            return res.status(400).json({ error: `Invalid certificate name (${name}).` });
        }
    }

    const revokeCert = (name) => {
        return new Promise((resolve, reject) => {
            const process = spawn('./zpki', ['-C', srcDir, '-y', '-c', 'none', 'ca-revoke-crt', name]);
            let stdout = '';
            let stderr = '';

            process.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            process.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            process.on('close', (code) => {
                if (code !== 0) {
                    return reject(new Error(`Revocation error: ${stderr}`));
                }
                resolve(stdout);
            });
        });
    };

    Promise.all(id.map(revokeCert))
        .then(results => res.json({ message: 'Certificates revoked successfully', outputs: results }))
        .catch(next);
});

// Route to disable certificates
app.post('/disable', (req, res, next) => {
    const { id } = req.body;
    if (!Array.isArray(id)) {
        return res.status(400).json({ error: 'Invalid list of certificates.' });
    }

    for (const name of id) {
        if (!validateName(name)) {
            return res.status(400).json({ error: `Invalid certificate name (${name}).` });
        }
    }

    const disableCert = (name) => {
        return new Promise((resolve, reject) => {
            const process = spawn('./zpki', ['-C', srcDir, '-y', '-c', 'none', 'ca-disable-crt', name]);
            let stdout = '';
            let stderr = '';

            process.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            process.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            process.on('close', (code) => {
                if (code !== 0) {
                    return reject(new Error(`Revocation error: ${stderr}`));
                }
                resolve(stdout);
            });
        });
    };

    Promise.all(id.map(disableCert))
        .then(results => res.json({ message: 'Certificates disabled successfully', outputs: results }))
        .catch(next);
});

// Route pour définir le mot de passe
app.post('/set-password', (req, res) => {
    const password = req.body.password;
    if (password) {
        req.session.pkiaccess = password;
        return res.json({ response: 'Password saved!' });
    }
    return res.json({ response: 'Missing password.' });
});

// Route pour vérifier l'accès et récupérer le mot de passe
app.get('/get-password', (req, res) => {
    if (req.session.pkiaccess) {
        res.json({ pkiaccess: req.session.pkiaccess });
    } else {
        res.json({ pkiaccess: '' });
    }
});

app.listen(port, () => {
    console.log(`Server started: http://localhost:${port}`);
});
