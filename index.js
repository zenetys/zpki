document.addEventListener('DOMContentLoaded', function() {
    const passwordModal = new bootstrap.Modal(document.getElementById('passwordModal'));
    const createBtn = document.getElementById('createBtn');
    const certSearchInput = document.getElementById('certSearch');
    const certTableBody = document.getElementById('certTableBody');
    const openModalBtn = document.getElementById('openModalBtn');
    const passwordInput = document.getElementById('password');
    const texts = {
        en: {
            searchPlaceholder: "Search for a certificate",
            revoke: "Revoke",
            renew: "Renew",
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
                type: "Certificate Type",
                select1: "Server",
                select1: "User",
                startDate: "Start Date",
                endDate: "End Date",
                enterPass: "Enter your passphrase (can be empty)",
                confirmPass: "Confirm your passphrase",
                cancel: "Cancel",
                confirm: "Confirm",
                undefined: "Undefined",
            },
            lock: "Lock",
            unlock: "Unlock",
            done: "Done!",
            statusBtn: {
                valid: "Valid",
                expired: "Expired",
                revoked: "Revoked",
                unknown: "Unknown"
            },
            status: "Status",
            serial: "Serial",
            common_name: "Common Name (CN)",
            startDate: "Start Date",
            endDate: "End Date",            
            downloads: "Downloads",
            download: "Download"
        },
        fr: {
            searchPlaceholder: "Rechercher un certificat",
            revoke: "Révoquer",
            renew: "Renouveler",
            lang: {
                english: "Anglais",
                french: "Français",
                spanish: "Espagnol",
                german: "Allemand"
            },
            certificate: {
                createMultiSan: "Créer un certificat multi-SAN",
                CN: "Common Name",
                SUBJ: "Subject (OU / O / L)",
                type: "Type de certificat",
                select1: "Serveur",
                select2: "Utilisateur",
                startDate: "Date de début",
                endDate: "Date de fin",
                enterPass: "Entrez votre passphrase (peut être vide)",
                confirmPass: "Confirmez votre phrase secrète",
                cancel: "Annuler",
                confirm: "Confirmer",
                undefined: "Non défini",
            },
            lock: "Verrouiller",
            unlock: "Déverrouiller",
            done: "Terminé !",
            statusBtn: {
                valid: "Valide",
                expired: "Expiré",
                revoked: "Révoqué",
                unknown: "Inconnu"
            },
            status: "Statut",
            serial: "Numéro de série",
            common_name: "Actions",
            startDate: "Date de début",
            endDate: "Date de fin",            
            downloads: "Téléchargements",
            download: "Télécharger"
        },
        es: {
            searchPlaceholder: "Buscar un certificado",
            revoke: "Revocar",
            renew: "Renovar",
            lang: {
                english: "Inglés",
                french: "Francés",
                spanish: "Español",
                german: "Alemán"
            },
            certificate: {
                createMultiSan: "Crear certificado Multi SAN",
                CN: "Nombre común",
                SUBJ: "Asunto (OU / O / L)",
                type: "Tipo de certificado",
                select1: "Servidor",
                select2: "Usuario",
                startDate: "Fecha de inicio",
                endDate: "Fecha de finalización",
                enterPass: "Ingrese su frase de contraseña (puede estar vacía)",
                confirmPass: "Confirme su frase de contraseña",
                cancel: "Cancelar",
                confirm: "Confirmar",
                undefined: "No definido",
            },
            lock: "Bloquear",
            unlock: "Desbloquear",
            done: "¡Hecho!",
            statusBtn: {
                valid: "Válido",
                expired: "Expirado",
                revoked: "Revocado",
                unknown: "Desconocido"
            },
            status: "Estado",
            serial: "Número de serie",
            common_name: "Nombre común (CN)",
            startDate: "Fecha de inicio",
            endDate: "Fecha de finalización",
            downloads: "Descargas",
            download: "Descargar"
        },
        de: {
            searchPlaceholder: "Nach einem Zertifikat suchen",
            revoke: "Widerrufen",
            renew: "Erneuern",
            lang: {
                english: "Englisch",
                french: "Französisch",
                spanish: "Spanisch",
                german: "Deutsch"
            },
            certificate: {
                createMultiSan: "Multi-SAN-Zertifikat erstellen",
                CN: "Allgemeiner Name",
                SUBJ: "Betreff (OU / O / L)",
                type: "Zertifikatstyp",
                select1: "Server",
                select2: "Benutzer",
                startDate: "Anfangsdatum",
                endDate: "Enddatum",
                enterPass: "Geben Sie Ihre Passphrase ein (kann leer sein)",
                confirmPass: "Bestätigen Sie Ihre Passphrase",
                cancel: "Abbrechen",
                confirm: "Bestätigen",
                undefined: "Nicht definiert",
            },
            lock: "Sperren",
            unlock: "Entsperren",
            done: "Fertig!",
            statusBtn: {
                valid: "Gültig",
                expired: "Abgelaufen",
                revoked: "Widerrufen",
                unknown: "Unbekannt"
            },
            status: "Status",
            serial: "Seriennummer",
            common_name: "Allgemeiner Name (CN)",
            startDate: "Startdatum",
            endDate: "Enddatum",
            downloads: "Downloads",
            download: "Download"
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
        $('#openModalBtn').html(`<img src="images/lock-solid.svg" class="icon me-1"/> ${texts[lang].unlock}`);
        $('#english').html(`${texts[lang].lang.english} <span class="checkmark"><img src="images/check-solid.svg" class="icon ms-3"/></span>`);
        $('#french').html(`${texts[lang].lang.french} <span class="checkmark"><img src="images/check-solid.svg" class="icon ms-3"/></span>`);
        $('#spanish').html(`${texts[lang].lang.spanish} <span class="checkmark"><img src="images/check-solid.svg" class="icon ms-3"/></span>`);
        $('#german').html(`${texts[lang].lang.german} <span class="checkmark"><img src="images/check-solid.svg" class="icon ms-3"/></span>`);
        
        // Update table headers
        $('th[data-sort="status"]').html(`<img src="images/chart-simple-solid.svg" class="icon me-1"/> ${texts[lang].status}`);
        $('th[data-sort="serial"]').html(`<img src="images/hashtag-solid.svg" class="icon me-1"/> ${texts[lang].serial}`);
        $('th[data-sort="startDate"]').html(`<img src="images/calendar-day-solid.svg" class="icon me-1"/> ${texts[lang].startDate}`);
        $('th[data-sort="endDate"]').html(`<img src="images/calendar-days-solid.svg" class="icon me-1"/> ${texts[lang].endDate}`);
        $('th[data-sort="actions"]').html(`<img src="images/gear-solid.svg" class="icon me-1"/> ${texts[lang].actions}`);
        $('th[data-sort="downloads"]').html(`<img src="images/download-solid.svg" class="icon me-1"/> ${texts[lang].downloads}`);
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
                    'btn-danger': 2,
                    'btn-warning': 3,
                    'btn-secondary': 4
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
                        statusText = texts[lang].statusBtn.valid;
                        statusBtn = `<img src="images/circle-check-solid.svg" class="icon me-1"/> ${statusText}`;
                    } else if (status === 'E') {
                        statusColor = 'warning';
                        statusText = texts[lang].statusBtn.expired;
                        statusBtn = `<img src="images/triangle-exclamation-solid.svg" class="icon me-1"/> ${statusText}`;
                    } else if (status === 'R') {
                        statusColor = 'danger';
                        statusText = texts[lang].statusBtn.revoked;
                        statusBtn = `<img src="images/circle-xmark-solid.svg" class="icon me-1"/> ${statusText}`;
                    } else {
                        statusColor = 'secondary';
                        statusText = texts[lang].statusBtn.unknown;
                        statusBtn = `<img src="images/question-solid.svg" class="icon me-1"/> ${statusText}`;
                    }
    
                    const row = document.createElement('tr');
                    row.addEventListener('click', function() {
                        showModal('view', cert);
                    });
    
                    row.innerHTML = `
                        <td><input type="checkbox" class="cert-checkbox" data-id="${cert.id}" ${status === 'R' ? 'disabled' : ''}></td>                        
                        <td data-sort="status">
                            <div class="button-container">
                                <button class="btn btn-ssm btn-${statusColor} rounded-pill main-btn" data-id="${cert.id}">${statusBtn}</button>
                                <div class="additional-buttons" style="display: none;">
                                    <img src="images/ban-solid.svg" class="icon" data-id="${cert.id}" onclick="openModal('renew', ${cert.id})"/>
                                    <img src="images/ban-solid.svg" class="icon" data-id="${cert.id}" onclick="openModal('revoke', ${cert.id})"/>
                                    <img src="images/ban-solid.svg" class="icon" data-id="${cert.id}" onclick="openModal('remove', ${cert.id})"/>
                                </div>
                            </div>
                        </td>
                        <td data-sort="serial"><span class="tooltip-container" data-toggle="tooltip" data-html="true" data-placement="bottom" title="<div>Signature: ${cert.hash}</div>">${cert.serial}</span></td>
                        <td data-sort="id">${cert.id}</td>
                        <td data-sort="startDate"><span class="tooltip-container" data-toggle="tooltip" data-placement="bottom" title="${cert.startDate}">${formatDate(cert.startDate)}</span></td>
                        <td data-sort="endDate"><span class="tooltip-container" data-toggle="tooltip" data-placement="bottom" title="${cert.endDate}">${formatDate(cert.endDate)}</span></td>
                        <td data-sort="downloads">
                            <button type="button" class="btn btn-light btn-sm" data-bs-toggle="popover" data-bs-html="true" data-bs-content="
                                <a class='btn btn-light btn-sm d-block mb-1' href='/src/certs/${replaceSpaces(cert.id)}.crt' download><img src='images/file-arrow-down-solid.svg' class='icon me-1'/>.crt</a>
                                <a class='btn btn-light btn-sm d-block mb-1' href='/src/certs/${replaceSpaces(cert.id)}.csr' download><img src='images/file-arrow-down-solid.svg' class='icon me-1'/>.csr</a>
                                <a class='btn btn-light btn-sm d-block' href='/src/private/${replaceSpaces(cert.id)}.key' download><img src='images/file-arrow-down-solid.svg' class='icon me-1'/>.key</a>
                            ">
                                <img src="images/file-arrow-down-solid.svg" class="icon me-1"/> ${texts[lang].download}
                            </button>
                        </td>
                    `;
                    certTableBody.appendChild(row);
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
                        updateActionButtons();
                    });
                });
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

                document.addEventListener('click', function(event) {
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
                            <div class="input-group mb-2">
                                <input type="text" class="form-control" placeholder="DNS" id="sanDns">
                                <button class="btn btn border" type="button" id="addDnsButton">+</button>
                            </div>
                        </div>
                        <div id="addedSanIPs" class="mt-2"></div>
                        <div id="addedDnsNames" class="mt-2"></div>
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
    
                document.getElementById('addIpButton').onclick = function() {
                    const ipValue = document.getElementById('sanIp').value;
                    if (ipValue) {
                        const ipList = document.getElementById('addedSanIPs');
                        ipList.innerHTML += `<div class="alert alert-info d-flex justify-content-between align-items-center">
                            ${ipValue}
                            <button class="btn btn-close" onclick="this.parentElement.remove();"></button>
                        </div>`;
                        document.getElementById('sanIp').value = '';
                    }
                };
    
                document.getElementById('addDnsButton').onclick = function() {
                    const dnsValue = document.getElementById('sanDns').value;
                    if (dnsValue) {
                        const dnsList = document.getElementById('addedDnsNames');
                        dnsList.innerHTML += `<div class="alert alert-info d-flex justify-content-between align-items-center">
                            ${dnsValue}
                            <button class="btn btn-close" onclick="this.parentElement.remove();"></button>
                        </div>`;
                        document.getElementById('sanDns').value = '';
                    }
                };
    
                document.getElementById('confirmAction').onclick = async function() {
                    const commonName = document.getElementById('commonName').value;
                    const subject = document.getElementById('subject').value;
                    const sanIPs = Array.from(document.getElementById('addedSanIPs').children).map(el => el.innerText);
                    const sanDns = Array.from(document.getElementById('addedDnsNames').children).map(el => el.innerText);
                    const type = document.getElementById('type').value;
                    const startDate = document.getElementById('startDate').value;
                    const endDate = document.getElementById('endDate').value;
                    const passphrase = document.getElementById('passphrase').value;
    
                    const data = {
                        name: commonName,
                        subject: subject,
                        sanIPs: sanIPs,
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

                        <p><strong>IP(s):</strong> ${certData.ip && certData.ip.length > 0 
                            ? certData.ip.map(ip => `<span>${ip}</span>`).join(', ') 
                            : "Aucune IP définie"}
                        </p>

                        <p><strong>DNS:</strong> ${certData.dns && certData.dns.length > 0 
                            ? certData.dns.map(dns => `<span>${dns}</span>`).join(', ') 
                            : "Aucun DNS défini"}
                        </p>

                        <p><strong>${texts[lang].certificate.type}:</strong> ${certData.type ? certData.type : `${texts[lang].certificate.undefined}`}</p>
                        <p><strong>${texts[lang].certificate.startDate}:</strong> ${certData.startDate ? certData.startDate : `${texts[lang].certificate.undefined}`}</p>
                        <p><strong>${texts[lang].certificate.endDate}:</strong> ${certData.endDate ? certData.endDate : `${texts[lang].certificate.undefined}`}</p>
                    </div>
                `;
                footerContent.innerHTML = `
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                `;
                break;
            case 'revoke':
                modalTitle.textContent = 'Revoke Certificate';
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
                        <label for="commonNameRenew" class="form-label">Common Name</label>
                        <input type="text" class="form-control" id="commonNameRenew" value="${certData.id}" placeholder="Common Name" readonly>
                    </div>
                `;
                footerContent.innerHTML = `
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="confirmAction" data-bs-dismiss="modal">Confirm</button>
                `;
                break;
            case 'remove':
                modalTitle.textContent = 'Remove Certificate';
                caPassphraseContainer.style.display = 'block';
                formContent.innerHTML = `
                    <p>Êtes-vous sûr de vouloir supprimer ce certificat ?</p>
                `;
                footerContent.innerHTML = `
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="confirmAction" data-bs-dismiss="modal">Confirm</button>
                `;
                break;
        }
    
        // Afficher le modal
        const modal = new bootstrap.Modal(document.getElementById('dynamicModal'));
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;

        modal.show();

        document.getElementById("startDate").value = new Date(now.getTime() - offset).toISOString().slice(0, 16);
        document.getElementById("endDate").value = new Date(now.setFullYear(now.getFullYear() + 1, now.getMonth(), now.getDate() + 1) - offset).toISOString().slice(0, 16);
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
                if (passwordInput.value !== '') {
                    openModalBtn.innerHTML = `<img src="images/unlock-solid.svg" class="icon me-1"/> ${texts[lang].lock}`;
                }
            })
            .catch(error =>  console.error('Error fetching password:', error));
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

    createBtn.addEventListener('click', function() {
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
    openModalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        passwordModal.show();
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

    document.getElementById('togglePassword').addEventListener('click', function () {
        const toggleIcon = document.getElementById('togglePasswordIcon');
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        toggleIcon.src = toggleIcon.src.includes('images/eye-solid.svg') ? 'images/eye-slash-solid.svg' : 'images/eye-solid.svg';
    });

    document.getElementById('passwordForm').addEventListener('submit', function(e) {
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
                console.log('Password saved successfully!');
                passwordModal.hide();
                openModalBtn.innerHTML = `<img src="images/unlock-solid.svg" class="icon me-1"/> ${texts[lang].lock}`;
            } else {
                console.error('Error saving password:', response.statusText);
            }
        })
        .catch(err => console.error('Fetch error:', err));
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
