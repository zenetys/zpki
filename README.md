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
 create-crt [CN|SUBJ] <ALTNAMES>
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

For Subject Alternative Names (SANs), add address type: DNS:<FQDN>, IP:ADDR
```


### Example

#### Setting Up a CA
```
$ mkdir /tmp/test-pki
$ cd /tmp/test-pki
$ zpki -y -c none create-ca "EXAMPLE CA"
: openssl genrsa -out ca.key 4096
: openssl req -batch -new -x509 -days 366 -out ca.crt -key ca.key -subj '/CN=EXAMPLE CA' -config ca.cnf -extensions ca_ext
```

#### Creating Certificates
```
$ zpki -y -c none create-crt "Certificate Example 1"
: openssl genrsa -out private/Certificate_Example_1.key 4096
: openssl req -batch -new -utf8 -out certs/Certificate_Example_1.csr -key private/Certificate_Example_1.key -subj '/CN=Certificate Example 1'
: openssl ca -config ca.cnf -batch -in certs/Certificate_Example_1.csr -out certs/Certificate_Example_1.crt -days 366 -extensions x509v3_ext
: openssl ca -config ca.cnf -updatedb

$ zpki -y -c none create-crt "Certificate Example 2"
: openssl genrsa -out private/Certificate_Example_2.key 4096
: openssl req -batch -new -utf8 -out certs/Certificate_Example_2.csr -key private/Certificate_Example_2.key -subj '/CN=Certificate Example 2'
: openssl ca -config ca.cnf -batch -in certs/Certificate_Example_2.csr -out certs/Certificate_Example_2.crt -days 366 -extensions x509v3_ext
: openssl ca -config ca.cnf -updatedb
```

#### Revoking a Certificate
```
$ zpki -y -c none ca-revoke-crt "Certificate Example 1"
: openssl ca -config ca.cnf -batch -revoke certs/Certificate_Example_1.crt -gencrl
```

#### Renewing a Certificate
```
$ zpki -y -c none ca-update-crt "Certificate Example 2"
: openssl ca -config ca.cnf -batch -revoke certs/Certificate_Example_2.crt -gencrl certs/Certificate_Example_2.csr: already exists, bypass
: openssl ca -config ca.cnf -batch -in certs/Certificate_Example_2.csr -out certs/Certificate_Example_2.crt -days 366 -extensions x509v3_ext
: openssl ca -config ca.cnf -updatedb
```

#### Listing Certificates
```
$ zpki ca-list --json | jq
[
  {
    "status": "V",
    "expiration": "2025-10-05T18:36:31+02+00",
    "serial": "905DF0B1A0E4",
    "id": "Certificate Example 1",
    "hash": "68efa5ed",
    "issuer": "/CN=EXAMPLE CA",
    "cn": "Certificate Example 1",
    "subject": "/CN=Certificate Example 1",
    "startDate": "2024-10-04T20:36:31+02:00",
    "endDate": "2025-10-05T18:36:31+02+00"
  },
  {
    "status": "V",
    "expiration": "2025-10-05T18:36:35+02+00",
    "serial": "905DF0B1A0E5",
    "id": "Certificate Example 2",
    "hash": "358813ab",
    "issuer": "/CN=EXAMPLE CA",
    "cn": "Certificate Example 2",
    "subject": "/CN=Certificate Example 2",
    "startDate": "2024-10-04T20:36:35+02:00",
    "endDate": "2025-10-05T18:36:35+02+00"
  }
]
```

