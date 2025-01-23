# ZPKI - v1.1

## Installation

### 1. Install system dependencies

Install `npm` using `apt`:
```
$ sudo apt install nodejs npm
```

### 2. Download the project from GitHub
```
$ git clone https://github.com/zenetys/zpki.git
$ cd zpki
```

### 3. Start the project
Once the dependencies are installed, **build** and **start** the project using the following command:
```
$ npm run build
```

This will install **dependencies** and start the **API**.  
If you want to simply install all dependencies without building the project, you can use:
```
$ npm install
```

### 4. Verify the setup
The interface should now be accessible on **port 3000**. You can verify this by opening a web browser and navigating to **[localhost:3000](http://localhost:3000)** or **[127.0.0.1:3000](http://127.0.0.1:3000)**.


### 5. Create the first CA
Now, you can create the first **certificate authority** (CA), see next section to **get started**.


# CLI management

### Usage

```
$ zpki [options] ACTION [parameters]
```

### Options

- `-h, --help`              Display help message
- `-V, --version`           View version
- `-C, --ca`                Set current CA base directory
- `-q, --quiet`             Set verbose level to 0
- `-y, --yes`               Validate all responses
- `-v, --verbose`           Define verbose level (must be repeat)
- `-c, --cipher [CIPHER]`   Define cipher for key (none for no encryption)
- `--force-crt`             Regenerate CRT even if it exists (e.g., change in SANs)
- `--force-csr`             Regenerate CSR even if it exists (e.g., change in SANs)
- `--json`                  Format using JSON
- `--no-utf8`               Disable default UTF8 encoding
- `--x-debug`               Enable bash debug mode

### Actions

- `create-cnf`: Generate a default OpenSSL configuration file
- `create-key [CN|SUBJ]`: Create a key file
- `create-csr [CN|SUBJ] <ALTNAMES>`: Generate a certificate signing request (CSR) file
- `create-self [CN|SUBJ] <ALTNAMES>`: Create a self-signed certificate
- `create-ca [CN|SUBJ]`: Create a Certificate Authority (CA) and its storage
- `ca-create-crt [CN|SUBJ] <ALTNAMES>`: Create a certificate
- `ca-update-crl`: Generate the CRL
- `ca-update-db`: Reload all certificates in the `ca.idz` file
- `ca-list`: List certificates stored in the CA
- `ca-sign-csr [CN|SUBJ|CSRFILE]`: Sign a CSR file using the CA
- `ca-update-crt [CN|SUBJ|CRTFILE]`: Update a certificate
- `ca-revoke-crt [CN|SUBJ|CRTFILE]`: Revoke a certificate
- `ca-disable-crt [CN|SUBJ|CRTFILE]`: Disable a certificate permanently
- `ca-display-crt [CRTFILE]`: Display an entire certificate file (.crt)
- `ca-update-dump-crt [CRTFILE]`: Update and dump the content of a certificate file (.crt)
- `ca-dump-crt [CRTFILE]`: Dump the content of a certificate (.crt) file
- `ca-dump-csr [CSRFILE]`: Dump the content of a certificate signing request (.csr) file
- `ca-dump-key [KEYFILE]`: Dump the content of a private key (.key) file
- `ca-dump-pkcs12 [KEYFILE]`: Dump the content of a certificate in the pkcs12 format
- `ca-test-password`: Test if the CA passphrase is correct

For Subject Alternative Names (SANs), add address types like: `DNS:<FQDN>`, `IP:ADDR`.

## Examples

### Create a Certificate Authority (CA)

```
$ zpki -C ZPKI-Demo-CA -y create-ca "ZPKI Demo Certificate Authority"
```
```console
: openssl genrsa -out ca.key -aes256 4096
Enter PEM pass phrase: *********
Verifying - Enter PEM pass phrase: *********
ca.cnf: already exists, bypass
ca.key: already exists, bypass
: openssl req -batch -new -x509 -days 366 -utf8 -out ca.crt -key ca.key -subj '/CN=ZPKI Demo CA' -config ca.cnf -extensions ca_ext
Enter pass phrase for ca.key: *********
: openssl ca -gencrl -config ca.cnf -out ca.crl -batch
Enter pass phrase for ./ca.key: *********
```

### Create a Certificate

In the following command, `DNS` and `IP` are used to specify the **Subject Alternative Names** (SANs).

```
$ zpki -C ZPKI-Demo-CA -y -c none ca-create-crt "zpki.acme.loc" DNS:zpki.acme.loc IP:10.109.42.104
```
```console
: openssl genrsa -out private/zpki_acme_loc.key 4096
: openssl req -batch -new -utf8 -out certs/zpki_acme_loc.csr -key private/zpki_acme_loc.key -subj /CN=zpki.acme.loc -addext 'subjectAltName=DNS:zpki.acme.loc,IP:10.109.42.104'
: openssl ca -config ca.cnf -batch -in certs/zpki_acme_loc.csr -out certs/zpki_acme_loc.crt -days 366 -extensions server_ext
Enter pass phrase for ./ca.key: *********
: openssl ca -updatedb -config ca.cnf -batch
Enter pass phrase for ./ca.key: *********
Updated ca.idz file
```

#### Renew a Certificate

In the following command, `ZPKI_EXT` and `ZPKI_CA_PASSWORD` are used to define the certificate extension and the CA password respectively.

```
$ ZPKI_EXT=server_ext ZPKI_CA_PASSWORD=x9ZAyX289 zpki -C ZPKI-Demo-CA -y -c none ca-update-crt "zpki.acme.loc" DNS:zpki.acme.loc IP:10.109.42.104
```
```console
: openssl ca -config ca.cnf -batch -revoke certs/zpki_acme_loc.crt -passin 'env:ZPKI_CA_PASSWORD'
: openssl ca -gencrl -config ca.cnf -out ca.crl -batch -passin 'env:ZPKI_CA_PASSWORD'
certs/zpki_acme_loc.csr: already exists, bypass
: openssl ca -config ca.cnf -batch -in certs/zpki_acme_loc.csr -out certs/zpki_acme_loc.crt -days 366 -extensions server_ext -passin 'env:ZPKI_CA_PASSWORD'
: openssl ca -updatedb -config ca.cnf -batch -passin 'env:ZPKI_CA_PASSWORD'
Updated ca.idz file
```

### Revoke a Certificate

```
$ zpki -C ZPKI-Demo-CA -y -c none ca-revoke-crt "zpki.acme.loc"
```
```console
: openssl ca -config ca.cnf -batch -revoke certs/zpki_acme_loc.crt
Enter pass phrase for ./ca.key: *********
: openssl ca -gencrl -config ca.cnf -out ca.crl -batch
Enter pass phrase for ./ca.key: *********
```

### List certificates

```
$ zpki -C ZPKI-Demo-CA ca-list --json | jq
```
```json
[
  {
    "status": "R",
    "expiration": "2026-01-18T15:50:49Z",
    "revocation": "2025-01-17T15:52:07Z",
    "serial": "D2AFB6054BD8",
    "id": "zpki.acme.loc",
    "hash": "ae0d1e17",
    "issuer": "/CN=ZPKI Demo CA",
    "cn": "zpki.acme.loc",
    "subject": "/CN=zpki.acme.loc",
    "startDate": "2025-01-17T15:50:49Z",
    "endDate": "2026-01-18T15:50:49Z",
    "keyStatus": "plain",
    "type": "server_ext"
  }
]
```

# Server deployment example

### Base tree structure
```bash
.
├── data/
│   └── zpki/
│       └── CA.zpki/
│           ├── CA-Example-1/     # First Certificate Authority
│           └── CA-Example-2/     # Second Certificate Authority
├── opt/
│   └── zpki/
│       ├── api.js                # Node.js API
│       ├── ca-folders            # List CA folders script
│       ├── icons/                # Icons folder
│       ├── index.html            # Main page
│       ├── main.css              # Main CSS
│       ├── main.js               # Main Js
│       ├── node_modules/         # Node.js modules
│       ├── package.json          # Node.js package
│       ├── package-lock.json     # Node.js package lock
│       └── zpki                  # Main script
└── etc/
    ├── sudoers.d/
    │   └── zpki                  # Sudoers configuration file
    └── systemd/system/
        └── zpki-core.service     # Systemd service configuration file
```

### Create new groups and add new users

Add a user that will read and write to the `/data/zpki` directory:

```
$ groupadd -r zpki-data
$ useradd -r -g zpki-data -d /data/CA.zpki -s /sbin/nologin zpki-data
```

Add a user that will run the server:

```
$ groupadd -r zpki-core
$ useradd -r -g zpki-core -d /opt/zpki -s /sbin/nologin zpki-core
```

### Configure sudoers

Edit the `/etc/sudoers.d/zpki` file:

```
Cmnd_Alias          ZPKI=/opt/zpki/zpki, /opt/zpki/ca-folders
Defaults!ZPKI       env_reset, env_keep="ZPKI_*", !requiretty, !pam_session
zpki-core           ALL=(zpki-data) NOPASSWD: ZPKI
```

### Systemd service file configuration

Edit the `/etc/systemd/system/zpki-core.service` file:

```
[Unit]
Description=zpki-core
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/node /opt/zpki/api.js
User=zpki-core
UMask=0007
Restart=always
SyslogIdentifier=zpki-core

Environment="LISTEN_ADDRESS=127.0.0.1"
Environment="LISTEN_PORT=3000"
Environment="PASSWORD_EXPIRE_MS=600000"
Environment="COOKIE_MAX_AGE_MS=86400000"
Environment="LOG_HTTP_REQUESTS=1"
Environment="CA_BASEDIR=/data/CA.zpki"
Environment="CA_FOLDERS_CMD=sudo -n -u zpki-data /opt/zpki/ca-folders"
Environment="ZPKI_CMD=sudo -n -u zpki-data /opt/zpki/zpki"
Environment="ZPKI_OPENSSL_CMD=/usr/bin/openssl11"
# Environment="TRUST_PROXY=loopback,{IP Adresses}"

[Install]
WantedBy=multi-user.target
```
```
$ systemctl daemon-reload
```

### Set up redirection and proxy

Sample reverse proxy configuration for apache:

```console
Redirect /zpki /zpki/
ProxyPass /zpki/ http://127.0.0.1:3000/ connectiontimeout=5 timeout=30
ProxyPassReverse /zpki/ http://127.0.0.1:3000/
```

If apache configuration is updated, restart the service with:

```
$ systemctl reload httpd
```

### Starting service & check logs

To enable and start the service, use the following commands:

```
$ systemctl enable zpki-core
$ systemctl start zpki-core
```

To restart the service, use:

```
$ systemctl restart zpki-core
```

Check if the service is running:

```
$ systemctl status zpki-core
```

Check logs for errors or verify the service is running:

```
$ journalctl -u zpki-core -f
```
