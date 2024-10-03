const { exec, spawn } = require('child_process');

const fs = require('fs');
const crypto = require('crypto');

const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');

const cors = require('cors');
const express = require('express');
const cookieSession = require('cookie-session');

// Set basic variables
const app = express();
const port = 3000;
const srcDir = path.join(__dirname, 'src');

// Centralized error handling middleware
const handleError = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: err.message });
};

// Setup
app.use(rateLimit({ windowMs: 1 * 60 * 1000, max: 1000, message: { error: 'API Rate Limit Exceeded.' }}));
app.use(cors({ methods: ['GET', 'POST'] }));
app.use('/src', express.static(srcDir));
app.use(express.static(__dirname));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(handleError);
app.use(helmet());

app.use(cookieSession({
    name: 'session',
    keys: [crypto.randomBytes(16).toString('hex'), crypto.randomBytes(16).toString('hex')],
    maxAge: 600000
}));

// Function to find a unique certificate name
const findUniqueCertName = (baseName) => {
    let uniqueName = baseName;
    let index = 1;
    while (fs.existsSync(path.join(__dirname, 'src', 'certs', `${uniqueName}.crt`))) {
        uniqueName = `${baseName}${index}`;
        index++;
    }
    return uniqueName;
};

// Function to validate certificate name
const validateName = (name) => {
    const regex = /^[a-zA-Z0-9-_ ]+$/;

    for (const command of ['sudo', 'bash', 'sh', 'exec', 'system', 'kill', 'rm', 'mv', 'cp', 'dd', 'curl', 'wget', 'chmod', 'chown', 'ln']) {
        if (name.toLowerCase().includes(command)) {
            return false;
        }
    }
    return regex.test(name) && name.length > 0 && name.length < 64;
};

// Function to validate count parameter
const validateCount = (count) => {
    return Number.isInteger(count) && count > 0;
};

// Route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to get the list of certificates
app.get('/list', (req, res, next) => {
    exec('./zpki ca-list --json', { cwd: srcDir }, (error, stdout) => {
        if (error) return next(error);
        res.json(JSON.parse(stdout));
    });
});

// Route to create certificates
app.get('/create', async (req, res, next) => {
    const certName = req.query.name;
    const count = parseInt(req.query.count);

    // Validate certificate name
    if (!validateName(certName)) {
        return res.status(400).json({ error: `Invalid certificate name (${certName}). Only alphanumeric characters, spaces, hyphens, and underscores are allowed, and the length must be between 1 and 64 characters.` });
    }

    // Validate count
    if (!validateCount(count)) {
        return res.status(400).json({ error: `Invalid count value. It must be a positive integer.` });
    }

    const createCert = (uniqueCertName) => {
        return new Promise((resolve, reject) => {
            const process = spawn('./zpki', ['-y', '-c', 'none', 'create-crt', uniqueCertName], { cwd: srcDir });

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

    const processCerts = async () => {
        try {
            for (let i = 1; i <= count; i++) {
                const uniqueCertName = findUniqueCertName(certName);
                await createCert(uniqueCertName);
            }
            res.json({ response: `${count} certificates generated.` });
        } catch (error) {
            next(error);
        }
    };
    processCerts();
});

// Route to revoke certificates
app.post('/revoke', (req, res, next) => {
    const { id } = req.body;
    if (!Array.isArray(id)) {
        return res.status(400).json({ error: 'Invalid list of certificates.' });
    }

    for (const name of id) {
        if (!validateName(name)) {
            return res.status(400).json({ error: `Invalid certificate name (${name}). Only alphanumeric characters, spaces, hyphens, and underscores are allowed, and the length must be between 1 and 64 characters.` });
        }
    }

    const revokeCert = (name) => {
        return new Promise((resolve, reject) => {
            const process = spawn('./zpki', ['-y', '-c', 'none', 'ca-revoke-crt', name], { cwd: srcDir });

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

    const processRevocations = async () => {
        const certData = readCertData();
        const certMap = new Map(certData.map(cert => [cert.id, cert]));

        try {
            for (const name of id) {
                if (!certMap.has(name)) {
                    return res.status(404).json({ error: `Certificate with ID ${name} not found.` });
                }
                await revokeCert(name);
            }
            res.json({ response: 'Certificates revoked.' });
        } catch (error) {
            next(error);
        }
    };
    processRevocations();
});

// Route to renew certificates
app.post('/renew', (req, res, next) => {
    const { id } = req.body;
    if (!Array.isArray(id)) {
        return res.status(400).json({ error: 'Invalid list of certificates.' });
    }

    for (const name of id) {
        if (!validateName(name)) {
            return res.status(400).json({ error: `Invalid certificate name (${name}). Only alphanumeric characters, spaces, hyphens, and underscores are allowed, and the length must be between 1 and 64 characters.` });
        }
    }

    const renewCert = (name) => {
        return new Promise((resolve, reject) => {
            const process = spawn('./zpki', ['-y', '-c', 'none', 'ca-update-crt', name], { cwd: srcDir });

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

    const processRenewals = async () => {
        const certData = readCertData();
        const certMap = new Map(certData.map(cert => [cert.id, cert]));

        try {
            for (const name of id) {
                if (!certMap.has(name)) {
                    return res.status(404).json({ error: `Certificate with ID ${name} not found.` });
                }
                await renewCert(name);
            }
            res.json({ response: 'Certificates renewed.' });
        } catch (error) {
            next(error);
        }
    };
    processRenewals();
});

// Route pour définir le mot de passe
app.post('/set-password', (req, res) => {
    const password = req.body.password;
    if (password) {
        req.session.pkiaccess = password;
        return res.send('Mot de passe enregistré avec succès !');
    }
    return res.status(400).send('Mot de passe manquant.');
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