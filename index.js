document.addEventListener('DOMContentLoaded', function() {
    const passwordModal = new bootstrap.Modal(document.getElementById('passwordModal'));
    const createItems = document.querySelectorAll('.create');
    const createDropdown = document.getElementById('createDropdown');
    const certCountInput = document.getElementById('certCount');
    const certNameInput = document.getElementById('certName');
    const certSearchInput = document.getElementById('certSearch');
    const certTableBody = document.getElementById('certTableBody');
    const revokeSelectedButton = document.getElementById('revokeSelected');
    const renewSelectedButton = document.getElementById('renewSelected');
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
            downloads: "Downloads"
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
            downloads: "Téléchargements"
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
            downloads: "Descargas"
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
            downloads: "Downloads"
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
        $('#revokeSelected').html(`<img src="images/ban-solid.svg" class="icon me-1"/> ${texts[lang].revoke}`);
        $('#renewSelected').html(`<img src="images/rotate-right-solid.svg" class="icon me-1"/> ${texts[lang].renew}`);
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

    // Format date to YYYY/MM/DD from ISO format
    function formatDate(isoDateString) {
        const date = new Date(isoDateString);
        return date.toLocaleDateString('fr-CA');
    }
    
    // Update actions buttons
    function updateActionButtons() {
        const selectedCerts = document.querySelectorAll('.cert-checkbox.active');
        if (selectedCerts.length > 0) {
            revokeSelectedButton.hidden = false;
            renewSelectedButton.hidden = false;
        } else {
            revokeSelectedButton.hidden = true;
            renewSelectedButton.hidden = true;
        }
    }

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

    // Load data from files, create and update table & check checkboxes
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
                            <a class="btn btn-light btn-sm" href="/src/certs/${cert.id}.crt" download><img src="images/file-arrow-down-solid.svg" class="icon me-1"/>.crt</a>
                            <a class="btn btn-light btn-sm" href="/src/certs/${cert.id}.csr" download><img src="images/file-arrow-down-solid.svg" class="icon me-1"/>.csr</a>
                            <a class="btn btn-light btn-sm" href="/src/private/${cert.id}.key" download><img src="images/file-arrow-down-solid.svg" class="icon me-1"/>.key</a>
                        </td>
                    `;
                    certTableBody.appendChild(row);
                });

                // Shift + click
                let lastChecked = null;
                const checkboxes = document.querySelectorAll('.cert-checkbox');

                checkboxes.forEach(checkbox => {
                    checkbox.addEventListener('click', function(e) {
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

                // Add event listeners for cert checkboxes
                checkboxes.forEach(checkbox => {
                    checkbox.addEventListener('click', function() {
                        updateActionButtons();
                    });
                });
                updateActionButtons();
                initializeTooltips();
                loadPassword();
            })
            .catch(error => console.error('Certificate loading error:', error));
    }

    function updateDates() {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        document.getElementById("startDate").value = new Date(now.getTime() - offset).toISOString().slice(0, 16);
        document.getElementById("endDate").value = new Date(now.setFullYear(now.getFullYear() + 1, now.getMonth(), now.getDate() + 1) - offset).toISOString().slice(0, 16);
    }
    
    function showModal(action, certData) {
        const modalTitle = document.getElementById('dynamicModalLabel');
        const formContent = document.getElementById('formContent');
        const caPassphraseContainer = document.getElementById('caPassphraseContainer');
    
        // Vider le contenu précédent
        formContent.innerHTML = '';
        caPassphraseContainer.style.display = 'none';
    
        switch (action) {
            case 'create':
                modalTitle.textContent = 'Create Multi SAN Certificate';
                formContent.innerHTML = `
                    <div class="mb-3">
                        <input type="text" class="form-control" id="commonName" placeholder="Common Name" required>
                    </div>
                    <div class="mb-3">
                        <input type="text" class="form-control" id="subject" placeholder="Subject Subject (OU / O / L)" required>
                    </div>
                    <div class="mb-3">
                        <input type="text" class="form-control" id="san" placeholder="SAN (Subject Alternative Name)">
                    </div>
                    <div class="mb-3">
                        <input type="text" class="form-control" id="ip" placeholder="IP">
                    </div>
                    <div class="mb-3">
                        <input type="text" class="form-control" id="dns" placeholder="DNS">
                    </div>
                    <div class="mb-3">
                        <label for="type" class="form-label">Certificate Type</label>
                        <select class="form-select" id="type" name="type">
                            <option value="server">Server</option>
                            <option value="user">User</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="startDate" class="form-label">Start / End Date</label>
                        <input type="datetime-local" class="form-control" id="startDate" value="">
                    </div>
                    <div class="mb-3">
                        <input type="datetime-local" class="form-control" id="endDate" value="">
                    </div>
                    <div class="mb-3">
                        <input type="password" class="form-control" id="passphrase" placeholder="Enter your passphrase (can be empty)">
                    </div>
                    <div class="mb-3">
                        <input type="password" class="form-control" id="confirmPassphrase" placeholder="Confirm your passphrase">
                    </div>
                `;
                break;
            case 'view':
                modalTitle.textContent = 'View Certificate';
                formContent.innerHTML = `
                    <div id="certDetails">
                        <!-- Les détails du certificat, par exemple : -->
                        <p><strong>Common Name:</strong> ${certData.id}</p>
                        <p><strong>Subject:</strong> ${certData.subject}</p>
                        <p><strong>SAN:</strong> ${certData.san}</p>
                        <p><strong>IP:</strong> ${certData.ip}</p>
                        <p><strong>DNS:</strong> ${certData.dns}</p>
                        <p><strong>Type:</strong> ${certData.type}</p>
                        <p><strong>Start Date:</strong> ${certData.startDate}</p>
                        <p><strong>End Date:</strong> ${certData.endDate}</p>
                    </div>
                `;
                break;
            case 'revoke':
                modalTitle.textContent = 'Revoke Certificate';
                caPassphraseContainer.style.display = 'block';
                formContent.innerHTML = `
                    <p>Êtes-vous sûr de vouloir révoquer ce certificat ?</p>
                `;
                break;
            case 'renew':
                modalTitle.textContent = 'Renew Certificate';
                formContent.innerHTML = `
                    <div class="mb-3">
                        <label for="commonNameRenew" class="form-label">Common Name</label>
                        <input type="text" class="form-control" id="commonNameRenew" value="${certData.id}" placeholder="Common Name" readonly>
                    </div>
                    <!-- Ajouter d'autres champs préremplis -->
                `;
                break;
            case 'remove':
                modalTitle.textContent = 'Remove Certificate';
                caPassphraseContainer.style.display = 'block';
                formContent.innerHTML = `
                    <p>Êtes-vous sûr de vouloir supprimer ce certificat ?</p>
                `;
                break;
        }
    
        // Afficher le modal
        const modal = new bootstrap.Modal(document.getElementById('dynamicModal'));
        modal.show();
    }
    showModal('create');

    // Initialize tool tips
    function initializeTooltips() {
        $('[data-toggle="tooltip"]').tooltip({
            html: true
        });
    }

    // Fonction pour récupérer le mot de passe depuis le serveur
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

    // Dropdown menu to generate a specific number of certificates
    createItems.forEach(item => {
        item.addEventListener('click', function() {
            const certCount = this.getAttribute('data-count');
            const certName = "Testing Zenetys Certificate Authority with a long name";
            certCountInput.value = certCount;

            createDropdown.setAttribute('disabled', 'true');

            setInterval(() => loadCertData(), 2000)

            // Request create a certificate
            fetch(`/create?name=${encodeURIComponent(certName)}&count=${certCount}`)
                .then(response => response.text())
                .catch(error => {
                    console.error('Error:', error);
                })
                .finally(() => {
                    setTimeout(() => {
                        createDropdown.removeAttribute('disabled');
                    }, 2000);
                });
        });
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

    // Renew multiple certificates
    renewSelectedButton.addEventListener('click', function(event) {
        event.preventDefault();
        const selectedCerts = Array.from(document.querySelectorAll('.cert-checkbox.active')).map(button => button.getAttribute('data-id'));
        if (selectedCerts.length > 0) {
            fetch('/renew', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: selectedCerts })
            })
            .then(response => response.text())
            .then(() => loadCertData())
            .catch(error => console.error('Renewal error:', error));
        }
    });

    // Revoke multiple certificates
    revokeSelectedButton.addEventListener('click', function(event) {
        event.preventDefault();
        const selectedCerts = Array.from(document.querySelectorAll('.cert-checkbox.active')).map(button => button.getAttribute('data-id'));
        if (selectedCerts.length > 0) {
            fetch('/revoke', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: selectedCerts })
            })
            .then(response => response.text())
            .then(() => loadCertData())
            .catch(error => console.error('Revocation error:', error));
        }
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

    // Ajoutez des événements de survol pour afficher/masquer les boutons
    document.querySelectorAll('.button-container').forEach(container => {
        const mainBtn = container.querySelector('.main-btn');
        const additionalBtns = container.querySelector('.additional-buttons');

        mainBtn.addEventListener('mouseenter', () => {
            mainBtn.style.display = 'none';
            additionalBtns.style.display = 'block';
        });

        mainBtn.addEventListener('mouseleave', () => {
            mainBtn.style.display = 'block'; 
            additionalBtns.style.display = 'none';
        });
    });

    // Open modal & send password
    openModalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        passwordModal.show();
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
    updateDates();
    setInterval(updateDates, 10000);
});
