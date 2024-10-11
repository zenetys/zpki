document.addEventListener('DOMContentLoaded', function() {
    const passwordModal = new bootstrap.Modal(document.getElementById('passwordModal'));
    const createBtn = document.getElementById('createBtn');
    const certSearchInput = document.getElementById('certSearch');
    const certTableBody = document.getElementById('certTableBody');
    const selectBoxHeader = document.querySelector('[data-sort="selectBox"]');
    const lockInterface = document.getElementById('lockInterface');
    const passwordInput = document.getElementById('password');
    const texts = {
        en: {
            searchPlaceholder: "Search for a certificate",
            revoke: "Revoke",
            renew: "Renew",
            lock: "Lock",
            unlock: "Unlock",
            done: "Done!",
            lang: {
                english: "English",
                french: "French",
                spanish: "Spanish",
                german: "German"
            },
            certificate: {
                createMultiSan: "Create Multi SAN Certificate",
                CN: "Common Name",
                SUBJ: "Subject (OU / O / L)",
                IP: "No IP defined",
                DNS: "No DNS defined",
                type: "Certificate Type",
                select1: "Server",
                select2: "User",
                startDate: "Start Date",
                endDate: "End Date",
                passPhrase: "Enter Passphrase",
                enterPass: "Enter your passphrase (can be empty)",
                confirmPass: "Confirm your passphrase",
                cancel: "Cancel",
                confirm: "Confirm",
                undefined: "Undefined",
                status: "Status",
                serial: "Serial",
                signature: "Signature",
                common_name: "Common Name (CN)",
                downloads: "Downloads",
                statusBtn: {
                    valid: "Valid",
                    expired: "Expired",
                    revoked: "Revoked",
                    disabled: "Disabled",
                    unknown: "Unknown"
                },
            },
        },
        fr: {
            searchPlaceholder: "Rechercher un certificat",
            revoke: "Révoquer",
            renew: "Renouveler",
            lock: "Verrouiller",
            unlock: "Déverrouiller",
            done: "Fait !",
            lang: {
                english: "Anglais",
                french: "Français",
                spanish: "Espagnol",
                german: "Allemand"
            },
            certificate: {
                createMultiSan: "Créer un certificat Multi SAN",
                CN: "Common Name",
                SUBJ: "Objet (OU / O / L)",
                IP: "Aucune IP définie",
                DNS: "Aucun DNS défini",
                type: "Type de Certificat",
                select1: "Serveur",
                select2: "Utilisateur",
                startDate: "Date de Début",
                endDate: "Date de Fin",
                passPhrase: "Entrez la passphrase",
                enterPass: "Entrez votre passphrase (peut être vide)",
                confirmPass: "Confirmez votre passphrase",
                cancel: "Annuler",
                confirm: "Confirmer",
                undefined: "Indéfini",
                status: "Statut",
                serial: "Numéro de série",
                signature: "Signature",
                common_name: "Common Name (CN)",
                downloads: "Téléchargements",
                statusBtn: {
                    valid: "Valide",
                    expired: "Expiré",
                    revoked: "Révoqué",
                    disabled: "Désactivé",
                    unknown: "Inconnu"
                },
            },
        },
        es: {
            searchPlaceholder: "Buscar un certificado",
            revoke: "Revocar",
            renew: "Renovar",
            lock: "Bloquear",
            unlock: "Desbloquear",
            done: "¡Hecho!",
            lang: {
                english: "Inglés",
                french: "Francés",
                spanish: "Español",
                german: "Alemán"
            },
            certificate: {
                createMultiSan: "Crear un Certificado Multi SAN",
                CN: "Nombre Común",
                SUBJ: "Sujeto (OU / O / L)",
                IP: "No hay IP definida",
                DNS: "No hay DNS definido",
                type: "Tipo de Certificado",
                select1: "Servidor",
                select2: "Usuario",
                startDate: "Fecha de Inicio",
                endDate: "Fecha de Fin",
                passPhrase: "Introduzca la frase de contraseña",
                enterPass: "Ingrese su frase de contraseña (puede estar vacía)",
                confirmPass: "Confirme su frase de contraseña",
                cancel: "Cancelar",
                confirm: "Confirmar",
                undefined: "Indefinido",
                status: "Estado",
                serial: "Número de serie",
                signature: "Firma",
                common_name: "Nombre Común (CN)",
                downloads: "Descargas",
                statusBtn: {
                    valid: "Válido",
                    expired: "Expirado",
                    revoked: "Revocado",
                    disabled: "Desactivado",
                    unknown: "Desconocido"
                },
            },
        },
        de: {
            searchPlaceholder: "Zertifikat suchen",
            revoke: "Widerrufen",
            renew: "Erneuern",
            lock: "Sperren",
            unlock: "Entsperren",
            done: "Fertig!",
            lang: {
                english: "Englisch",
                french: "Französisch",
                spanish: "Spanisch",
                german: "Deutsch"
            },
            certificate: {
                createMultiSan: "Multi SAN-Zertifikat erstellen",
                CN: "Gemeinsamer Name",
                SUBJ: "Betreff (OU / O / L)",
                IP: "Keine IP definiert",
                DNS: "Kein DNS definiert",
                type: "Zertifikatstyp",
                select1: "Server",
                select2: "Benutzer",
                startDate: "Startdatum",
                endDate: "Enddatum",
                passPhrase: "Geben Sie die Passphrase ein",
                enterPass: "Geben Sie Ihre Passphrase ein (kann leer sein)",
                confirmPass: "Bestätigen Sie Ihre Passphrase",
                cancel: "Abbrechen",
                confirm: "Bestätigen",
                undefined: "Undefiniert",
                status: "Status",
                serial: "Seriennummer",
                signature: "Unterschrift",
                common_name: "Gemeinsamer Name (CN)",
                downloads: "Downloads",
                statusBtn: {
                    valid: "Gültig",
                    expired: "Abgelaufen",
                    revoked: "Widerrufen",
                    disabled: "Deaktiviert",
                    unknown: "Unbekannt"
                },
            },
        },
    };    

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
        $('#certName').attr('placeholder', texts[lang].certificateNamePlaceholder);
        $('#certSearch').attr('placeholder', texts[lang].searchPlaceholder);
        $('#english').html(`${texts[lang].lang.english} <span class="checkmark"><img src="images/check-solid.svg" class="icon ms-3"/></span>`);
        $('#french').html(`${texts[lang].lang.french} <span class="checkmark"><img src="images/check-solid.svg" class="icon ms-3"/></span>`);
        $('#spanish').html(`${texts[lang].lang.spanish} <span class="checkmark"><img src="images/check-solid.svg" class="icon ms-3"/></span>`);
        $('#german').html(`${texts[lang].lang.german} <span class="checkmark"><img src="images/check-solid.svg" class="icon ms-3"/></span>`);
        
        // Update table headers
        $('th[data-sort="status"]').html(`<img src="images/chart-simple-solid.svg" class="icon me-1"/> ${texts[lang].certificate.status}`);
        $('th[data-sort="serial"]').html(`<img src="images/hashtag-solid.svg" class="icon me-1"/> ${texts[lang].certificate.serial}`);
        $('th[data-sort="id"]').html(`<img src="images/file-lines-solid.svg" class="icon me-1"/> ${texts[lang].certificate.CN}`);
        $('th[data-sort="startDate"]').html(`<img src="images/calendar-day-solid.svg" class="icon me-1"/> ${texts[lang].certificate.startDate}`);
        $('th[data-sort="endDate"]').html(`<img src="images/calendar-days-solid.svg" class="icon me-1"/> ${texts[lang].certificate.endDate}`);
    }

    let isLocked = JSON.parse(localStorage.getItem('isLocked')) || false;

    // Update lock / unlock buttons
    function updateInterface() {
        const checkboxes = document.querySelectorAll('.cert-checkbox');
        if (!isLocked) {
            checkboxes.forEach(checkbox => {
                checkbox.disabled = false;
            });
            lockInterface.classList.remove('btn-danger');
            lockInterface.classList.add('btn-success');
            lockInterface.innerHTML = `<img src="images/unlock-solid.svg" class="icon"/>`;
        } else {
            checkboxes.forEach(checkbox => {
                checkbox.disabled = true;
            });
            lockInterface.classList.remove('btn-success');
            lockInterface.classList.add('btn-danger');
            lockInterface.innerHTML = `<img src="images/lock-solid.svg" class="icon"/>`;
        }
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
    
    // // Update actions buttons
    // function updateActionButtons() {
    //     const selectedCerts = document.querySelectorAll('.cert-checkbox.active');
    //     if (selectedCerts.length > 0) {
    //         pass
    //     } else {
    //         pass
    //     }
    // }

    // Sorting columns
    function sortTable(sortKey, order) {
        const rows = Array.from(certTableBody.querySelectorAll('tr'));

        if (!sortKey || sortKey === 'selectBox' || sortKey === 'downloads') {
            return;
        }

        rows.sort((a, b) => {
            const cellA = a.querySelector(`td[data-sort="${sortKey}"]`);
            const cellB = b.querySelector(`td[data-sort="${sortKey}"]`);

            if (!cellA || !cellB) return 0;

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

            if (sortKey === 'startDate' || sortKey === 'endDate') {
                const dateA = new Date(cellA.textContent.trim());
                const dateB = new Date(cellB.textContent.trim());
                return order === 'asc' ? dateA - dateB : dateB - dateA;
            }
            const valueA = cellA.textContent.trim();
            const valueB = cellB.textContent.trim();

            return order === 'asc'
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
        });

        rows.forEach(row => certTableBody.appendChild(row));
    }

    function loadCertData() {
        fetch('/list')
            .then(response => response.json())
            .then(data => {
                certTableBody.innerHTML = '';
                data.forEach(cert => {
                    const status = cert.status;
                    let statusColor, statusBtn, statusText;
    
                    if (status === 'V') {
                        statusColor = 'success';
                        statusText = texts[lang].certificate.statusBtn.valid;
                        statusBtn = `<img src="images/circle-check-solid.svg" class="icon me-1"/> ${statusText}`;
                    } else if (status === 'E') {
                        statusColor = 'warning';
                        statusText = texts[lang].certificate.statusBtn.expired;
                        statusBtn = `<img src="images/triangle-exclamation-solid.svg" class="icon me-1"/> ${statusText}`;
                    } else if (status === 'R') {
                        statusColor = 'danger';
                        statusText = texts[lang].certificate.statusBtn.revoked;
                        statusBtn = `<img src="images/circle-xmark-solid.svg" class="icon me-1"/> ${statusText}`;
                    } else if (status === 'D') {
                        statusColor = 'dark';
                        statusText = texts[lang].certificate.statusBtn.disabled;
                        statusBtn = `<img src="images/circle-minus-solid.svg" class="icon me-1"/> ${statusText}`;
                    } else {
                        statusColor = 'secondary';
                        statusText = texts[lang].certificate.statusBtn.unknown;
                        statusBtn = `<img src="images/question-solid.svg" class="icon me-1"/> ${statusText}`;
                    }
    
                    const row = document.createElement('tr');    
                    row.innerHTML = `
                        <td class="text-center check-container"><input type="checkbox" class="cert-checkbox data-id="${cert.id}" ${status === 'D' ? 'disabled' : ''}></td>                        
                        <td data-sort="status">
                            <div class="button-container">
                                <button class="btn btn-ssm btn-${statusColor} rounded-pill main-btn" data-id="${cert.id}">${statusBtn}</button>
                                <div class="action-buttons" style="display: none;">
                                    <button class="btn btn-light btn-sm">
                                        <img src="images/rotate-right-solid.svg" class="icon" data-id="${cert.id}" onclick="openModal('renew', ${cert.id})"/>
                                    </button>
                                    <button class="btn btn-light btn-sm">
                                        <img src="images/ban-solid.svg" class="icon" data-id="${cert.id}" onclick="openModal('revoke', ${cert.id})"/>
                                    </button>
                                    <button class="btn btn-light btn-sm">
                                        <img src="images/rotate-right-solid.svg" class="icon" data-id="${cert.id}" onclick="openModal('remove', ${cert.id})"/>
                                    </button>
                                </div>
                            </div>
                        </td>
                        <td data-sort="id">${cert.id}</td>
                        <td data-sort="serial"><span class="tooltip-container" data-toggle="tooltip" data-html="true" data-placement="bottom" title="<div>${texts[lang].certificate.signature}: ${cert.hash}</div>">${cert.serial}</span></td>
                        <td data-sort="startDate"><span class="tooltip-container" data-toggle="tooltip" data-placement="bottom" title="${cert.startDate}">${formatDate(cert.startDate)}</span></td>
                        <td data-sort="endDate"><span class="tooltip-container" data-toggle="tooltip" data-placement="bottom" title="${cert.endDate}">${formatDate(cert.endDate)}</span></td>
                        <td>
                            <button type="button" class="btn btn-light btn-sm" data-bs-toggle="popover" data-bs-html="true" data-bs-content="
                                <a class='btn btn-light btn-sm d-block text-start mb-1' href='/src/certs/${replaceSpaces(cert.id)}.crt' download><img src='images/certificate-solid.svg' class='icon me-1'/>.crt</a>
                                <a class='btn btn-light btn-sm d-block text-start mb-1' href='/src/certs/${replaceSpaces(cert.id)}.csr' download><img src='images/lock-solid.svg' class='icon me-1'/>.csr</a>
                                <a class='btn btn-light btn-sm d-block text-start mb-1' href='/src/private/${replaceSpaces(cert.id)}.key' download><img src='images/key-solid.svg' class='icon me-1'/>.key</a>
                                <a class='btn btn-light btn-sm d-block text-start' href='/src/custom/${replaceSpaces(cert.id)}.pkcs12' download><img src='images/file-export-solid.svg' class='icon me-1'/>.pkcs12</a>
                            ">
                                <img src="images/file-arrow-down-solid.svg" class="icon"/>
                            </button>
                        </td>
                    `;
                    certTableBody.appendChild(row);

                    row.addEventListener('click', function(event) {
                        if (!event.target.classList.contains('check-container')) {
                            showModal('view', cert);
                        }
                    });
                });

                // Shift + click
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
                                if (cb === this || cb === lastChecked) {
                                    inBetween = !inBetween;
                                }

                                if (inBetween && !cb.disabled) {
                                    cb.checked = this.checked;
                                }
                            });
                        }
                        lastChecked = this;
                    });
                });

                // Select all checkboxes on header click
                selectBoxHeader.addEventListener('click', function() {
                    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked || checkbox.disabled);
                    
                    checkboxes.forEach(checkbox => {
                        if (!checkbox.disabled) {
                            checkbox.checked = !allChecked;
                        }
                    });
                });

                // Popovers
                var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
                var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
                    return new bootstrap.Popover(popoverTriggerEl);
                });

                popoverTriggerList.forEach((triggerEl) => {
                    triggerEl.addEventListener('click', function(event) {
                        popoverList.forEach(popover => {
                            if (popover._element !== this) {
                                popover.hide();
                            }
                        });
                        const popoverInstance = bootstrap.Popover.getInstance(this);
                        if (popoverInstance) {
                            popoverInstance.hide();
                        } else {
                            new bootstrap.Popover(this).show();
                        }
                        event.stopPropagation();
                    });
                });

                document.addEventListener('click', function() {
                    popoverList.forEach(popover => {
                        popover.hide();
                    });
                });

                initializeTooltips();
                loadPassword();
            })
            .catch(error => console.error('Certificate loading error:', error));
    }
    
    function showModal(action, certData) {
        const modalTitle = document.getElementById('dynamicModalLabel');
        const formContent = document.getElementById('formContent');
        const footerContent = document.getElementById('footerContent');
        const caPassphraseContainer = document.getElementById('caPassphraseContainer');
    
        formContent.innerHTML = '';
        caPassphraseContainer.style.display = 'none';
    
        switch (action) {
            case 'create':
                modalTitle.textContent = texts[lang].certificate.createMultiSan;
                formContent.innerHTML = `
                    <div class="mb-3">
                        <input type="text" class="form-control" id="commonName" placeholder="${texts[lang].certificate.CN}" required>
                    </div>
                    <div class="mb-3">
                        <input type="text" class="form-control" id="subject" placeholder="${texts[lang].certificate.SUBJ}" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">SAN (Subject Alternative Name)</label>
                        <div id="sanContainer">
                            <div class="input-group mb-2">
                                <input type="text" class="form-control" placeholder="IP" id="sanIp">
                                <button class="btn btn border" type="button" id="addIpButton">+</button>
                            </div>
                            <div id="addedSanIP" class="mt-2"></div>
                            <div class="input-group mb-2">
                                <input type="text" class="form-control" placeholder="DNS" id="sanDns">
                                <button class="btn btn border" type="button" id="addDnsButton">+</button>
                            </div>
                            <div id="addedDnsNames" class="mt-2"></div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="type" class="form-label">${texts[lang].certificate.type}</label>
                        <select class="form-select" id="type" name="type">
                            <option value="server">${texts[lang].certificate.select1}</option>
                            <option value="user">${texts[lang].certificate.select2}</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="startDate" class="form-label">${texts[lang].certificate.startDate}</label>
                        <input type="datetime-local" class="form-control" id="startDate" value="">
                    </div>
                    <div class="mb-3">
                        <label for="endDate" class="form-label">${texts[lang].certificate.endDate}</label>
                        <input type="datetime-local" class="form-control" id="endDate" value="">
                    </div>
                    <div class="mb-3">
                        <input type="password" class="form-control" id="passphrase" placeholder="${texts[lang].certificate.enterPass}">
                    </div>
                    <div class="mb-3">
                        <input type="password" class="form-control" id="confirmPassphrase" placeholder="${texts[lang].certificate.confirmPass}">
                    </div>
                `;
                footerContent.innerHTML = `
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${texts[lang].certificate.cancel}</button>
                    <button type="button" class="btn btn-primary" id="confirmAction">${texts[lang].certificate.confirm}</button>
                `;
    
                const now = new Date();
                const offset = now.getTimezoneOffset() * 60000;
                document.getElementById("startDate").value = new Date(now.getTime() - offset).toISOString().slice(0, 16);
                document.getElementById("endDate").value = new Date(now.setFullYear(now.getFullYear() + 1, now.getMonth(), now.getDate() + 1) - offset).toISOString().slice(0, 16);

                document.getElementById('addIpButton').onclick = function() {
                    const ipValue = document.getElementById('sanIp').value;
                    if (ipValue) {
                        const ipList = document.getElementById('addedSanIP');
                        ipList.innerHTML += `<div class="alert alert-secondary p-2 d-flex justify-content-between align-items-center">
                            ${ipValue}
                            <button class="btn btn-sm btn-close" onclick="this.parentElement.remove();"></button>
                        </div>`;
                        document.getElementById('sanIp').value = '';
                    }
                };
    
                document.getElementById('addDnsButton').onclick = function() {
                    const dnsValue = document.getElementById('sanDns').value;
                    if (dnsValue) {
                        const dnsList = document.getElementById('addedDnsNames');
                        dnsList.innerHTML += `<div class="alert alert-secondary p-2 d-flex justify-content-between align-items-center">
                            ${dnsValue}
                            <button class="btn btn-sm btn-close" onclick="this.parentElement.remove();"></button>
                        </div>`;
                        document.getElementById('sanDns').value = '';
                    }
                };
    
                document.getElementById('confirmAction').onclick = async function() {
                    const commonName = document.getElementById('commonName').value;
                    const subject = document.getElementById('subject').value;
                    const sanIP = Array.from(document.getElementById('addedSanIP').children).map(el => el.innerText);
                    const sanDns = Array.from(document.getElementById('addedDnsNames').children).map(el => el.innerText);
                    const type = document.getElementById('type').value;
                    const startDate = document.getElementById('startDate').value;
                    const endDate = document.getElementById('endDate').value;
                    const passphrase = document.getElementById('passphrase').value;
    
                    const data = {
                        name: commonName,
                        subject: subject,
                        sanIP: sanIP,
                        sanDns: sanDns,
                        type: type,
                        startDate: startDate,
                        endDate: endDate,
                        passphrase: passphrase
                    };
    
                    try {
                        const response = await fetch('/create', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        });
    
                        const result = await response.json();
                        if (response.ok) {
                            alert(result.response);
                            modal.hide();
                        } else {
                            alert(`Error: ${result.error}`);
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                };
                break;
            case 'view':
                modalTitle.textContent = 'View Certificate';
                formContent.innerHTML = `
                    <div id="certDetails">
                        <p><strong>${texts[lang].certificate.CN}:</strong> ${certData.id ? certData.id : `${texts[lang].certificate.undefined}`}</p>
                        <p><strong>${texts[lang].certificate.SUBJ}:</strong> ${certData.subject ? certData.subject : `${texts[lang].certificate.undefined}`}</p>

                        <p><strong>${texts[lang].certificate.serial}:</strong> ${certData.serial}</p>
                        <p><strong>${texts[lang].certificate.signature}:</strong> ${certData.hash}</p>


                        <p><strong>IP:</strong> ${certData.ip && certData.ip.length > 0 
                            ? certData.ip.map(ip => `<span>${ip}</span>`).join(', ') 
                            : `${texts[lang].certificate.IP}`}
                        </p>

                        <p><strong>DNS:</strong> ${certData.dns && certData.dns.length > 0 
                            ? certData.dns.map(dns => `<span>${dns}</span>`).join(', ') 
                            : `${texts[lang].certificate.DNS}`}
                        </p>

                        <p><strong>${texts[lang].certificate.type}:</strong> ${certData.type ? certData.type : `${texts[lang].certificate.undefined}`}</p>
                        <p><strong>${texts[lang].certificate.startDate}:</strong> ${certData.startDate ? certData.startDate : `${texts[lang].certificate.undefined}`}</p>
                        <p><strong>${texts[lang].certificate.endDate}:</strong> ${certData.endDate ? certData.endDate : `${texts[lang].certificate.undefined}`}</p>

                        <p><strong>${texts[lang].certificate.downloads}:</strong>
                            <a class="btn btn-light btn-sm" href="/src/certs/${replaceSpaces(certData.id)}.crt" download><img src="images/file-arrow-down-solid.svg" class="icon me-1"/>.crt</a>
                            <a class="btn btn-light btn-sm" href="/src/certs/${replaceSpaces(certData.id)}.csr" download><img src="images/file-arrow-down-solid.svg" class="icon me-1"/>.csr</a>
                            <a class="btn btn-light btn-sm" href="/src/private/${replaceSpaces(certData.id)}.key" download><img src="images/file-arrow-down-solid.svg" class="icon me-1"/>.key</a>
                            <a class="btn btn-light btn-sm" href="/src/custom/${replaceSpaces(certData.id)}.pkcs12" download><img src="images/file-arrow-down-solid.svg" class="icon me-1"/>.pkcs12</a>
                        </p>
                    </div>
                `;
                footerContent.style.display = 'none';
                break;
            case 'revoke':
                modalTitle.textContent = `${texts[lang].certificate.revoke}`;
                caPassphraseContainer.style.display = 'block';
                formContent.innerHTML = `
                    <p>Êtes-vous sûr de vouloir révoquer ce certificat ?</p>
                `;
                footerContent.innerHTML = `
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="confirmAction" data-bs-dismiss="modal">Confirm</button>
                `;
                break;
            case 'renew':
                modalTitle.textContent = 'Renew Certificate';
                formContent.innerHTML = `
                    <div class="mb-3">
                        <input type="text" class="form-control" id="commonNameRenew" value="${certData.id}" placeholder="${texts[lang].certificate.CN}" readonly>
                    </div>
                `;
                footerContent.innerHTML = `
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${texts[lang].certificate.cancel}</button>
                    <button type="button" class="btn btn-primary" id="confirmAction" data-bs-dismiss="modal">${texts[lang].certificate.confirm}</button>
                `;
                break;
            case 'remove':
                modalTitle.textContent = 'Remove Certificate';
                caPassphraseContainer.style.display = 'block';
                formContent.innerHTML = `
                    <p>Êtes-vous sûr de vouloir supprimer ce certificat ?</p>
                `;
                footerContent.innerHTML = `
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${texts[lang].certificate.cancel}</button>
                    <button type="button" class="btn btn-primary" id="confirmAction" data-bs-dismiss="modal">${texts[lang].certificate.confirm}</button>
                `;
                break;
        }
    
        // Afficher le modal
        const modal = new bootstrap.Modal(document.getElementById('dynamicModal'));
        modal.show();
    }
   
    // Initialize tool tips
    function initializeTooltips() {
        $('[data-toggle="tooltip"]').tooltip({
            html: true
        });
    }

    // Get password from server
    function loadPassword() {
        fetch('/get-password')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Request failed');
                }
                return response.json();
            })
            .then(data => {
                passwordInput.value = data.pkiaccess || '';
                updateInterface();
            })
            .catch(error => console.error('Error fetching password:', error));
    }

    // // Dropdown menu to generate a specific number of certificates
    // createItems.forEach(item => {
    //     item.addEventListener('click', function() {
    //         const certCount = this.getAttribute('data-count');
    //         const certName = "Testing Zenetys Certificate Authority with a long name";
    //         certCountInput.value = certCount;

    //         createDropdown.setAttribute('disabled', 'true');

    //         setInterval(() => loadCertData(), 2000)

    //         // Request create a certificate
    //         fetch(`/create?name=${encodeURIComponent(certName)}&count=${certCount}`)
    //             .then(response => response.text())
    //             .catch(error => {
    //                 console.error('Error:', error);
    //             })
    //             .finally(() => {
    //                 setTimeout(() => {
    //                     createDropdown.removeAttribute('disabled');
    //                 }, 2000);
    //             });
    //     });
    // });

    createBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showModal('create');
    });

    // Filter certificates by name
    certSearchInput.addEventListener('input', function() {
        const searchText = encodeName(this.value).toLowerCase();
        const rows = certTableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            let match = false;
            cells.forEach(cell => {
                if (encodeName(cell.textContent).toLowerCase().includes(searchText)) {
                    match = true;
                }
            });
            row.style.display = match ? '' : 'none';
        });
    });

    // // Renew multiple certificates
    // renewSelectedButton.addEventListener('click', function(event) {
    //     event.preventDefault();
    //     const selectedCerts = Array.from(document.querySelectorAll('.cert-checkbox.active')).map(button => button.getAttribute('data-id'));
    //     if (selectedCerts.length > 0) {
    //         fetch('/renew', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ id: selectedCerts })
    //         })
    //         .then(response => response.text())
    //         .then(() => loadCertData())
    //         .catch(error => console.error('Renewal error:', error));
    //     }
    // });

    // // Revoke multiple certificates
    // revokeSelectedButton.addEventListener('click', function(event) {
    //     event.preventDefault();
    //     const selectedCerts = Array.from(document.querySelectorAll('.cert-checkbox.active')).map(button => button.getAttribute('data-id'));
    //     if (selectedCerts.length > 0) {
    //         fetch('/revoke', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ id: selectedCerts })
    //         })
    //         .then(response => response.text())
    //         .then(() => loadCertData())
    //         .catch(error => console.error('Revocation error:', error));
    //     }
    // });
    
    // Open modal & send password
    lockInterface.addEventListener('click', (e) => {
        e.preventDefault();
        passwordModal.show();
    });
    
    document.getElementById('passwordForm').addEventListener('submit', function (e) {
        e.preventDefault();
    
        const password = passwordInput.value;
    
        fetch('/set-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: password })
        })
        .then(response => {
            if (response.ok) {
                passwordModal.hide();
                isLocked = !isLocked;
                localStorage.setItem('isLocked', JSON.stringify(isLocked));    
                updateInterface();
            } else {
                console.error('Error saving password:', response.statusText);
            }
        })
        .catch(err => console.error('Fetch error:', err));
    });

    document.getElementById('togglePassword').addEventListener('click', function (event) {
        event.preventDefault();
        const toggleIcon = document.getElementById('togglePasswordIcon');
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        toggleIcon.src = toggleIcon.src.includes('images/eye-solid.svg') ? 'images/eye-slash-solid.svg' : 'images/eye-solid.svg';
    });
    
    // Sorting columns
    document.querySelectorAll('thead th').forEach(header => {
        header.addEventListener('click', function() {
            const sortKey = this.getAttribute('data-sort');
            const currentOrder = this.classList.contains('asc') ? 'desc' : 'asc';
            this.classList.remove('asc', 'desc');
            this.classList.add(currentOrder);
            sortTable(sortKey, currentOrder);
        });
    });

    // Renew one certificate
    window.renewCert = function(id) {
        fetch('/renew', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: [id] })
        })
        .then(response => response.text())
        .then(() => loadCertData())
        .catch(error => console.error('Renewal error:', error));
    };

    // Revoke one certificate
    window.revokeCert = function(id) {
        fetch('/revoke', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: [id] })
        })
        .then(response => response.text())
        .then(() => loadCertData())
        .catch(error => console.error('Revocation error:', error));
    };

    loadCertData();
    loadPassword();
});
