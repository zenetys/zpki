# ZPKI

### Overview
ZPKI is a command-line utility for managing a Public Key Infrastructure (PKI). It provides commands for creating and managing certificates, keys, and Certificate Authorities (CAs) using OpenSSL.

### Usage
```
zpki 1.0 - Benoit DOLEZ <bdolez@zenetys.com> - MIT License
Usage: zpki [options] ACTION [ACTION-PARAMETERS]
Options:
 -h, --help              Display help message
 -V, --version           View version
 -C, --ca                Set current CA base directory
 -q, --quiet             Set verbose level to 0
 -y, --yes               Validate all responses
 -v, --verbose           Define verbose level (must be repeat)
 -c, --cipher [CIPHER]   Define cipher for key (none for no encryption)
 --force                 Regenerate CSR even if it exists (e.g. change in SANs)
 --json                  Format using JSON
 --no-utf8               Disable default UTF8 encoding
 --x-debug               Enable bash debug mode

<ACTION> is one of:
 create-cnf
     └─ Generate a default OpenSSL configuration file
 create-key [CN|SUBJ]
     └─ Create a key file
 create-csr [CN|SUBJ] <ALTNAMES>
     └─ Generate a certificate signing request (CSR) file
 create-self [CN|SUBJ] <ALTNAMES>
     └─ Create a self-signed certificate
 create-ca [CN|SUBJ]
     └─ Create a Certificate Authority (CA) and its storage
 ca-create-crt [CN|SUBJ] <ALTNAMES>
     └─ Create a certificate
 ca-update-db
     └─ Reload all certificates in the ca.idz file
 ca-list
     └─ List certificates stored in the CA
 ca-sign-csr [CN|SUBJ|CSRFILE]
     └─ Sign a CSR file using the CA
 ca-update-crt [CN|SUBJ|CRTFILE]
     └─ Update a certificate
 ca-revoke-crt [CN|SUBJ|CRTFILE]
     └─ Revoke a certificate
 ca-disable-crt [CN|SUBJ|CRTFILE]
     └─ Definitly disable a certificate
 ca-display-crt [CRTFILE]
     └─ Display an entire certificate file (.crt)
 ca-update-dump-crt [CRTFILE]
     └─ Update and dump the content of a certificate file (.crt) file
 ca-dump-crt [CRTFILE]
     └─ Dump the content of a certificate (.crt) file
 ca-dump-csr [CSRFILE]
     └─ Dump the content of a certificate signing request (.csr) file
 ca-dump-key [KEYFILE]
     └─ Dump the content of a private key (.key) file
 ca-dump-pkcs12 [KEYFILE]
     └─ Dump the content of certificate in the pkcs12 format
 ca-test-password
     └─ Test if CA passphrase is correct

For Subject Alternative Names (SANs), add address type: DNS:<FQDN>, IP:ADDR
```


### Examples

#### Create a Certificate Authority (CA) without passphrase
```
$ zpki -C ca-no-passphrase -y -c none create-ca "EXAMPLE CA"
```
```
: openssl genrsa -out ca.key 4096
ca.cnf: already exists, bypass
ca.key: already exists, bypass
: openssl req -batch -new -x509 -days 366 -utf8 -out ca.crt -key ca.key -subj '/CN=EXAMPLE CA' -config ca.cnf -extensions ca_ext
```

#### Create a Certificate Authority (CA) with passphrase
```
$ zpki -C ca-with-passphrase -y create-ca "EXAMPLE CA PASSPHRASE"
```
```
: openssl genrsa -out ca.key -aes256 4096
Enter PEM pass phrase: *********
Verifying - Enter PEM pass phrase: *********
ca.cnf: already exists, bypass
ca.key: already exists, bypass
: openssl req -batch -new -x509 -days 366 -utf8 -out ca.crt -key ca.key -subj '/CN=EXAMPLE CA PASSPHRASE' -config ca.cnf -extensions ca_ext
Enter pass phrase for ca.key: *********
```

