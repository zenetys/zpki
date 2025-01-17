# ZPKI - v1.1

## Installation

### 1. Install system dependencies

Install `npm` using `apt`:
```console
$ sudo apt install npm
```

Then, install `nodejs` via `npm`:
```console
$ npm install nodejs
```

### 2. Download the project from GitHub
```console
$ git clone https://github.com/zenetys/zpki.git
$ cd zpki
```

### 3. Start the project
Once the dependencies are installed, **build** and **start** the project using the following command:
```console
$ npm run build
```

This will install **dependencies** and start the **API**.  
If you want to simply **start** the project, you can use the following command:
```console
$ npm run start
```

### 4. Verify the setup
The interface should now be accessible on **port 3000**. You can verify this by opening a web browser and navigating to **[localhost:3000](http://localhost:3000)** or **[127.0.0.1:3000](http://127.0.0.1:3000)**.


### 5. Create the first CA
Now, you can create the first **certificate authority** (CA), see next section to **get started**.


# CLI management

### Usage

```console
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

```console
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

```console
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

```console
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

```console
$ zpki -C ZPKI-Demo-CA -y -c none ca-revoke-crt "zpki.acme.loc"
```
```console
: openssl ca -config ca.cnf -batch -revoke certs/zpki_acme_loc.crt
Enter pass phrase for ./ca.key: *********
: openssl ca -gencrl -config ca.cnf -out ca.crl -batch
Enter pass phrase for ./ca.key: *********
```

### List certificates

```console
$ zpki -C ZPKI-Demo-CA ca-list --json | jq
```
```console
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
