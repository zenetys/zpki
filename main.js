document.addEventListener('DOMContentLoaded', async () => {
    const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
    // const selectBoxHeader = document.querySelector('[data-sort="selectBox"]');
    const passwordModal = new bootstrap.Modal(document.getElementById('passwordModal'));
    const passwordForm = document.getElementById('passwordForm');
    const passwordInput = document.getElementById('passwordInput');
    const wrongPassword = document.getElementById('wrongPassword');
    const tableContent = document.getElementById('tableContent');
    const searchInput = document.getElementById('searchInput');
    const switchMenu = document.getElementById('switchMenu');
    const switchBtn = document.getElementById('switchBtn');
    const createBtn = document.getElementById('createBtn');
    const lockBtn = document.getElementById('lockBtn');
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('s') ? urlParams.get('s') : '';
    const tagsParam = urlParams.get('tags');
    const texts = {
        en: {
            actions: {
                renew: "Renew",
                revoke: "Revoke",
                disable: "Disable",
                cancel: "Cancel",
                confirm: "Confirm",
            },
            alerts: {
                errors: {
                    errorFound: "Error",
                    incorrectCN: "Incorrect CN",
                    incorrectDNS: "Incorrect DNS",
                    incorrectFormat: "Incorrect format",
                    incorrectIP: "Incorrect IP",
                    incorrectPassphrase: "Incorrect Passphrase",
                    missingCertificate: "Missing certificates",
                    searchFailed: "No certificate found",
                    sessionExpired: "Session Expired",

                },
                descriptions: {
                    errorFoundDescription: "An error has occurred, check the logs for details.",
                    incorrectCNDescription: "This certificate name is already used, choose another name.",
                    incorrectDNSDescription: "This DNS is already selected, select another one.",
                    incorrectFormatDescription: "Use a correct format in the SAN input.",
                    incorrectIPDescription: "This IP adress is already selected, select another one.",
                    incorrectPassphraseDescription: "Use the right certificate authority passphrase to continue.",
                    missingCertificateDescription: "No certificate found, please create one.",
                    searchFailedDescription: "No certificate found, search another one.",
                    sessionExpiredDescription: "The session has expired, please select a profile.",
                }
            },
            confirmations: {
                confirmRevoke: "Are you sure you want to revoke this certificate?",
                confirmDisable: "Are you sure you want to disable this certificate?",
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
            inputs: {
                wrongPass: "Incorrect passphrase.",
                wrongPassLength: "Passphrase must be at least 4 characters long.",
            },
            lang: {
                english: "English",
                french: "French",
                spanish: "Spanish",
                german: "German"
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
            status: {
                valid: "Valid",
                expired: "Expired",
                revoked: "Revoked",
                disabled: "Disabled",
                unknown: "Unknown"
            },
            tags: {
                valid: "Valid certificates",
                expired: "Expired certificates",
                revoked: "Revoked certificates",
                disabled: "Disabled certificates",
            },
            titles: {
                searchBar: "Search for a certificate",
                selectProfile: "Select a profile",
                enterPass: "Enter your Passphrase",
                createMultiSan: "Create Multi SAN Certificate",
                viewCert: "Certificate details",
                renewCert: "Renew Certificate",
                revokeCert: "Revoke Certificate",
                disableCert: "Disable Certificate",
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
            alerts: {
                errors: {
                    errorFound: "Erreur",
                    incorrectCN: "CN incorrect",
                    incorrectDNS: "DNS incorrect",
                    incorrectFormat: "Format incorrect",
                    incorrectIP: "IP incorrecte",
                    incorrectPassphrase: "Passphrase incorrecte",
                    missingCertificate: "Certificats manquants",
                    searchFailed: "Aucun certificat trouvé",
                    sessionExpired: "Session expirée",
                },
                descriptions: {
                    errorFoundDescription: "Une erreur est survenue, consultez les logs pour plus de détails.",
                    incorrectCNDescription: "Ce nom de certificat est déjà utilisé, choisissez un autre nom.",
                    incorrectDNSDescription: "Ce DNS est déjà sélectionné, sélectionnez un autre.",
                    incorrectFormatDescription: "Utilisez un format correct dans le champ SAN.",
                    incorrectIPDescription: "Cette adresse IP est déjà sélectionnée, sélectionnez une autre.",
                    incorrectPassphraseDescription: "Utilisez la bonne passphrase de l'autorité de certification pour continuer.",
                    missingCertificateDescription: "Aucun certificat trouvé, veuillez en créer un.",
                    searchFailedDescription: "Aucun certificat trouvé, essayez une autre recherche.",
                    sessionExpiredDescription: "La session a expiré, veuillez sélectionner un profil.",
                }
            },
            confirmations: {
                confirmRevoke: "Êtes-vous sûr de vouloir révoquer ce certificat ?",
                confirmDisable: "Êtes-vous sûr de vouloir désactiver ce certificat ?",
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
            inputs: {
                wrongPass: "Passphrase incorrecte.",
                wrongPassLength: "La passphrase doit comporter au moins 4 caractères.",
            },
            lang: {
                english: "Anglais",
                french: "Français",
                spanish: "Espagnol",
                german: "Allemand"
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
                    IP: "Aucune IP définie",
                    DNS: "Aucun DNS défini",
                    type: "Aucun type défini",
                },
            },
            status: {
                valid: "Valide",
                expired: "Expiré",
                revoked: "Révoqué",
                disabled: "Désactivé",
                unknown: "Inconnu"
            },
            tags: {
                valid: "Certificats valides",
                expired: "Certificats expirés",
                revoked: "Certificats révoqués",
                disabled: "Certificats désactivés",
            },
            titles: {
                searchBar: "Rechercher un certificat",
                selectProfile: "Sélectionner un profil",
                enterPass: "Entrez votre passphrase",
                createMultiSan: "Créer un certificat Multi SAN",
                viewCert: "Détails du certificat",
                renewCert: "Renouveler le certificat",
                revokeCert: "Révoquer le certificat",
                disableCert: "Désactiver le certificat",
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
            alerts: {
                errors: {
                    errorFound: "Error",
                    incorrectCN: "CN incorrecto",
                    incorrectDNS: "DNS incorrecto",
                    incorrectFormat: "Formato incorrecto",
                    incorrectIP: "IP incorrecta",
                    incorrectPassphrase: "Frase secreta incorrecta",
                    missingCertificate: "Certificados faltantes",
                    searchFailed: "No se encontró el certificado",
                    sessionExpired: "Sesión expirada",
                },
                descriptions: {
                    errorFoundDescription: "Ha ocurrido un error, consulte los registros para más detalles.",
                    incorrectCNDescription: "Este nombre de certificado ya está en uso, elija otro nombre.",
                    incorrectDNSDescription: "Este DNS ya está seleccionado, elija otro.",
                    incorrectFormatDescription: "Use un formato correcto en el campo SAN.",
                    incorrectIPDescription: "Esta dirección IP ya está seleccionada, elija otra.",
                    incorrectPassphraseDescription: "Use la frase secreta correcta de la autoridad de certificación para continuar.",
                    missingCertificateDescription: "No se encontró ningún certificado, por favor cree uno.",
                    searchFailedDescription: "No se encontró ningún certificado, intente con otra búsqueda.",
                    sessionExpiredDescription: "La sesión ha expirado, seleccione un perfil.",
                }
            },
            confirmations: {
                confirmRevoke: "¿Está seguro de que desea revocar este certificado?",
                confirmDisable: "¿Está seguro de que desea deshabilitar este certificado?",
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
            inputs: {
                wrongPass: "Frase secreta incorrecta.",
                wrongPassLength: "La frase secreta debe tener al menos 4 caracteres.",
            },
            lang: {
                english: "Inglés",
                french: "Francés",
                spanish: "Español",
                german: "Alemán"
            },
            modals: {
                CA: "Autoridad de Certificación",
                CN: "Nombre Común",
                ORG: "Nombre de la Organización",
                ORGUNIT: "Nombre de la Unidad Organizativa",
                SUBJ: "Sujeto (O / OU / CN)",
                subject: "SAN (Nombre Alternativo del Sujeto)",
                type: "Tipo de certificado",
                selector: {
                    select1: "Servidor",
                    select2: "Usuario",
                },
                enterPass: "Ingrese su frase secreta (puede estar vacía)",
                missing: {
                    IP: "No se definió una IP",
                    DNS: "No se definió un DNS",
                    type: "No se definió un tipo",
                },
            },
            status: {
                valid: "Válido",
                expired: "Expirado",
                revoked: "Revocado",
                disabled: "Deshabilitado",
                unknown: "Desconocido"
            },
            tags: {
                valid: "Certificados válidos",
                expired: "Certificados caducados",
                revoked: "Certificados revocados",
                disabled: "Certificados desactivados",
            },
            titles: {
                searchBar: "Buscar un certificado",
                selectProfile: "Seleccionar un perfil",
                enterPass: "Ingrese su frase secreta",
                createMultiSan: "Crear Certificado Multi SAN",
                viewCert: "Detalles del certificado",
                renewCert: "Renovar Certificado",
                revokeCert: "Revocar Certificado",
                disableCert: "Deshabilitar Certificado",
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
            alerts: {
                errors: {
                    errorFound: "Fehler",
                    incorrectCN: "Falscher CN",
                    incorrectDNS: "Falscher DNS",
                    incorrectFormat: "Falsches Format",
                    incorrectIP: "Falsche IP",
                    incorrectPassphrase: "Falsches Passwort",
                    missingCertificate: "Fehlende Zertifikate",
                    searchFailed: "Kein Zertifikat gefunden",
                    sessionExpired: "Sitzung abgelaufen",
                },
                descriptions: {
                    errorFoundDescription: "Ein Fehler ist aufgetreten. Siehe Protokolle für weitere Details.",
                    incorrectCNDescription: "Dieser Zertifikatsname ist bereits vergeben. Wählen Sie einen anderen Namen.",
                    incorrectDNSDescription: "Dieser DNS ist bereits ausgewählt. Wählen Sie einen anderen.",
                    incorrectFormatDescription: "Verwenden Sie ein korrektes Format im SAN-Feld.",
                    incorrectIPDescription: "Diese IP-Adresse ist bereits ausgewählt. Wählen Sie eine andere.",
                    incorrectPassphraseDescription: "Verwenden Sie das richtige Passwort der Zertifizierungsstelle, um fortzufahren.",
                    missingCertificateDescription: "Kein Zertifikat gefunden, bitte erstellen Sie eines.",
                    searchFailedDescription: "Kein Zertifikat gefunden. Versuchen Sie eine andere Suche.",
                    sessionExpiredDescription: "Die Sitzung ist abgelaufen. Bitte wählen Sie ein Profil.",
                }
            },
            confirmations: {
                confirmRevoke: "Möchten Sie dieses Zertifikat wirklich widerrufen?",
                confirmDisable: "Möchten Sie dieses Zertifikat wirklich deaktivieren?",
            },
            headers: {
                status: "Status",
                commonName: "Allgemeiner Name (CN)",
                serial: "Seriennummer",
                signature: "Signatur",
                startDate: "Anfangsdatum",
                endDate: "Ablaufdatum",
                downloads: "Downloads",
            },
            inputs: {
                wrongPass: "Falsches Passwort.",
                wrongPassLength: "Das Passwort muss mindestens 4 Zeichen lang sein.",
            },
            lang: {
                english: "Englisch",
                french: "Französisch",
                spanish: "Spanisch",
                german: "Deutsch"
            },
            modals: {
                CA: "Zertifizierungsstelle",
                CN: "Allgemeiner Name",
                ORG: "Organisationsname",
                ORGUNIT: "Organisationseinheit",
                SUBJ: "Betreff (O / OU / CN)",
                subject: "SAN (Subject Alternative Name)",
                type: "Zertifikatstyp",
                selector: {
                    select1: "Server",
                    select2: "Benutzer",
                },
                enterPass: "Geben Sie Ihr Passwort ein (kann leer sein)",
                missing: {
                    IP: "Keine IP definiert",
                    DNS: "Kein DNS definiert",
                    type: "Kein Typ definiert",
                },
            },
            status: {
                valid: "Gültig",
                expired: "Abgelaufen",
                revoked: "Widerrufen",
                disabled: "Deaktiviert",
                unknown: "Unbekannt"
            },
            tags: {
                valid: "Gültige Zertifikate",
                expired: "Abgelaufene Zertifikate",
                revoked: "Widerrufene Zertifikate",
                disabled: "Deaktivierte Zertifikate",
            },            
            titles: {
                searchBar: "Nach einem Zertifikat suchen",
                selectProfile: "Profil auswählen",
                enterPass: "Geben Sie Ihr Passwort ein",
                createMultiSan: "Multi-SAN-Zertifikat erstellen",
                viewCert: "Zertifikatsdetails",
                renewCert: "Zertifikat erneuern",
                revokeCert: "Zertifikat widerrufen",
                disableCert: "Zertifikat deaktivieren",
            },
            undefined: "Undefiniert",
        },
    };

    let tags = [];
    let locked;
    let searchTimeout;
    let lang = localStorage.getItem('language') || 'en';

    // Language dropdown interactions
    $('#languageMenu .dropdown-item').removeClass('active').find('.checkmark').hide();
    $(`#languageMenu .dropdown-item[data-lang="${lang}"]`).addClass('active').find('.checkmark').show();
    $('#languageMenu .dropdown-item').click(function() {
        $('#languageMenu .dropdown-item').removeClass('active').find('.checkmark').hide();
        $(this).addClass('active').find('.checkmark').show();
        lang = $(this).data('lang');
        localStorage.setItem('language', lang);
        updateLanguage(lang);
        loadCertData();
    });

    // Focus first non-readonly input on modal opening
    document.querySelectorAll('[id$="Modal"]').forEach(modal => {
        modal.addEventListener('shown.bs.modal', () => {
            modal.querySelector('input[type="text"]:not(:read-only), input[type="password"]:not(:read-only)')?.focus();
        });
    });

    // Update the language
    function updateLanguage(lang) {
        // Search Bar
        $('#searchInput').attr('placeholder', texts[lang].titles.searchBar);

        // Password modal
        $('#passwordInput').attr('placeholder', texts[lang].modals.enterPass);
        $('#passwordModalTitle').html(texts[lang].titles.enterPass);
        $('#passwordSubmit').html(texts[lang].actions.confirm);

        // Alerts
        $('#errorFound').html(`<img src="images/triangle-exclamation-solid.svg" class="icon mt-0 me-2"/> <strong class="me-auto">${texts[lang].alerts.errors.errorFound}</strong>`);
        $('#errorFoundDescription').html(texts[lang].alerts.descriptions.errorFoundDescription);
        $('#incorrectCN').html(`<img src="images/triangle-exclamation-solid.svg" class="icon mt-0 me-2"/> <strong class="me-auto">${texts[lang].alerts.errors.incorrectCN}</strong>`);
        $('#incorrectCNDescription').html(texts[lang].alerts.descriptions.incorrectCNDescription);
        $('#incorrectDNS').html(`<img src="images/triangle-exclamation-solid.svg" class="icon mt-0 me-2"/> <strong class="me-auto">${texts[lang].alerts.errors.incorrectDNS}</strong>`);
        $('#incorrectDNSDescription').html(texts[lang].alerts.descriptions.incorrectDNSDescription);
        $('#incorrectFormat').html(`<img src="images/triangle-exclamation-solid.svg" class="icon mt-0 me-2"/> <strong class="me-auto">${texts[lang].alerts.errors.incorrectFormat}</strong>`);
        $('#incorrectFormatDescription').html(texts[lang].alerts.descriptions.incorrectFormatDescription);
        $('#incorrectIP').html(`<img src="images/triangle-exclamation-solid.svg" class="icon mt-0 me-2"/> <strong class="me-auto">${texts[lang].alerts.errors.incorrectIP}</strong>`);
        $('#incorrectIPDescription').html(texts[lang].alerts.descriptions.incorrectIPDescription);
        $('#incorrectPassphrase').html(`<img src="images/triangle-exclamation-solid.svg" class="icon mt-0 me-2"/> <strong class="me-auto">${texts[lang].alerts.errors.incorrectPassphrase}</strong>`);
        $('#incorrectPassphraseDescription').html(texts[lang].alerts.descriptions.incorrectPassphraseDescription);
        $('#missingCertificate').html(`<img src="images/triangle-exclamation-solid.svg" class="icon mt-0 me-2"/> <strong class="me-auto">${texts[lang].alerts.errors.missingCertificate}</strong>`);
        $('#missingCertificateDescription').html(texts[lang].alerts.descriptions.missingCertificateDescription);
        $('#searchFailed').html(`<img src="images/circle-info-solid.svg" class="icon mt-0"/> <strong class="m-auto">${texts[lang].alerts.errors.searchFailed}</strong> <img src="images/circle-info-solid.svg" class="icon mt-0"/>`);
        $('#searchFailedDescription').html(texts[lang].alerts.descriptions.searchFailedDescription);
        $('#sessionExpired').html(`<img src="images/circle-info-solid.svg" class="icon mt-0 me-2"/> <strong class="me-auto">${texts[lang].alerts.errors.sessionExpired}</strong>`);
        $('#sessionExpiredDescription').html(texts[lang].alerts.descriptions.sessionExpiredDescription);        

        // Tags tooltips
        $('#tagValid').closest('span').attr('data-bs-title', `${texts[lang].tags.valid}`);
        $('#tagExpired').closest('span').attr('data-bs-title', `${texts[lang].tags.expired}`);
        $('#tagRevoked').closest('span').attr('data-bs-title', `${texts[lang].tags.revoked}`);
        $('#tagDisabled').closest('span').attr('data-bs-title', `${texts[lang].tags.disabled}`);

        // Languages dropdown
        $('#english').html(`${texts[lang].lang.english} <span class="checkmark"><img src="images/check-solid.svg" class="icon ms-3"/></span>`);
        $('#french').html(`${texts[lang].lang.french} <span class="checkmark"><img src="images/check-solid.svg" class="icon ms-3"/></span>`);
        $('#spanish').html(`${texts[lang].lang.spanish} <span class="checkmark"><img src="images/check-solid.svg" class="icon ms-3"/></span>`);
        $('#german').html(`${texts[lang].lang.german} <span class="checkmark"><img src="images/check-solid.svg" class="icon ms-3"/></span>`);

        // Table headers
        $('th[data-sort="status"]').html(`<img src="images/chart-simple-solid.svg" class="icon me-1"/> ${texts[lang].headers.status}`);
        $('th[data-sort="commonName"]').html(`<img src="images/file-lines-solid.svg" class="icon me-1"/> ${texts[lang].headers.commonName}`);
        $('th[data-sort="serial"]').html(`<img src="images/hashtag-solid.svg" class="icon me-1"/> ${texts[lang].headers.serial}`);
        $('th[data-sort="startDate"]').html(`<img src="images/calendar-day-solid.svg" class="icon me-1"/> ${texts[lang].headers.startDate}`);
        $('th[data-sort="endDate"]').html(`<img src="images/calendar-days-solid.svg" class="icon me-1"/> ${texts[lang].headers.endDate}`);
    }

    // Update lock / unlock buttons
    function updateInterface() {
        // const checkboxes = document.querySelectorAll('.cert-checkbox');
        if (!locked) {
            // checkboxes.forEach(checkbox => { checkbox.disabled = false; });
            if (createBtn.disabled) {
                createBtn.disabled = false;
                createBtn.classList.replace('btn-secondary', 'btn-primary');
            }
            if (!lockBtn.classList.contains('btn-success')) {
                lockBtn.classList.replace('btn-danger', 'btn-success');
                lockBtn.innerHTML = `<img src="images/unlock-solid.svg" class="icon"/>`;
            }
        } else {
            // checkboxes.forEach(checkbox => { checkbox.disabled = true; });
            if (!createBtn.disabled) {
                createBtn.disabled = true;
                createBtn.classList.replace('btn-primary', 'btn-secondary');
            }
            if (!lockBtn.classList.contains('btn-danger')) {
                lockBtn.classList.replace('btn-success', 'btn-danger');
                lockBtn.innerHTML = `<img src="images/lock-white-solid.svg" class="icon"/>`;
            }
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

    // Update URL parameters
    function updateUrl(searchTerm, tags) {
        const params = new URLSearchParams();
        if (searchTerm) params.append('s', searchTerm);
        if (tags.length) params.append('tags', tags.join(','));
        history.pushState({}, '', `${location.pathname}${params.toString() ? `?${params}` : ''}`);
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => loadCertData(searchTerm, tags), 1000);
    }

    // Get selected tags
    function getSelectedTags() {
        const tags = [];
        if (!document.getElementById('tagValid').classList.contains('opacity-25')) tags.push('valid');
        if (!document.getElementById('tagExpired').classList.contains('opacity-25')) tags.push('expired');
        if (!document.getElementById('tagRevoked').classList.contains('opacity-25')) tags.push('revoked');
        if (!document.getElementById('tagDisabled').classList.contains('opacity-25')) tags.push('disabled');
        return tags;
    }

    // Initialize tool tips
    function initializeTooltips() {
        $('[data-bs-toggle="tooltip"]').tooltip({ html: true });
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

    // Format date to YYYY/MM/DD from ISO format
    function formatDate(isoDateString) {
        const date = new Date(isoDateString);
        return date.toISOString().split('T')[0];
    }

    // Sorting columns
    function sortTable(sortKey, order) {
        const rows = Array.from(tableContent.querySelectorAll('tr'));

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
                    return new Date(dateStr.trim());
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
        rows.forEach(row => tableContent.appendChild(row));
    }

    // Function to load data & update table
    function loadCertData(searchTerm = '', tags = []) {
        loadCertificateAuthorities()
            .then(async () => {
                const response = await fetch(`${API_BASE_URL}/list`);
                if (!response.ok) {
                    showAlert('listAlert');
                    tableContent.innerHTML = '';
                    return Promise.reject();
                }

                tableContent.innerHTML = '';

                const data = await response.json();
                let anyMatchFound = false;

                const filteredData = tags.length === 0 ? data.filter(cert => cert.status === 'V') : data;
                filteredData.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

                const expSoon = new Date();
                expSoon.setDate(expSoon.getDate() + 30);

                filteredData.forEach(cert => {
                    const certEnd = new Date(cert.endDate);
                    const status = cert.status;
                    const statusMap = {
                        V: { color: 'success', icon: 'circle-check-solid.svg', textKey: 'valid' },
                        E: { color: 'warning', icon: 'triangle-exclamation-solid.svg', textKey: 'expired' },
                        R: { color: 'danger', icon: 'circle-xmark-solid.svg', textKey: 'revoked' },
                        D: { color: 'dark', icon: 'circle-minus-solid.svg', textKey: 'disabled' },
                        default: { color: 'secondary', icon: 'question-solid.svg', textKey: 'unknown' }
                    };

                    const { color, icon, textKey } = statusMap[status] || statusMap.default;
                    const statusText = texts[lang].status[textKey];
                    const statusBtn = `<img src="images/${icon}" class="icon me-1"/> ${statusText}`;
                    const statusColor = certEnd <= expSoon && certEnd > new Date() ? 'expiration' : color;

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <!--
                        <td class="text-center check-container"><input type="checkbox" class="cert-checkbox" data-id="${cert.id}" ${status === 'D' ? 'disabled' : ''}></td>
                        -->
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
                                <a class='btn btn-light btn-sm d-block text-start mb-1' href='download-crt?cert=${cert.id}' download><img src='images/certificate-solid.svg' class='icon me-1'/>.crt</a>
                                <a class='btn btn-light btn-sm d-block text-start mb-1' href='download-csr?cert=${cert.id}' download><img src='images/lock-solid.svg' class='icon me-1'/>.csr</a>
                                <a class='btn btn-light btn-sm d-block text-start mb-1' href='download-key?cert=${cert.id}' download><img src='images/key-solid.svg' class='icon me-1'/>.key</a>
                                <a class='btn btn-light btn-sm d-block text-start exportP12 ${cert.keyStatus === 'encrypted' ? '' : 'disabled'}'><img src='images/file-export-solid.svg' class='icon me-1'/>.p12</a>
                            ">
                                <img src="images/file-arrow-down-solid.svg" class="icon"/>
                            </button>
                        </td>
                    `;
                    tableContent.appendChild(row);

                    const searchTermNorm = searchTerm.toLowerCase();
                    const matchTags = tags.length === 0 || tags.includes(textKey);
                    const matchSearch = searchTermNorm === '' || row.textContent.toLowerCase().includes(searchTermNorm);

                    if (matchTags && matchSearch) {
                        anyMatchFound = true;
                        row.style.display = '';
                        if (searchTermNorm !== '') {
                            row.querySelectorAll('td').forEach(cell => {
                                if (cell.textContent.toLowerCase().includes(searchTermNorm)) cell.classList.add('highlight');
                                else cell.classList.remove('highlight');
                            });
                        }
                    } else row.style.display = 'none';

                    // On action buttons click, show modal
                    row.querySelector('.renew').addEventListener('click', () => showModal('renew', cert));
                    row.querySelector('.revoke').addEventListener('click', () => showModal('revoke', cert));
                    row.querySelector('.disable').addEventListener('click', () => showModal('disable', cert));

                    row.addEventListener('click', function(event) {
                        if (!event.target.closest('.check-container') && !event.target.closest('.status-container') 
                            && !event.target.closest('.download-container')) { showModal('view', cert); }
                    });

                    // On line hover, show / hide action buttons
                    row.addEventListener('mouseover', () => {
                        if (!locked) {
                            // const checkboxes = document.querySelectorAll('.cert-checkbox');
                            // const isAnyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);

                            // if (status === 'D' || isAnyChecked) return; <<<=== Use this when checkboxes activated
                            if (status === 'D') return;

                            row.querySelector('.btn-status').style.display = 'none';
                            row.querySelector('.action-buttons').style.display = 'flex';
                        }
                    });
                    row.addEventListener('mouseout', () => {
                        row.querySelector('.btn-status').style.display = '';
                        row.querySelector('.action-buttons').style.display = 'none';
                    });
                });

                // Shift + click checkboxes
                // let lastChecked = null;
                // const checkboxes = document.querySelectorAll('.cert-checkbox');
                // checkboxes.forEach(checkbox => {
                //     checkbox.addEventListener('click', function(event) {
                //         event.stopPropagation();
                //         if (!lastChecked) {
                //             lastChecked = this;
                //             return;
                //         }

                //         if (event.shiftKey) {
                //             let inBetween = false;
                //             checkboxes.forEach(cb => {
                //                 if (cb === this || cb === lastChecked) inBetween = !inBetween;
                //                 if (inBetween && !cb.disabled) cb.checked = this.checked;
                //             });
                //         }
                //         lastChecked = this;
                //     });
                // });

                // Select all checkboxes on header click
                // selectBoxHeader.addEventListener('click', () => {
                //     const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked || checkbox.disabled);
                //     checkboxes.forEach(checkbox => { if (!checkbox.disabled) checkbox.checked = !allChecked; });
                // });

                // Tooltips
                var tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
                var tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

                // Hide tooltips on mouse out
                document.addEventListener('click', () => { tooltipList.forEach(tooltip => { tooltip.hide(); }); });

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
                document.addEventListener('click', () => { popoverList.forEach(popover => { popover.hide(); }); });

                if ((searchTerm || tags.length) && !anyMatchFound) showAlert('searchAlert');
                else hideAlert('searchAlert');

                initializeTooltips();
                updateInterface();
            })
            .catch(() => {
                showAlert('profileAlert');
                return Promise.reject();
            });
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
            if (certData.issuer !== '') var caValue = certData.issuer.split('CN = ')[1] || certData.issuer;
            if (certData.subject !== '') {
                var subjectArray = (certData.subject || '')
                    .replace(/^Subject\s*\(.*?\):\s*/, '')
                    .split(/(?:\/|\n)/)
                    .filter(Boolean);

                var cnValue, oValue, ouValue = '';

                subjectArray.forEach(part => {
                    if (part.startsWith('CN=')) cnValue = part.replace('CN=', '');
                    else if (part.startsWith('O=')) oValue = part.replace('O=', '');
                    else if (part.startsWith('OU=')) ouValue = part.replace('OU=', '');
                });
            }
        } catch {};

        switch (action) {
            case 'create':
                modalTitle.textContent = texts[lang].titles.createMultiSan;
                formContent.innerHTML = `
                    <div class="mb-3">
                        <div class="input-group">
                            <span class="input-group-text">CN</span>
                            <input type="text" class="form-control" id="commonName" placeholder="${texts[lang].modals.CN}" required>
                        </div>
                    </div>
                    <!--
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
                    -->
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
                document.getElementById('confirmAction').onclick = async () => {
                    let commonName = document.getElementById('commonName').value;
                    // const org = document.getElementById('org').value.trim();
                    // const orgUnit = document.getElementById('orgunit').value.trim();
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
                    // if (org) subject += `/O=${org}`;
                    // if (orgUnit) subject += `/OU=${orgUnit}`;
                    // if ((org && orgUnit) || org || orgUnit) subject += `/CN=${commonName}`;

                    try {
                        const data = {
                            commonName: commonName,
                            subject: subject,
                            sanIP: sanIP,
                            sanDNS: sanDNS,
                            // type: type + '_ext',
                            startDate: startDate,
                            endDate: endDate,
                        };

                        const response = await fetch(`${API_BASE_URL}/create`, {
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
                    } catch (error) { console.error('Creation error:', error); }
                };
                break;
            case 'view':
                const commonName = certData.id;
                fetch(`${API_BASE_URL}/subject-alt?cert=${commonName}`)
                    .then(response => {
                        if (!response.ok) {
                            showAlert('basicAlert');
                            return Promise.reject();
                        }
                        return response.json();
                    })
                    .then(subjAlt => {
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
                                <p><strong>${texts[lang].modals.CA}:</strong> ${caValue}</p>
                                <p><strong>${texts[lang].modals.CN}:</strong> ${commonName ? commonName : `${texts[lang].undefined}`}</p>
                                <p><strong>${texts[lang].modals.SUBJ}:</strong> ${splitSubject}</p>

                                <p><strong>${texts[lang].headers.serial}:</strong> ${certData.serial ? certData.serial : `${texts[lang].undefined}`}</p>
                                <p><strong>${texts[lang].headers.signature}:</strong> ${certData.hash ? certData.hash : `${texts[lang].undefined}`}</p>

                                <p><strong>IP:</strong> ${ipList.length > 0 ? ipList.map(ip => `<span>${ip}</span>`).join(', ') : `${texts[lang].modals.missing.IP}`}</p>
                                <p><strong>DNS:</strong> ${dnsList.length > 0 ? dnsList.map(dns => `<span>${dns}</span>`).join(', ') : `${texts[lang].modals.missing.DNS}`}</p>

                                <p><strong>${texts[lang].modals.type}:</strong> ${certData.type === 'server_ext' ? texts[lang].modals.selector.select1 : certData.type === 'user_ext' ? texts[lang].modals.selector.select2 : certData.type || texts[lang].modals.missing.type}</p>
                                <p><strong>${texts[lang].headers.startDate}:</strong> ${certData.startDate ? certData.startDate : `${texts[lang].undefined}`}</p>
                                <p><strong>${texts[lang].headers.endDate}:</strong> ${certData.endDate ? certData.endDate : `${texts[lang].undefined}`}</p>

                                <p class="text-wrap">
                                    <strong class="me-2">${texts[lang].headers.downloads}:</strong>
                                    <span class="d-inline-block mt-1">
                                        <a class="btn btn-light btn-sm mb-1 me-1" href='download-crt?cert=${commonName}' download>
                                            <img src="images/certificate-solid.svg" class="icon me-1"/>.crt
                                        </a>
                                        <a class="btn btn-light btn-sm mb-1 me-1" href='download-csr?cert=${commonName}' download>
                                            <img src="images/lock-solid.svg" class="icon me-1"/>.csr
                                        </a>
                                        <a class="btn btn-light btn-sm mb-1 me-1" href='download-key?cert=${commonName}' download>
                                            <img src="images/key-solid.svg" class="icon me-1"/>.key
                                        </a>
                                        <a class="btn btn-light btn-sm mb-1 exportP12 ${certData.keyStatus === 'encrypted' ? '' : 'disabled'}">
                                            <img src="images/file-export-solid.svg" class="icon me-1"/>.p12
                                        </a>
                                    </span>
                                </p>
                            </div>
                        `;
                        footerContent.style.display = 'none';
                    })
                    .catch(error => console.error('Certificate displaying error:', error));
                break;
            case 'renew':
                modalTitle.textContent = `${texts[lang].titles.renewCert}`;
                formContent.innerHTML = `
                    <div class="mb-3">
                        <div class="input-group">
                            <span class="input-group-text">CA</span>
                            <input type="text" class="form-control" id="certificateAuthority" placeholder="${texts[lang].modals.CA}" value="${caValue}" readonly>
                        </div>
                    </div>
                    <div class="mb-3">
                        <div class="input-group">
                            <span class="input-group-text">CN</span>
                            <input type="text" class="form-control" id="commonName" placeholder="${texts[lang].modals.CN}" value="${cnValue}" readonly>
                        </div>
                    </div>
                    <!--
                    <div class="mb-3">
                        <div class="input-group">
                            <span class="input-group-text">/O=</span>
                            <input type="text" class="form-control" id="org" aria-label="Organisation" placeholder="${texts[lang].modals.ORG}" value="${oValue}">
                        </div>
                    </div>
                    <div class="mb-3">
                        <div class="input-group">
                            <span class="input-group-text">/OU=</span>
                            <input type="text" class="form-control" id="orgunit" aria-label="Organisation Unit" placeholder="${texts[lang].modals.ORGUNIT}" value="${ouValue}">
                        </div>
                    </div>
                    -->
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
                    <button type="button" class="btn btn-primary" id="confirmAction">${texts[lang].actions.renew}</button>
                `;

                // Confirm certificate renewal
                document.getElementById('confirmAction').onclick = async () => {
                    const commonName = document.getElementById('commonName').value;
                    // const org = document.getElementById('org').value.trim();
                    // const orgUnit = document.getElementById('orgunit').value.trim();
                    const sanIP = Array.from(document.getElementById('addedSanIP').children).map(el => el.innerText);
                    const sanDNS = Array.from(document.getElementById('addedDnsNames').children).map(el => el.innerText);
                    // const type = document.getElementById('type').value;
                    const startDate = document.getElementById('startDate').value;
                    const endDate = document.getElementById('endDate').value;
                    const confirmAction = document.getElementById('confirmAction');

                    confirmAction.disabled = true;

                    let subject = '';
                    // if (org) subject += `/O=${org}`;
                    // if (orgUnit) subject += `/OU=${orgUnit}`;
                    // if ((org && orgUnit) || org || orgUnit) subject += `/CN=${commonName}`;

                    try {
                        const data = {
                            commonName: commonName,
                            subject: subject,
                            sanIP: sanIP,
                            sanDNS: sanDNS,
                            // type: type + '_ext',
                            startDate: startDate,
                            endDate: endDate,
                        };

                        const response = await fetch(`${API_BASE_URL}/renew`, {
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
                    } catch (error) { console.error('Renewal error:', error); }
                };
                break;
            case 'revoke':
                modalTitle.textContent = `${texts[lang].titles.revokeCert}`;
                formContent.innerHTML = `
                    <p>${texts[lang].confirmations.confirmRevoke}</p>
                    <div class="mb-3">
                        <div class="input-group">
                            <span class="input-group-text">CA</span>
                            <input type="text" class="form-control" id="certificateAuthority" placeholder="${texts[lang].modals.CA}" value="${caValue}" readonly>
                        </div>
                    </div>
                    <div class="mb-3">
                        <div class="input-group">
                            <span class="input-group-text">CN</span>
                            <input type="text" class="form-control" id="commonName" placeholder="${texts[lang].modals.CN}" value="${cnValue}" readonly>
                        </div>
                    </div>
                `;
                footerContent.innerHTML = `
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${texts[lang].actions.cancel}</button>
                    <button type="button" class="btn btn-primary" id="confirmAction">${texts[lang].actions.revoke}</button>
                `;

                // Confirm certificate revocation
                document.getElementById('confirmAction').onclick = async () => {
                    let commonName = document.getElementById('commonName').value;
                    const confirmAction = document.getElementById('confirmAction');

                    confirmAction.disabled = true;

                    try {
                        const response = await fetch(`${API_BASE_URL}/revoke`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ commonName: commonName })
                        });
                
                        if (response.ok) {
                            loadCertData();
                            modal.hide();
                        } else {
                            showAlert('passphraseAlert');
                            confirmAction.disabled = false;
                        }
                    } catch (error) { console.error('Revocation error:', error); }
                };
                break;
            case 'disable':
                modalTitle.textContent = `${texts[lang].titles.disableCert}`;
                formContent.innerHTML = `
                    <p>${texts[lang].confirmations.confirmDisable}</p>
                    <div class="mb-3">
                        <div class="input-group">
                            <span class="input-group-text">CA</span>
                            <input type="text" class="form-control" id="certificateAuthority" placeholder="${texts[lang].modals.CA}" value="${caValue}" readonly>
                        </div>
                    </div>
                    <div class="mb-3">
                        <div class="input-group">
                            <span class="input-group-text">CN</span>
                            <input type="text" class="form-control" id="commonName" placeholder="${texts[lang].modals.CN}" value="${cnValue}" readonly>
                        </div>
                    </div>
                `;
                footerContent.innerHTML = `
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${texts[lang].actions.cancel}</button>
                    <button type="button" class="btn btn-primary" id="confirmAction">${texts[lang].actions.disable}</button>
                `;

                // Confirm certificate deactivation
                document.getElementById('confirmAction').onclick = async () => {
                    const commonName = document.getElementById('commonName').value;
                    const confirmAction = document.getElementById('confirmAction');
                    confirmAction.disabled = true;
                    try {
                        const response = await fetch(`${API_BASE_URL}/disable`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ commonName: commonName })
                        });

                        if (response.ok) {
                            loadCertData();
                            modal.hide();
                        } else {
                            showAlert('passphraseAlert');
                            confirmAction.disabled = false;
                        }
                    } catch (error) { console.error('Deactivation error:', error); }
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

            addIpButton.onclick = () => {
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
                        ipItem.querySelector('.btn-close').onclick = () => {
                            ipList.removeChild(ipItem);
                        };
                        ipList.appendChild(ipItem);
                        document.getElementById('sanIP').value = '';
                    } else showAlert('formatAlert');
                } else if (ipExists) showAlert('IPAlert');
            };

            addDnsButton.onclick = () => {
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
                        dnsItem.querySelector('.btn-close').onclick = () => {
                            dnsList.removeChild(dnsItem);
                        };
                        dnsList.appendChild(dnsItem);
                        document.getElementById('sanDNS').value = '';
                    } else showAlert('formatAlert');
                } else if (dnsExists) showAlert('DNSAlert');
            };
        }
    }

    // Check if current interface has to be locked
    async function isLocked() {
        try {
            const response = await fetch(`${API_BASE_URL}/is-locked`);
            if (!response.ok) return Promise.reject();
            locked = (await response.json()).response;
            return locked;
        } catch (error) { return true; }
    }

    // Check if common name exists
    async function checkCommonName(commonName) {
        try {
            const response = await fetch(`${API_BASE_URL}/list`);
            const cert = await response.json();
            return cert.some(cert => cert.id === commonName);
        } catch (error) { return false; }
    }

    // Load profiles in dropdown
    async function loadCertificateAuthorities() {
        try {
            const { profiles, currentProfile } = await (await fetch(`${API_BASE_URL}/profiles`)).json();
            if (!Array.isArray(profiles)) throw new Error('Invalid profiles response');

            switchBtn.innerHTML = capitalize(currentProfile);
            switchMenu.innerHTML = profiles.map(profile => 
                `<a id="${profile}" class="dropdown-item text-truncate ${profile === currentProfile ? 'active' : ''}">${capitalize(profile)}</a>`
            ).join('');

            switchMenu.querySelectorAll('.dropdown-item').forEach(item => item.addEventListener('click', () => switchProfile(item.id, currentProfile)));
        } catch (error) { console.error(error); }
    }

    // Switch profile, update password, interface and search
    async function switchProfile(profile, currentProfile) {
        if (profile === currentProfile) return;

        try {
            await fetch(`${API_BASE_URL}/switch-profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profile }),
            });

            switchBtn.innerHTML = capitalize(profile);
            switchMenu.querySelectorAll('.dropdown-item').forEach(el => el.classList.remove('active'));
            document.getElementById(profile).classList.add('active');
            
            hideAlert('profileAlert');

            passwordInput.value = '';
            passwordInput.classList.remove('is-invalid');
            wrongPassword.style.display = 'none';
            passwordSubmit.className = 'btn btn-primary float-end mt-3';
            passwordSubmit.disabled = false;

            const response = await fetch(`${API_BASE_URL}/set-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ca_password: null }),
            });

            locked = true;
            updateInterface();
            
            if (response.ok) loadCertData(searchInput.value, getSelectedTags());
            else showAlert('basicAlert');
        } catch (error) { showAlert('basicAlert'); }
    }

    // Open modal or lock interface
    async function handleLock() {
        try {
            if (await isLocked()) {
                passwordModal.show();
            } else {
                const response = await fetch(`${API_BASE_URL}/set-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ca_password: null }),
                });

                if (response.ok) locked = true;
                updateInterface();
            }
        } catch (error) { showAlert('basicAlert'); }
    }

    // Password submit form
    async function handlePasswordSubmit(event) {
        event.preventDefault();
        passwordSubmit.disabled = true;
        try {
            if (await isLocked()) {
                const response = await fetch(`${API_BASE_URL}/set-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ca_password: passwordInput.value }),
                });

                if (response.ok) {
                    locked = false;
                    passwordModal.hide();
                    passwordInput.value = '';
                    updateInterface();
                } else showPasswordError();
            }
        } catch (error) { showAlert('basicAlert'); }
    }

    // Styling password input on typing
    function handlePasswordInput() {
        passwordSubmit.disabled = passwordInput.value.length < 4;
        passwordSubmit.className = passwordSubmit.disabled ? 'btn btn-danger float-end mt-3' : 'btn btn-primary float-end mt-3';
        if (passwordInput.value.length < 4 && passwordInput.value.length > 0) {
            wrongPassword.textContent = `${texts[lang].inputs.wrongPassLength}`;
            wrongPassword.style.display = 'block';
            passwordInput.classList.add('is-invalid');
        } else {
            wrongPassword.style.display = 'none';
            passwordInput.classList.remove('is-invalid');
        }
    }

    // Show password error
    function showPasswordError() {
        passwordSubmit.className = `btn ${locked ? 'btn-danger' : ''} float-end mt-3`;
        passwordInput.classList.toggle('is-invalid', locked);
        wrongPassword.textContent = `${texts[lang].inputs.wrongPass}`;
        wrongPassword.style.display = 'block';
        showAlert('passphraseAlert');
    }

    // Create button modal opening
    createBtn.addEventListener('click', (event) => {
        if (createBtn.disabled) return;
        event.preventDefault();
        showModal('create');
    });

    // Update url on searchbar input
    searchInput.addEventListener('input', () => updateUrl(searchInput.value, getSelectedTags()));
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            updateUrl(searchInput.value, getSelectedTags());
        }
    });

    // Lock interface button
    lockBtn.addEventListener('click', handleLock);
    lockBtn.addEventListener('keydown', (event) => { if (event.key === 'Enter') event.preventDefault(); });

    // Password form events
    passwordForm.addEventListener('submit', handlePasswordSubmit);
    passwordForm.addEventListener('input', handlePasswordInput);

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
            const currentOrder = this.classList.contains('desc') ? 'asc' : 'desc';
            this.classList.remove('asc', 'desc');
            this.classList.add(currentOrder || 'desc');
            sortTable(sortKey, currentOrder);
        });
    });

    // Tags toggle
    document.querySelectorAll('.btn-ssm').forEach(button => {
        button.addEventListener('click', () => {
            let tags = getSelectedTags();
            if (button.id === 'tagValid' && tags.length === 1 && tags.includes('valid')) return;
            button.classList.toggle('opacity-25');
            const searchTerm = searchInput.value;
            tags = getSelectedTags();
            updateUrl(searchTerm, tags);
            if (!tags.includes('valid') && !tags.length > 0) document.getElementById('tagValid').classList.remove('opacity-25');
        });
    });

    // Prevent mouseover event on action buttons
    document.querySelectorAll('.btn-action').forEach(button => {
        button.addEventListener('mouseover', (event) => {
            event.preventDefault();
        });
    });

    if (searchTerm) searchInput.value = searchTerm;
    if (tagsParam) tags = tagsParam.split(',').map(tag => tag.trim());
    if (!tags.includes('valid') && tags.length > 0) document.getElementById('tagValid').classList.add('opacity-25');
    if (!tags.includes('expired')) document.getElementById('tagExpired').classList.add('opacity-25');
    if (!tags.includes('revoked')) document.getElementById('tagRevoked').classList.add('opacity-25');
    if (!tags.includes('disabled')) document.getElementById('tagDisabled').classList.add('opacity-25');

    await isLocked();
    setInterval(async () => { await isLocked(), updateInterface(); }, 5000);
    loadCertData(searchTerm, tags);
    updateLanguage(lang);
});