#### Create Certificates
```
$ zpki -C ca-no-passphrase -y -c none ca-create-crt "Certificate Example"
```
```
: openssl genrsa -out private/Certificate_Example.key 4096
: openssl req -batch -new -utf8 -out certs/Certificate_Example.csr -key private/Certificate_Example.key -subj '/CN=Certificate Example'
: openssl ca -config ca.cnf -batch -in certs/Certificate_Example.csr -out certs/Certificate_Example.crt -days 366 -extensions x509v3_ext
: openssl ca -updatedb -config ca.cnf -batch
```

```
$ zpki -C ca-with-passphrase -y -c none ca-create-crt "Certificate Example Passphrase"
```
```
: openssl genrsa -out private/Certificate_Example_Passphrase.key 4096
: openssl req -batch -new -utf8 -out certs/Certificate_Example_Passphrase.csr -key private/Certificate_Example_Passphrase.key -subj '/CN=Certificate Example Passphrase'
: openssl ca -config ca.cnf -batch -in certs/Certificate_Example_Passphrase.csr -out certs/Certificate_Example_Passphrase.crt -days 366 -extensions x509v3_ext
Enter pass phrase for ./ca.key: *********
: openssl ca -updatedb -config ca.cnf -batch
Enter pass phrase for ./ca.key: *********
```

#### Renew a Certificate
```
$ zpki -C ca-no-passphrase -y ca-update-crt "Certificate Example"
```
```
: openssl ca -config ca.cnf -batch -revoke certs/Certificate_Example.crt -gencrl
certs/Certificate_Example.csr: already exists, bypass
: openssl ca -config ca.cnf -batch -in certs/Certificate_Example.csr -out certs/Certificate_Example.crt -days 366 -extensions x509v3_ext
: openssl ca -updatedb -config ca.cnf -batch
```

```
$ zpki -C ca-with-passphrase -y ca-update-crt "Certificate Example Passphrase"
```
```
: openssl ca -config ca.cnf -batch -revoke certs/Certificate_Example_Passphrase.crt -gencrl
Enter pass phrase for ./ca.key: *********
certs/Certificate_Example_Passphrase.csr: already exists, bypass
: openssl ca -config ca.cnf -batch -in certs/Certificate_Example_Passphrase.csr -out certs/Certificate_Example_Passphrase.crt -days 366 -extensions x509v3_ext
Enter pass phrase for ./ca.key: *********
: openssl ca -updatedb -config ca.cnf -batch
Enter pass phrase for ./ca.key: *********
```

#### Revoke a Certificate
```
$ zpki -C ca-no-passphrase -y ca-revoke-crt "Certificate Example"
```
```
: openssl ca -config ca.cnf -batch -revoke certs/Certificate_Example.crt -gencrl
```

```
$ zpki -C ca-with-passphrase -y ca-revoke-crt "Certificate Example"
```
```
: openssl ca -config ca.cnf -batch -revoke certs/Certificate_Example_Passphrase.crt -gencrl
Enter pass phrase for ./ca.key: *********
```

#### Disable a Certificate
```
$ zpki -C ca-no-passphrase -y ca-disable-crt "Certificate Example"
```
```
: openssl ca -config ca.cnf -batch -revoke certs/Certificate_Example.crt -gencrl
INFO: '/CN=Certificate Example' disabled
```

```
$ zpki -C ca-with-passphrase -y ca-disable-crt "Certificate Example Passphrase"
```
```
: openssl ca -config ca.cnf -batch -revoke certs/Certificate_Example_Passphrase.crt -gencrl
Enter pass phrase for ./ca.key: *********
INFO: '/CN=Certificate Example Passphrase' disabled
```

#### List the certificates of a CA
```
$ zpki -C ca-no-passphrase ca-list --json | jq
```
```
[
  {
    "status": "D",
    "expiration": "2025-11-07T09:40:41+01:00",
    "revocation": "2024-11-06T09:41:07+01:00",
    "serial": "10EE6C717433",
    "id": "Certificate Example",
    "hash": "a443978b",
    "issuer": "/CN=Certificate Example",
    "cn": "Certificate Example",
    "subject": "/CN=Certificate Example",
    "startDate": "2024-11-06T10:40:41+01:00",
    "endDate": "2025-11-07T09:40:41+01:00",
    "keyStatus": "plain"
  }
]
```
