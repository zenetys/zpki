document.addEventListener('DOMContentLoaded', function() {
    const lockState = JSON.parse(localStorage.getItem('isLocked'));
    const createBtn = document.getElementById('createBtn');
    const certSearchInput = document.getElementById('certSearch');
    const certTableBody = document.getElementById('certTableBody');
    const selectBoxHeader = document.querySelector('[data-sort="selectBox"]');
    const lockInterface = document.getElementById('lockInterface');
    const passwordModalTitle = document.getElementById('passwordModalTitle');
    const passwordModal = new bootstrap.Modal(document.getElementById('passwordModal'));
    const passwordInput = document.getElementById('password');
    const rightPassword = document.getElementById('rightPassword');
    const wrongPassword = document.getElementById('wrongPassword');
    const texts = {
        en: {
            actions: {
                renew: "Renew",
                revoke: "Revoke",
                disable: "Disable",
                cancel: "Cancel",
                confirm: "Confirm",
            },
            status: {
                valid: "Valid",
                expired: "Expired",
                revoked: "Revoked",
                disabled: "Disabled",
                unknown: "Unknown"
            },
            headers: {
                status: "Status",
                commonName: "Common Name (CN)",
                serial: "Serial",
                signature: "Signature",
                startDate: "Start Date",
                endDate: "End Date",
                downloads: "Downloads",
            },
            titles: {
                sessionExpired: "Session expired",
                sessionDescription: "The session has expired, please select a profile.",
                incorrectFormat: "Incorrect format",
                incorrectDescription: "Use a correct format in the SAN input.",
                searchBar: "Search for a certificate",
                selectProfile: "Select a profile",
                enterPass: "Enter your Passphrase",
                createMultiSan: "Create Multi SAN Certificate",
                viewCert: "Certificate details",
                renewCert: "Renew Certificate",
                revokeCert: "Revoke Certificate",
                disableCert: "Disable Certificate",
            },
            modals: {
                CA: "Certificate Authority",
                CN: "Common Name",
                ORG: "Organization Name",
                ORGUNIT: "Organization Unit Name",
                SUBJ: "Subject (O / OU / CN)",
                subject: "SAN (Subject Alternative Name)",
                type: "Certificate Type",
                selector: {
                    select1: "Server",
                    select2: "User",
                },
                enterPass: "Enter your passphrase (can be empty)",
                missing: {
                    IP: "No IP defined",
                    DNS: "No DNS defined",
                    type: "No type defined",
                },
            },
            inputs: {
                wrongPass: "Incorrect passphrase.",
                wrongPassLength: "Passphrase must be at least 4 characters long.",
                rightPass: "Looks good !",
            },
            confirmations: {
                confirmRevoke: "Are you sure you want to revoke this certificate?",
                confirmDisable: "Are you sure you want to disable this certificate?",
            },
            lang: {
                english: "English",
                french: "French",
                spanish: "Spanish",
                german: "German"
            },
            undefined: "Undefined",
        },
        fr: {
            actions: {
                renew: "Renouveler",
                revoke: "Révoquer",
                disable: "Désactiver",
                cancel: "Annuler",
                confirm: "Confirmer",
            },
            status: {
                valid: "Valide",
                expired: "Expiré",
                revoked: "Révoqué",
                disabled: "Désactivé",
                unknown: "Inconnu"
            },
            headers: {
                status: "Statut",
                commonName: "Nom Commun (CN)",
                serial: "Numéro de série",
                signature: "Signature",
                startDate: "Date de début",
                endDate: "Date de fin",
                downloads: "Téléchargements",
            },
            titles: {
                sessionExpired: "Session expirée",
                sessionDescription: "La session a expiré, veuillez sélectionner un profil.",
                incorrectFormat: "Format incorrect",
                incorrectDescription: "Utilisez un format correct dans le champ SAN.",
                searchBar: "Rechercher un certificat",
                selectProfile: "Sélectionner",
                enterPass: "Entrer votre Passphrase",
                createMultiSan: "Créer un certificat Multi SAN",
                viewCert: "Informations du certificat",
                renewCert: "Renouveler le certificat",
                revokeCert: "Révoquer le certificat",
                disableCert: "Désactiver le certificat",
            },
            modals: {
                CA: "Autorité de certification",
                CN: "Nom Commun",
                ORG: "Nom de l'Organisation",
                ORGUNIT: "Nom de l'Unité Organisationnelle",
                SUBJ: "Sujet (O / OU / CN)",
                subject: "SAN (Nom Alternatif du Sujet)",
                type: "Type de certificat",
                selector: {
                    select1: "Serveur",
                    select2: "Utilisateur",
                },
                enterPass: "Entrez votre passphrase (peut être vide)",
                missing: {
                    IP: "Pas d'IP définie",
                    DNS: "Pas de DNS défini",
                    type: "Pas de type défini",
                },
            },
            inputs: {
                wrongPass: "Passphrase incorrecte.",
                wrongPassLength: "La passphrase doit contenir au moins 4 caractères.",
                rightPass: "C'est bon !",
            },
            confirmations: {
                confirmRevoke: "Êtes-vous sûr de vouloir révoquer ce certificat ?",
                confirmDisable: "Êtes-vous sûr de vouloir désactiver ce certificat ?",
            },
            lang: {
                english: "Anglais",
                french: "Français",
                spanish: "Espagnol",
                german: "Allemand"
            },
            undefined: "Indéfini",
        },
        es: {
            actions: {
                renew: "Renovar",
                revoke: "Revocar",
                disable: "Deshabilitar",
                cancel: "Cancelar",
                confirm: "Confirmar",
            },
            status: {
                valid: "Válido",
                expired: "Expirado",
                revoked: "Revocado",
                disabled: "Deshabilitado",
                unknown: "Desconocido"
            },
            headers: {
                status: "Estado",
                commonName: "Nombre Común (CN)",
                serial: "Número de serie",
                signature: "Firma",
                startDate: "Fecha de inicio",
                endDate: "Fecha de finalización",
                downloads: "Descargas",
            },
            titles: {
                sessionExpired: "Sesión expirada",
                sessionDescription: "La sesión ha expirado, por favor seleccione un perfil.",
                incorrectFormat: "Formato incorrecto",
                incorrectDescription: "Utilice un formato correcto en la entrada SAN.",
                searchBar: "Buscar un certificado",
                selectProfile: "Seleccionar",
                enterPass: "Ingresar tu frase de paso",
                createMultiSan: "Crear Certificado Multi SAN",
                viewCert: "Información del certificado",
                renewCert: "Renovar Certificado",
                revokeCert: "Revocar Certificado",
                disableCert: "Deshabilitar Certificado",
            },
            modals: {
                CA: "Autoridad de Certificación",
                CN: "Nombre Común",
                ORG: "Nombre de la Organización",
                ORGUNIT: "Nombre de la Unidad Organizacional",
                SUBJ: "Sujeto (O / OU / CN)",
                subject: "SAN (Nombre Alternativo del Sujeto)",
                type: "Tipo de certificado",
                selector: {
                    select1: "Servidor",
                    select2: "Usuario",
                },
                enterPass: "Ingrese su frase de paso (puede estar vacía)",
                missing: {
                    IP: "No se ha definido IP",
                    DNS: "No se ha definido DNS",
                    type: "No se ha definido tipo",
                },
            },
            inputs: {
                wrongPass: "Frase de acceso incorrecta.",
                wrongPassLength: "La frase de acceso debe tener al menos 4 caracteres.",
                rightPass: "¡Todo bien!",
            },            
            confirmations: {
                confirmRevoke: "¿Estás seguro de que quieres revocar este certificado?",
                confirmDisable: "¿Estás seguro de que quieres deshabilitar este certificado?",
            },
            lang: {
                english: "Inglés",
                french: "Francés",
                spanish: "Español",
                german: "Alemán"
            },
            undefined: "Indefinido",
        },
        de: {
            actions: {
                renew: "Erneuern",
                revoke: "Widerrufen",
                disable: "Deaktivieren",
                cancel: "Abbrechen",
                confirm: "Bestätigen",
            },
            status: {
                valid: "Gültig",
                expired: "Abgelaufen",
                revoked: "Widerrufen",
                disabled: "Deaktiviert",
                unknown: "Unbekannt"
            },
            headers: {
                status: "Status",
                commonName: "Allgemeiner Name (CN)",
                serial: "Seriennummer",
                signature: "Signatur",
                startDate: "Anfangsdatum",
                endDate: "Enddatum",
                downloads: "Downloads",
            },
            titles: {
                sessionExpired: "Sitzung abgelaufen",
                sessionDescription: "Die Sitzung ist abgelaufen, bitte wählen Sie ein Profil.",
                incorrectFormat: "Ungültiges Format",
                incorrectDescription: "Verwenden Sie ein korrektes Format im SAN-Feld.",
                searchBar: "Suche nach einem Zertifikat",
                selectProfile: "Profil auswählen",
                enterPass: "Geben Sie Ihre Passwortphrase ein",
                createMultiSan: "Multi-SAN-Zertifikat erstellen",
                viewCert: "Informationen zum Zertifikat",
                renewCert: "Zertifikat erneuern",
                revokeCert: "Zertifikat widerrufen",
                disableCert: "Zertifikat deaktivieren",
            },
            modals: {
                CA: "Zertifizierungsstelle",
                CN: "Allgemeiner Name",
                ORG: "Name der Organisation",
                ORGUNIT: "Name der Organisationseinheit",
                SUBJ: "Betreff (O / OU / CN)",
                subject: "SAN (Alternative Name des Betreffs)",
                type: "Zertifikatstyp",
                selector: {
                    select1: "Server",
                    select2: "Benutzer",
                },
                enterPass: "Geben Sie Ihre Passwortphrase ein (kann leer sein)",
                missing: {
                    IP: "Keine IP definiert",
                    DNS: "Kein DNS definiert",
                    type: "Kein Typ definiert",
                },
            },
            inputs: {
                wrongPass: "Falsches Passwort.",
                wrongPassLength: "Die Passphrase muss mindestens 4 Zeichen lang sein.",
                rightPass: "Sieht gut aus!",
            },            
            confirmations: {
                confirmRevoke: "Sind Sie sicher, dass Sie dieses Zertifikat widerrufen möchten?",
                confirmDisable: "Sind Sie sicher, dass Sie dieses Zertifikat deaktivieren möchten?",
            },
            lang: {
                english: "Englisch",
                french: "Französisch",
                spanish: "Spanisch",
                german: "Deutsch"
            },
            undefined: "Unbekannt",
        },
    };
    let isLocked = lockState !== null ? lockState : true;

    // Set default language from localStorage or use English as default
    let lang = localStorage.getItem('language') || 'en';
    updateLanguage(lang);

    // Set the active class on the corresponding language menu item
    $('#languageMenu .dropdown-item').removeClass('active');
    $(`#languageMenu .dropdown-item[data-lang="${lang}"]`).addClass('active').find('.checkmark').show();

    // Hide checkmarks for other languages
    $('#languageMenu .dropdown-item').not(`[data-lang="${lang}"]`).find('.checkmark').hide();

    // Language switcher
    $('#languageMenu .dropdown-item').click(function () {
        $('#languageMenu .dropdown-item').removeClass('active');
        $('#languageMenu .dropdown-item').find('.checkmark').hide();
        $(this).addClass('active');
        $(this).find('.checkmark').show();
        lang = $(this).data('lang');
        localStorage.setItem('language', lang);
        updateLanguage(lang);
        loadCertData();
    });

    // Update the language
    function updateLanguage(lang) {
        // Update top page content
        const currentText = $('#switchCurrentCA').html();
        if ([texts['en'].titles.selectProfile, texts['fr'].titles.selectProfile, texts['es'].titles.selectProfile, texts['de'].titles.selectProfile].includes(currentText)) {
            $('#switchCurrentCA').html(texts[lang].titles.selectProfile);
        }
        $('#sessionExpired').html(`<img src="images/circle-info-solid.svg" class="icon mt-0 me-2"> ${texts[lang].titles.sessionExpired}`);
        $('#sessionDescription').html(`${texts[lang].titles.sessionDescription}`);
        $('#incorrectFormat').html(`<img src="images/circle-info-solid.svg" class="icon mt-0 me-2"> ${texts[lang].titles.incorrectFormat}`);
        $('#incorrectDescription').html(`${texts[lang].titles.incorrectDescription}`);
        $('#certSearch').attr('placeholder', texts[lang].titles.searchBar);
        $('#passwordSubmit').html(`${texts[lang].actions.confirm}`);
        $('#english').html(`${texts[lang].lang.english} <span class="checkmark"><img src="images/check-solid.svg" class="icon ms-3"/></span>`);
        $('#french').html(`${texts[lang].lang.french} <span class="checkmark"><img src="images/check-solid.svg" class="icon ms-3"/></span>`);
        $('#spanish').html(`${texts[lang].lang.spanish} <span class="checkmark"><img src="images/check-solid.svg" class="icon ms-3"/></span>`);
        $('#german').html(`${texts[lang].lang.german} <span class="checkmark"><img src="images/check-solid.svg" class="icon ms-3"/></span>`);
        
        // Update table headers
        $('th[data-sort="status"]').html(`<img src="images/chart-simple-solid.svg" class="icon me-1"/> ${texts[lang].headers.status}`);
        $('th[data-sort="commonName"]').html(`<img src="images/file-lines-solid.svg" class="icon me-1"/> ${texts[lang].headers.commonName}`);
        $('th[data-sort="serial"]').html(`<img src="images/hashtag-solid.svg" class="icon me-1"/> ${texts[lang].headers.serial}`);
        $('th[data-sort="startDate"]').html(`<img src="images/calendar-day-solid.svg" class="icon me-1"/> ${texts[lang].headers.startDate}`);
        $('th[data-sort="endDate"]').html(`<img src="images/calendar-days-solid.svg" class="icon me-1"/> ${texts[lang].headers.endDate}`);
    }

    // Update lock / unlock buttons
    function updateInterface() {
        const checkboxes = document.querySelectorAll('.cert-checkbox');
        if (!isLocked) {
            checkboxes.forEach(checkbox => { checkbox.disabled = false; });
            createBtn.classList.remove('disabled');
            createBtn.classList.remove('btn-secondary');
            createBtn.classList.add('btn-primary');
            lockInterface.classList.remove('btn-danger');
            lockInterface.classList.add('btn-success');
            lockInterface.innerHTML = `<img src="images/unlock-solid.svg" class="icon"/>`;
        } else {
            checkboxes.forEach(checkbox => { checkbox.disabled = true; });
            createBtn.classList.add('disabled');
            createBtn.classList.remove('btn-primary');
            createBtn.classList.add('btn-secondary');
            lockInterface.classList.remove('btn-success');
            lockInterface.classList.add('btn-danger');
            lockInterface.innerHTML = `<img src="images/lock-white-solid.svg" class="icon"/>`;
        }
    }

    // Update confirmation input visibility and validation
    function updateConfirm() {
        const commonName = document.getElementById('commonName');
        const confirmAction = document.getElementById('confirmAction');
    
        if (commonName) {
            commonName.oninput = () => {
                confirmAction.classList.remove('btn-success', 'btn-danger');
                confirmAction.disabled = !commonName.value;
    
                if (!commonName.value) confirmAction.classList.add('btn-danger');
                else confirmAction.classList.add('btn-primary');
            };
        }
    }    

    // Initialize tool tips
    function initializeTooltips() {
        $('[data-bs-toggle="tooltip"]').tooltip({ html: true });
    }

    // Save lock state in local storage
    function saveLock(isLocked) {
        localStorage.setItem('isLocked', JSON.stringify(isLocked));
    }

    // Show all different alerts
    function showAlert(alert) {
        new bootstrap.Toast(document.getElementById(alert)).show();
    }

    function hideAlert(alert) {
        new bootstrap.Toast(document.getElementById(alert)).hide();
    }

    // Verify if is a valid IPv4 format
    function isValidIPv4(ip) {
        const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return ipv4Pattern.test(ip);
    }

    // Verify if is a valid IPv6 format
    function isValidIPv6(ip) {
        const ipv6Pattern = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}|(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}|(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}|(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:(?::[0-9a-fA-F]{1,4}){1,6}|:((?::[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(?::[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(1[0-9]{2}|[1-9]?[0-9]))\.){3}(25[0-5]|(1[0-9]{2}|[1-9]?[0-9]))|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(1[0-9]{2}|[1-9]?[0-9]))\.){3}(25[0-5]|(1[0-9]{2}|[1-9]?[0-9]))$/;
        return ipv6Pattern.test(ip);
    }

    // Verify if is a valid domain format
    function isValidDNS(dns) {
        const dnsPattern = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z]{2,})+$/;
        return dnsPattern.test(dns);
    }

    // Adapt name, normalize
    function encodeName(name) {
        return name
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9-_ ]/g, '');
    }

    // Replace space with underscore
    function replaceSpaces(str) {
        return str.replace(/\s+/g, '_');
    }

    // Format date to YYYY/MM/DD from ISO format
    function formatDate(isoDateString) {
        const date = new Date(isoDateString);
        return date.toLocaleDateString('fr-FR');
    }

    // Sorting columns
    function sortTable(sortKey, order) {
        const rows = Array.from(certTableBody.querySelectorAll('tr'));

        if (!sortKey || sortKey === 'selectBox' || sortKey === 'downloads') return;

        rows.sort((a, b) => {
            const cellA = a.querySelector(`td[data-sort="${sortKey}"]`);
            const cellB = b.querySelector(`td[data-sort="${sortKey}"]`);

            if (!cellA || !cellB) return 0;

            // Sorting by status
            if (sortKey === 'status') {
                const buttonClassA = cellA.querySelector('button')?.classList;
                const buttonClassB = cellB.querySelector('button')?.classList;

                const statusOrder = {
                    'btn-success': 1,
                    'btn-warning': 2,
                    'btn-danger': 3,
                    'btn-dark': 4,
                    'btn-secondary': 5
                };

                const orderA = Array.from(buttonClassA || []).find(cls => statusOrder[cls]);
                const orderB = Array.from(buttonClassB || []).find(cls => statusOrder[cls]);
                return order === 'asc'
                    ? (statusOrder[orderA] || 0) - (statusOrder[orderB] || 0)
                    : (statusOrder[orderB] || 0) - (statusOrder[orderA] || 0);
            }

            // Sorting by date (startDate, endDate)
            if (sortKey === 'startDate' || sortKey === 'endDate') {
                const parseDate = (dateStr) => {
                    const [day, month, year] = dateStr.split('/').map(Number);
                    return new Date(year, month - 1, day);
                };

                const dateA = parseDate(cellA.textContent.trim());
                const dateB = parseDate(cellB.textContent.trim());

                return order === 'asc' ? dateA - dateB : dateB - dateA;
            }

            if (sortKey === 'id') {
                const nameA = cellA.textContent.trim();
                const nameB = cellB.textContent.trim();

                const numericA = parseInt(nameA.replace(/\D/g, ''), 10);
                const numericB = parseInt(nameB.replace(/\D/g, ''), 10);

                if (numericA !== numericB) return order === 'asc' ? numericA - numericB : numericB - numericA;
                return order === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
            }

            // Default sorting for other text fields
            const valueA = cellA.textContent.trim();
            const valueB = cellB.textContent.trim();

            return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        });
        rows.forEach(row => certTableBody.appendChild(row));
    }

    // Function to load data & update table
    function loadCertData() {
        let profile;
        fetch('/current-profile')
            .then(response => {
                if (!response.ok) {
                    showAlert('basicAlert');
                    certTableBody.innerHTML = '';
                    return Promise.reject();
                }
                return response.json();
            })
            .then(profileData => {
                profile = profileData.currentProfile;
                if (profile === 'Select a profile') {
                    showAlert('profileAlert');
                    certTableBody.innerHTML = '';
                    return Promise.reject();
                }
                return fetch('/list');
            })
            .then(response => {
                if (!response.ok) {
                    showAlert('listAlert');
                    certTableBody.innerHTML = '';
                    return Promise.reject();
                }
                return response.json();
            })
            .then(data => {
                certTableBody.innerHTML = '';
                data.forEach(cert => {
                    const status = cert.status;
                    const statusMap = {
                        V: { color: 'success', icon: 'circle-check-solid.svg', textKey: 'valid' },
                        E: { color: 'warning', icon: 'triangle-exclamation-solid.svg', textKey: 'expired' },
                        R: { color: 'danger', icon: 'circle-xmark-solid.svg', textKey: 'revoked' },
                        D: { color: 'dark', icon: 'circle-minus-solid.svg', textKey: 'disabled' },
                        default: { color: 'secondary', icon: 'question-solid.svg', textKey: 'unknown' }
                    };
                    
                    const { color: statusColor, icon, textKey } = statusMap[status] || statusMap.default;
                    const statusText = texts[lang].status[textKey];
                    const statusBtn = `<img src="images/${icon}" class="icon me-1"/> ${statusText}`;

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="text-center check-container"><input type="checkbox" class="cert-checkbox" data-id="${cert.id}" ${status === 'D' ? 'disabled' : ''}></td>                        
                        <td class="status-container" data-sort="status">
                            <div class="button-container">
                                <button class="btn btn-ssm btn-status btn-${statusColor} rounded-pill" data-id="${cert.id}">${statusBtn}</button>
                                <div class="action-buttons" style="display: none;">
                                    <button class="btn btn-action renew">
                                        <img src="images/rotate-right-solid.svg" class="icon rotate-icon" data-id="${cert.id}"/>
                                    </button>
                                    <button class="btn btn-action revoke" ${status === 'R' ? 'disabled' : ''}>
                                        <img src="images/ban-solid.svg" class="icon cross-icon" data-id="${cert.id}"/>
                                    </button>
                                    <button class="btn btn-action disable disabled">
                                        <img src="images/circle-minus-regular.svg" class="icon wobble-icon" data-id="${cert.id}"/>
                                    </button>
                                </div>
                            </div>
                        </td>
                        <td data-sort="commonName">${cert.id}</td>
                        <td data-sort="serial"><span class="tooltip-container" data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="bottom" title="<div>${texts[lang].headers.signature}: ${cert.hash}</div>">${cert.serial}</span></td>
                        <td data-sort="startDate"><span class="tooltip-container" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${cert.startDate}">${formatDate(cert.startDate)}</span></td>
                        <td data-sort="endDate"><span class="tooltip-container" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${cert.endDate}">${formatDate(cert.endDate)}</span></td>
                        <td class="download-container">
                            <button type="button" class="btn btn-light btn-sm" data-bs-toggle="popover" data-bs-html="true" data-bs-content="
                                <a class='btn btn-light btn-sm d-block text-start mb-1' href='${profile}/certs/${replaceSpaces(cert.id)}.crt' download><img src='images/certificate-solid.svg' class='icon me-1'/>.crt</a>
                                <a class='btn btn-light btn-sm d-block text-start mb-1' href='${profile}/certs/${replaceSpaces(cert.id)}.csr' download><img src='images/lock-solid.svg' class='icon me-1'/>.csr</a>
                                <a class='btn btn-light btn-sm d-block text-start mb-1' href='${profile}/private/${replaceSpaces(cert.id)}.key' download><img src='images/key-solid.svg' class='icon me-1'/>.key</a>
                                <a class='btn btn-light btn-sm d-block text-start exportP12 ${cert.keyStatus === 'encrypted' ? '' : 'disabled'}'><img src='images/file-export-solid.svg' class='icon me-1'/>.pkcs12</a>
                            ">
                                <img src="images/file-arrow-down-solid.svg" class="icon"/>
                            </button>
                        </td>
                    `;
                    certTableBody.appendChild(row);

                    // On action buttons click, show modal
                    row.querySelector('.renew').addEventListener('click', () => showModal('renew', cert));
                    row.querySelector('.revoke').addEventListener('click', () => showModal('revoke', cert));
                    row.querySelector('.disable').addEventListener('click', () => showModal('disable', cert));

                    row.addEventListener('click', function(event) {
                        if (!event.target.closest('.check-container') && !event.target.closest('.status-container') 
                            && !event.target.closest('.download-container')) { showModal('view', cert); }
                    });

                    // On line hover, show / hide action buttons
                    row.addEventListener('mouseover', function() {
                        if (!isLocked) {
                            const btn = row.querySelector('.btn-status');
                            const actionButtons = row.querySelector('.action-buttons');
                            const checkboxes = document.querySelectorAll('.cert-checkbox');
                            const isAnyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);

                            if (status === 'D' || isAnyChecked) return;

                            btn.style.display = 'none';
                            actionButtons.style.display = 'flex';
                        }
                    });
                    row.addEventListener('mouseout', function() {
                        if (!isLocked) {
                            const btn = row.querySelector('.btn-status');
                            const actionButtons = row.querySelector('.action-buttons');

                            btn.style.display = '';
                            actionButtons.style.display = 'none';
                        }
                    });
                });

                // Shift + click checkboxes
                let lastChecked = null;
                const checkboxes = document.querySelectorAll('.cert-checkbox');
                checkboxes.forEach(checkbox => {
                    checkbox.addEventListener('click', function(e) {
                        e.stopPropagation();
                        if (!lastChecked) {
                            lastChecked = this;
                            return;
                        }

                        if (e.shiftKey) {
                            let inBetween = false;
                            checkboxes.forEach(cb => {
                                if (cb === this || cb === lastChecked) inBetween = !inBetween;
                                if (inBetween && !cb.disabled) cb.checked = this.checked;
                            });
                        }
                        lastChecked = this;
                    });
                });

                // Select all checkboxes on header click
                selectBoxHeader.addEventListener('click', function() {
                    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked || checkbox.disabled);
                    checkboxes.forEach(checkbox => { if (!checkbox.disabled) checkbox.checked = !allChecked; });
                });

                // Tooltips
                var tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
                var tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

                // Hide tooltips on mouse out
                document.addEventListener('mouseout', function() { tooltipList.forEach(tooltip => { tooltip.hide(); }); });

                // Popovers
                var popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
                var popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));

                // Set popovers for downloads
                popoverTriggerList.forEach((triggerEl) => {
                    triggerEl.addEventListener('click', function(event) {
                        popoverList.forEach(popover => { if (popover._element !== this) popover.hide(); });
                        const popoverInstance = bootstrap.Popover.getInstance(this);
                        if (popoverInstance) popoverInstance.hide();
                        else new bootstrap.Popover(this).show();
                        event.stopPropagation();
                    });
                });

                // Hide popovers on outside click
                document.addEventListener('click', function() { popoverList.forEach(popover => { popover.hide(); }); });

                initializeTooltips();
                updateInterface();
            })
            .catch(() => {});
    }

    // Function to manage all modals
    function showModal(action, certData) {
        const modalTitle = document.getElementById('dynamicModalLabel');
        const formContent = document.getElementById('formContent');
        const footerContent = document.getElementById('footerContent');

        formContent.innerHTML = '';
        footerContent.innerHTML = '';
        footerContent.style.display = '';

        try {
            if (certData.subject !== '') {
                var subjectArray = (certData.subject || '')
                    .replace(/^Subject\s*\(.*?\):\s*/, '')
                    .split(/(?:\/|\n)/)
                    .filter(Boolean);

                var cnValue = '';
                var oValue = '';
                var ouValue = '';

                subjectArray.forEach(part => {
                    if (part.startsWith('CN=')) {
                        cnValue = part.replace('CN=', '');
                    } else if (part.startsWith('O=')) {
                        oValue = part.replace('O=', '');
                    } else if (part.startsWith('OU=')) {
                        ouValue = part.replace('OU=', '');
                    }
                });
            }
        } catch {};

        switch (action) {
            case 'create':
                modalTitle.textContent = texts[lang].titles.createMultiSan;
                formContent.innerHTML = `
                    <div class="mb-3">
                        <div class="input-group">
                            <span class="input-group-text">/CN=</span>
                            <input type="text" class="form-control" id="commonName" placeholder="${texts[lang].modals.CN}" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <div class="input-group">
                            <span class="input-group-text">/O=</span>
                            <input type="text" class="form-control" id="org" placeholder="${texts[lang].modals.ORG}" aria-label="Organisation">
                        </div>
                    </div>
                    <div class="mb-3">
                        <div class="input-group">
                            <span class="input-group-text">/OU=</span>
                            <input type="text" class="form-control" id="orgunit" placeholder="${texts[lang].modals.ORGUNIT}" aria-label="Organisation Unit">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">${texts[lang].modals.subject}</label>
                        <div id="sanContainer">
                            <div class="input-group mb-2">
                                <input type="text" class="form-control" placeholder="IP" id="sanIP">
                                <button class="btn btn border" type="button" id="addIpButton">+</button>
                            </div>
                            <div id="addedSanIP" class="mt-2"></div>
                            <div class="input-group mb-2">
                                <input type="text" class="form-control" placeholder="DNS" id="sanDNS">
                                <button class="btn btn border" type="button" id="addDnsButton">+</button>
                            </div>
                            <div id="addedDnsNames" class="mt-2"></div>
                        </div>
                    </div>
                    <!--
                    <div class="mb-3">
                        <label for="type" class="form-label">${texts[lang].modals.type}</label>
                        <select class="form-select" id="type" name="type">
                            <option value="server">${texts[lang].modals.selector.select1}</option>
                            <option value="user">${texts[lang].modals.selector.select2}</option>
                        </select>
                    </div>
                    -->
                    <div class="mb-3">
                        <label for="startDate" class="form-label">${texts[lang].headers.startDate}</label>
                        <input type="datetime-local" class="form-control" id="startDate" value="">
                    </div>
                    <div class="mb-3">
                        <label for="endDate" class="form-label">${texts[lang].headers.endDate}</label>
                        <input type="datetime-local" class="form-control" id="endDate" value="">
                    </div>
                `;
                footerContent.innerHTML = `
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${texts[lang].actions.cancel}</button>
                    <button type="button" class="btn btn-danger" id="confirmAction" disabled>${texts[lang].actions.confirm}</button>
                `;

                // Confirm certificate creation
                document.getElementById('confirmAction').onclick = async function() {
                    let commonName = document.getElementById('commonName').value;
                    const org = document.getElementById('org').value.trim();
                    const orgUnit = document.getElementById('orgunit').value.trim();
                    const sanIP = Array.from(document.getElementById('addedSanIP').children).map(el => el.innerText);
                    const sanDNS = Array.from(document.getElementById('addedDnsNames').children).map(el => el.innerText);
                    // const type = document.getElementById('type').value;
                    const startDate = document.getElementById('startDate').value;
                    const endDate = document.getElementById('endDate').value;
                    const confirmAction = document.getElementById('confirmAction');

                    confirmAction.disabled = true;

                    if (await checkCommonName(commonName) === true) {
                        showAlert('CNAlert');
                        confirmAction.disabled = false;
                        return;
                    }

                    let subject = '';
                    if (org) subject += `/O=${org}`;
                    if (orgUnit) subject += `/OU=${orgUnit}`;
                    if ((org && orgUnit) || org || orgUnit) subject += `/CN=${commonName}`;

                    try {
                        const getPassword = await fetch('/get-password', {
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json' }
                        });
                        if (getPassword.ok) {
                            const password = await getPassword.json();
                            const data = {
                                commonName: commonName,
                                subject: subject,
                                sanIP: sanIP,
                                sanDNS: sanDNS,
                                // type: type + '_ext',
                                startDate: startDate,
                                endDate: endDate,
                                ca_password: password.pkiaccess
                            };

                            const response = await fetch('/create', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(data)
                            });
        
                            if (response.ok) {
                                loadCertData();
                                modal.hide();
                            } else {
                                showAlert('passphraseAlert');
                                confirmAction.disabled = false;
                            }
                        }
                    } catch (error) {
                        console.error('Creation error:', error);
                    }
                };
                break;
            case 'view':
                let profile;
                fetch('/current-profile')
                    .then(response => {
                        if (!response.ok) {
                            showAlert('basicAlert');
                            return Promise.reject();
                        }
                        return response.json();
                    })
                    .then(async profileData => {
                        profile = profileData.currentProfile;
                        if (profile === 'Select a profile') {
                            showAlert('profileAlert');
                            certTableBody.innerHTML = '';
                            return Promise.reject();
                        }
                        const commonName = certData.id;
                        const response = await fetch(`/subject-alt?cert=${commonName}`);
                        const subjAlt = await response.json();
                        const dnsList = subjAlt.dns || [];
                        const ipList = subjAlt.ip || [];

                        let subjectArray = (certData.subject || '')
                            .replace(/^Subject\s*\(.*?\):\s*/, '')
                            .split(/(?:\/|\n)/)
                            .filter(Boolean);

                        let splitSubject = subjectArray.length > 0
                            ? subjectArray.map(el => `<span>${el}</span>`).join('<br>')
                            : `${texts[lang].undefined}`;

                        if (subjectArray.length === 1) splitSubject = `<span>${subjectArray[0]}</span>`;
                        else splitSubject = `<br>${splitSubject}`;        

                        modalTitle.textContent = `${texts[lang].titles.viewCert}`;
                        formContent.innerHTML = `
                            <div id="certDetails">
                                <p><strong>${texts[lang].modals.CA}:</strong> ${certData.issuer ? certData.issuer : `${texts[lang].undefined}`}</p>
                                <p><strong>${texts[lang].modals.CN}:</strong> ${certData.id ? certData.id : `${texts[lang].undefined}`}</p>
                                <p><strong>${texts[lang].modals.SUBJ}:</strong> ${splitSubject}</p>

                                <p><strong>${texts[lang].headers.serial}:</strong> ${certData.serial ? certData.serial : `${texts[lang].undefined}`}</p>
                                <p><strong>${texts[lang].headers.signature}:</strong> ${certData.hash ? certData.hash : `${texts[lang].undefined}`}</p>

                                <p><strong>IP:</strong> ${ipList.length > 0
                                    ? ipList.map(ip => `<span>${ip}</span>`).join(', ')
                                    : `${texts[lang].modals.missing.IP}`}
                                </p>

                                <p><strong>DNS:</strong> ${dnsList.length > 0
                                    ? dnsList.map(dns => `<span>${dns}</span>`).join(', ')
                                    : `${texts[lang].modals.missing.DNS}`}
                                </p>

                                <p><strong>${texts[lang].modals.type}:</strong> ${certData.type ? certData.type : `${texts[lang].modals.missing.type}`}</p>
                                <p><strong>${texts[lang].headers.startDate}:</strong> ${certData.startDate ? certData.startDate : `${texts[lang].undefined}`}</p>
                                <p><strong>${texts[lang].headers.endDate}:</strong> ${certData.endDate ? certData.endDate : `${texts[lang].undefined}`}</p>

                                <p class="text-wrap">
                                    <strong class="me-2">${texts[lang].headers.downloads}:</strong>
                                    <span class="d-inline-block mt-1">
                                        <a class="btn btn-light btn-sm mb-1 me-1" href="${profile}/certs/${replaceSpaces(certData.id)}.crt" download>
                                            <img src="images/certificate-solid.svg" class="icon me-1"/>.crt
                                        </a>
                                        <a class="btn btn-light btn-sm mb-1 me-1" href="${profile}/certs/${replaceSpaces(certData.id)}.csr" download>
                                            <img src="images/lock-solid.svg" class="icon me-1"/>.csr
                                        </a>
                                        <a class="btn btn-light btn-sm mb-1 me-1" href="${profile}/private/${replaceSpaces(certData.id)}.key" download>
                                            <img src="images/key-solid.svg" class="icon me-1"/>.key
                                        </a>
                                        <a class="btn btn-light btn-sm mb-1 exportP12 ${certData.keyStatus === 'encrypted' ? '' : 'disabled'}">
                                            <img src="images/file-export-solid.svg" class="icon me-1"/>.pkcs12
                                        </a>
                                    </span>
                                </p>
                            </div>
                        `;
                        footerContent.style.display = 'none';
                    })
                    .catch(error => console.error('Profile loading error:', error));
                break;
            case 'renew':
                modalTitle.textContent = `${texts[lang].titles.renewCert}`;
                formContent.innerHTML = `
                    <div class="mb-3">
                        <div class="input-group">
                            <span class="input-group-text">CA</span>
                            <input type="text" class="form-control" id="certificateAuthority" value="${certData.issuer}" placeholder="${texts[lang].modals.CA}" readonly>
                        </div>
                    </div>
                    <div class="mb-3">
                        <div class="input-group">
                            <span class="input-group-text">/CN=</span>
                            <input type="text" class="form-control" id="commonName" placeholder="${texts[lang].modals.CN}" value="${cnValue}" readonly>
                        </div>
                    </div>
                    <div class="mb-3">
                        <div class="input-group">
                            <span class="input-group-text">/O=</span>
                            <input type="text" class="form-control" id="org" placeholder="${texts[lang].modals.ORG}" aria-label="Organisation" value="${oValue}">
                        </div>
                    </div>
                    <div class="mb-3">
                        <div class="input-group">
                            <span class="input-group-text">/OU=</span>
                            <input type="text" class="form-control" id="orgunit" placeholder="${texts[lang].modals.ORGUNIT}" aria-label="Organisation Unit" value="${ouValue}">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">SAN (Subject Alternative Name)</label>
                        <div id="sanContainer">
                            <div class="input-group mb-2">
                                <input type="text" class="form-control" placeholder="IP" id="sanIP" value="${certData.ip && certData.ip.length > 0 
                                    ? certData.ip.map(ip => `<span>${ip}</span>`).join(', ') 
                                    : ''}">
                                <button class="btn btn border" type="button" id="addIpButton">+</button>
                            </div>
                            <div id="addedSanIP" class="mt-2"></div>
                            <div class="input-group mb-2">
                                <input type="text" class="form-control" placeholder="DNS" id="sanDNS" value="${certData.dns && certData.dns.length > 0 
                                    ? certData.dns.map(dns => `<span>${dns}</span>`).join(', ') 
                                    : ''}">
                                <button class="btn btn border" type="button" id="addDnsButton">+</button>
                            </div>
                            <div id="addedDnsNames" class="mt-2"></div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="type" class="form-label">${texts[lang].modals.type}</label>
                        <select class="form-select" id="type" name="type">
                            <option value="server">${texts[lang].modals.selector.select1}</option>
                            <option value="user">${texts[lang].modals.selector.select2}</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="startDate" class="form-label">${texts[lang].headers.startDate}</label>
                        <input type="datetime-local" class="form-control" id="startDate" value="">
                    </div>
                    <div class="mb-3">
                        <label for="endDate" class="form-label">${texts[lang].headers.endDate}</label>
                        <input type="datetime-local" class="form-control" id="endDate" value="">
                    </div>
                `;
                footerContent.innerHTML = `
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${texts[lang].actions.cancel}</button>
                    <button type="button" class="btn btn-primary" id="confirmAction">${texts[lang].actions.renew}</button>
                `;
                
                // Confirm certificate renewal
                document.getElementById('confirmAction').onclick = async function() {
                    const commonName = document.getElementById('commonName').value;
                    const org = document.getElementById('org').value.trim();
                    const orgUnit = document.getElementById('orgunit').value.trim();
                    const sanIP = Array.from(document.getElementById('addedSanIP').children).map(el => el.innerText);
                    const sanDNS = Array.from(document.getElementById('addedDnsNames').children).map(el => el.innerText);
                    const type = document.getElementById('type').value;
                    const startDate = document.getElementById('startDate').value;
                    const endDate = document.getElementById('endDate').value;
                    const confirmAction = document.getElementById('confirmAction');

                    confirmAction.disabled = true;

                    let subject = '';
                    if (org) subject += `/O=${org}`;
                    if (orgUnit) subject += `/OU=${orgUnit}`;
                    if ((org && orgUnit) || org || orgUnit) subject += `/CN=${commonName}`;

                    try {
                        const getPassword = await fetch('/get-password', {
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json' }
                        });
                        if (getPassword.ok) {
                            const password = await getPassword.json();
                            const data = {
                                commonName: commonName,
                                subject: subject,
                                sanIP: sanIP,
                                sanDNS: sanDNS,
                                type: type,
                                startDate: startDate,
                                endDate: endDate,
                                ca_password: password.pkiaccess
                            };

                            const response = await fetch('/renew', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(data)
                            });
                    
                            if (response.ok) {
                                loadCertData();
                                modal.hide();
                            } else {
                                showAlert('passphraseAlert');
                                confirmAction.disabled = false;
                            }
                        }
                    } catch (error) {
                        console.error('Renewal error:', error);
                    }
                };
                break;
            case 'revoke':
                modalTitle.textContent = `${texts[lang].titles.revokeCert}`;
                formContent.innerHTML = `
                    <p>${texts[lang].confirmations.confirmRevoke}</p>
                    <div class="mb-3">
                        <div class="input-group">
                            <span class="input-group-text">/CN=</span>
                            <input type="text" class="form-control" id="commonName" placeholder="${texts[lang].modals.CN}" value="${cnValue}" readonly>
                        </div>
                    </div>
                `;
                footerContent.innerHTML = `
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${texts[lang].actions.cancel}</button>
                    <button type="button" class="btn btn-primary" id="confirmAction">${texts[lang].actions.revoke}</button>
                `;

                // Confirm certificate revocation
                document.getElementById('confirmAction').onclick = async function() {
                    let commonName = document.getElementById('commonName').value;
                    const confirmAction = document.getElementById('confirmAction');

                    confirmAction.disabled = true;

                    try {
                        const getPassword = await fetch('/get-password', {
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json' }
                        });
                        if (getPassword.ok) {
                            const password = await getPassword.json();
                            const response = await fetch('/revoke', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ commonName: commonName, ca_password: password.pkiaccess })
                            });
                    
                            if (response.ok) {
                                loadCertData();
                                modal.hide();
                            } else {
                                showAlert('passphraseAlert');
                                confirmAction.disabled = false;
                            }
                        } else {
                            console.error('Passphrase fetching error:', getPassword.statusText);
                        }
                    } catch (error) {
                        console.error('Revocation error:', error);
                    }
                };
                break;
            case 'disable':
                modalTitle.textContent = `${texts[lang].titles.disableCert}`;
                formContent.innerHTML = `
                    <p>${texts[lang].confirmations.confirmDisable}</p>
                    <div class="mb-3">
                        <div class="input-group">
                            <span class="input-group-text">/CN=</span>
                            <input type="text" class="form-control" id="commonName" placeholder="${texts[lang].modals.CN}" value="${cnValue}" readonly>
                        </div>
                    </div>
                `;
                footerContent.innerHTML = `
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${texts[lang].actions.cancel}</button>
                    <button type="button" class="btn btn-primary" id="confirmAction">${texts[lang].actions.disable}</button>
                `;
                
                // Confirm certificate deactivation
                document.getElementById('confirmAction').onclick = async function() {
                    const commonName = document.getElementById('commonName').value;
                    const confirmAction = document.getElementById('confirmAction');
                    confirmAction.disabled = true;
                    try {
                        const getPassword = await fetch('/get-password', {
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json' }
                        });
                        if (getPassword.ok) {
                            const password = await getPassword.json();
                            const response = await fetch('/disable', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ commonName: commonName, ca_password: password.pkiaccess })
                            });
                    
                            if (response.ok) {
                                loadCertData();
                                modal.hide();
                            } else {
                                showAlert('passphraseAlert');
                                confirmAction.disabled = false;
                            }
                        } else {
                            console.error('Passphrase fetching error:', getPassword.statusText);
                        }
                    } catch (error) {
                        console.error('Deactivation error:', error);
                    }
                };
                break;
        }
        updateConfirm();

        // Show modal & conditions for interactions
        const now = new Date();
        const startDate = document.getElementById("startDate");
        const endDate = document.getElementById("endDate");
        const addIpButton = document.getElementById('addIpButton');
        const addDnsButton = document.getElementById('addDnsButton');
        const offset = now.getTimezoneOffset() * 60000;
        const modal = new bootstrap.Modal(document.getElementById('dynamicModal'));
        modal.show();

        if (startDate && endDate && addIpButton && addDnsButton) {
            startDate.value = new Date(now.getTime() - offset).toISOString().slice(0, 16);
            endDate.value = new Date(now.setFullYear(now.getFullYear() + 1, now.getMonth(), now.getDate() + 1) - offset).toISOString().slice(0, 16);

            addIpButton.onclick = function() {
                const ipValue = document.getElementById('sanIP').value;
                const ipList = document.getElementById('addedSanIP');
                const ipExists = Array.from(ipList.children).some(item => item.textContent.trim() === ipValue);

                if (ipValue && !ipExists) {
                    if (isValidIPv4(ipValue) || isValidIPv6(ipValue)) {
                        const ipItem = document.createElement('div');
                        ipItem.className = 'alert alert-secondary fade show p-2 d-flex justify-content-between align-items-center';
                        ipItem.innerHTML = `
                            ${ipValue}
                            <button class="btn btn-sm btn-close" aria-label="Close"></button>
                        `;
                        ipItem.querySelector('.btn-close').onclick = function() {
                            ipList.removeChild(ipItem);
                        };
                        ipList.appendChild(ipItem);
                        document.getElementById('sanIP').value = '';
                    } else showAlert('incorrectAlert');
                } else if (ipExists) showAlert('IPAlert');
            };

            addDnsButton.onclick = function() {
                const dnsValue = document.getElementById('sanDNS').value;
                const dnsList = document.getElementById('addedDnsNames');
                const dnsExists = Array.from(dnsList.children).some(item => item.textContent.trim() === dnsValue);

                if (dnsValue && !dnsExists) {
                    if (isValidDNS(dnsValue)) {
                        const dnsItem = document.createElement('div');
                        dnsItem.className = 'alert alert-secondary fade show p-2 d-flex justify-content-between align-items-center';
                        dnsItem.innerHTML = `
                            ${dnsValue}
                            <button class="btn btn-sm btn-close" aria-label="Close"></button>
                        `;
                        dnsItem.querySelector('.btn-close').onclick = function() {
                            dnsList.removeChild(dnsItem);
                        };
                        dnsList.appendChild(dnsItem);
                        document.getElementById('sanDNS').value = '';
                    } else showAlert('incorrectAlert');
                } else if (dnsExists) showAlert('DNSAlert');
            };
        }
    }

    // Utility function to fetch password from the server
    async function fetchPassword() {
        const response = await fetch('/get-password');
        if (response.status === 429) showAlert('requestsAlert');
        else if (!response.ok) throw new Error('Request failed');
        return (await response.json()).pkiaccess;
    }

    // Load password and update interface
    async function loadPassword() {
        const fetchedPassword = await fetchPassword();
        passwordInput.value = fetchedPassword;
        passwordModalTitle.textContent = `${texts[lang].titles.enterPass}`;

        if (fetchedPassword === '') isLocked = true;
        saveLock(isLocked);
    }

    // Check if the input password is valid
    async function checkPassword() {
        const passwordSubmit = document.getElementById('passwordSubmit');
        const tmpPassword = await fetchPassword();

        passwordInput.classList.remove('is-invalid', 'is-valid');
        wrongPassword.style.display = 'none';

        if (passwordInput.value.length < 4 && passwordInput.value.length > 0) {
            passwordInput.classList.add('is-invalid');
            wrongPassword.textContent = `${texts[lang].inputs.wrongPassLength}`;
            wrongPassword.style.display = 'block';
            passwordSubmit.className = 'btn btn-danger float-end mt-3';
            passwordSubmit.disabled = true;
            return;
        }

        if (tmpPassword) {
            const isValid = passwordInput.value === tmpPassword;
            passwordInput.classList.toggle('is-valid', isValid);
            passwordInput.classList.toggle('is-invalid', !isValid);
            passwordSubmit.disabled = !isValid;
            passwordSubmit.className = `btn ${isValid ? 'btn-success' : 'btn-danger'} float-end mt-3`;

            if (!isValid) {
                wrongPassword.textContent = `${texts[lang].inputs.wrongPass}`;
                wrongPassword.style.display = 'block';
            } else rightPassword.textContent = `${texts[lang].inputs.rightPass}`;
        } else {
            passwordSubmit.disabled = false;
            passwordSubmit.className = 'btn btn-primary float-end mt-3';
        }
    }

    // Check if common name exists
    async function checkCommonName(commonName) {
        try {
            const response = await fetch('/list');
            const cert = await response.json();
            return cert.some(cert => cert.id === commonName);
        } catch (error) {
            console.error('Erreur lors de la récupération des certificats:', error);
            return false;
        }
    }

    // Handle button clicks and input events
    createBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showModal('create');
    });

    // Filter certificates by name
    certSearchInput.addEventListener('input', function() {
        const searchText = encodeName(this.value).toLowerCase();
        const rows = certTableBody.querySelectorAll('tr');
        let matchFound = false;
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            let match = false;
    
            cells.forEach(cell => {
                cell.classList.remove('highlight');
                const cellText = encodeName(cell.textContent).toLowerCase();
                if (cellText.includes(searchText) && searchText) {
                    cell.classList.add('highlight');
                    match = true;
                }
            });
            row.style.display = searchText === '' || match ? '' : 'none';
            matchFound = matchFound || match;
        });
        if (!matchFound && searchText) showAlert('searchAlert');
    });

    // Open modal & load password
    lockInterface.addEventListener('click', (e) => {
        e.preventDefault();
        passwordModal.show();
        checkPassword();
    });

    // Reload interface on profile switch
    document.getElementById('switchMenu').addEventListener('click', function() {
        hideAlert('profileAlert');
        setTimeout(() => {
            loadPassword();
            loadCertData();
        }, 100);
    });

    // Check password while input
    document.getElementById('passwordForm').oninput = checkPassword;

    // Handle password form submission
    document.getElementById('passwordForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const passwordSubmit = document.getElementById('passwordSubmit');
        const ca_password = passwordInput.value.trim() || 'none';
        const tmpPassword = await fetchPassword();

        passwordSubmit.disabled = true;

        if (!tmpPassword) {
            const response = await fetch('/set-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ca_password }),
            });

            if (response.ok) {
                isLocked = false;
                passwordModal.hide();
                passwordInput.classList.add('is-valid');
            } else {
                isLocked = true;
                passwordInput.classList.add('is-invalid');
                passwordSubmit.disabled = false;
                wrongPassword.textContent = `${texts[lang].inputs.wrongPass}`;
                wrongPassword.style.display = 'block';
                showAlert('passphraseAlert');
            }
        } else if (ca_password === tmpPassword) {
            isLocked = !isLocked;
            passwordModal.hide();
            passwordInput.classList.add('is-valid');
        } else {
            isLocked = true;
            passwordSubmit.disabled = false;
            passwordInput.classList.add('is-invalid');
        }
        saveLock(isLocked);
        updateInterface();
    });

    // Toggle eye on password modal
    document.getElementById('togglePassword').addEventListener('click', function (event) {
        event.preventDefault();
        const toggleIcon = document.getElementById('togglePasswordIcon');
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        toggleIcon.src = toggleIcon.src.includes('images/eye-solid.svg') ? 'images/eye-slash-solid.svg' : 'images/eye-solid.svg';
    });

    // Sorting columns
    document.querySelectorAll('thead th').forEach(header => {
        header.addEventListener('dblclick', function() {
            const sortKey = this.getAttribute('data-sort');
            const currentOrder = this.classList.contains('asc') ? 'desc' : 'asc';
            this.classList.remove('asc', 'desc');
            this.classList.add(currentOrder || 'asc');
            sortTable(sortKey, currentOrder);
        });
    });

    loadPassword();
    loadCertData();
});
