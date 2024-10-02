document.addEventListener('DOMContentLoaded', function() {
    const createItems = document.querySelectorAll('.create');
    const createDropdown = document.getElementById('createDropdown');
    const certCountInput = document.getElementById('certCount');
    const certNameInput = document.getElementById('certName');
    const certSearchInput = document.getElementById('certSearch');
    const certTableBody = document.getElementById('certTableBody');
    const refreshButton = document.getElementById('refresh');
    const revokeSelectedButton = document.getElementById('revokeSelected');
    const renewSelectedButton = document.getElementById('renewSelected');
    const texts = {
        en: {
            certificateNamePlaceholder: "Certificate name (ex: John Doe)",
            searchPlaceholder: "Search for a certificate",
            revoke: "Revoke",
            renew: "Renew",
            lang: {
                english: "English",
                french: "French",
                spanish: "Spanish",
                german: "German"
            },
            oneCertificate: "1 Certificate",
            tenCertificates: "10 Certificates",
            hundredCertificates: "100 Certificates",
            thousandCertificates: "1000 Certificates",
            refresh: "Refresh",
            done: "Done!",
            statusBtn: {
                valid: "Valid",
                expired: "Expired",
                revoked: "Revoked",
                unknown: "Unknown"
            },
            status: "Status",
            serial: "Serial",
            startDate: "Start Date",
            endDate: "End Date",            
            common_name: "Common Name (CN)",
            downloads: "Downloads"
        },
        fr: {
            certificateNamePlaceholder: "Nom du certificat (ex: John Doe)",
            searchPlaceholder: "Rechercher un certificat",
            revoke: "Révoquer",
            renew: "Renouveler",
            lang: {
                english: "Anglais",
                french: "Français",
                spanish: "Espagnol",
                german: "Allemand"
            },
            oneCertificate: "1 Certificat",
            tenCertificates: "10 Certificats",
            hundredCertificates: "100 Certificats",
            thousandCertificates: "1000 Certificats",
            refresh: "Rafraîchir",
            done: "Terminé !",
            statusBtn: {
                valid: "Valide",
                expired: "Expiré",
                revoked: "Révoqué",
                unknown: "Inconnu"
            },
            status: "Statut",
            serial: "Numéro de série",
            startDate: "Date de début",
            endDate: "Date de fin",            
            common_name: "Actions",
            downloads: "Téléchargements"
        },
        es: {
            certificateNamePlaceholder: "Nombre del certificado (ej: John Doe)",
            searchPlaceholder: "Buscar un certificado",
            revoke: "Revocar",
            renew: "Renovar",
            lang: {
                english: "Inglés",
                french: "Francés",
                spanish: "Español",
                german: "Alemán"
            },
            oneCertificate: "1 Certificado",
            tenCertificates: "10 Certificados",
            hundredCertificates: "100 Certificados",
            thousandCertificates: "1000 Certificados",
            refresh: "Actualizar",
            done: "¡Hecho!",
            statusBtn: {
                valid: "Válido",
                expired: "Expirado",
                revoked: "Revocado",
                unknown: "Desconocido"
            },
            status: "Estado",
            serial: "Número de serie",
            startDate: "Fecha de inicio",
            endDate: "Fecha de finalización",
            common_name: "Nombre común (CN)",
            downloads: "Descargas"
        },
        de: {
            certificateNamePlaceholder: "Zertifikatsname (z.B.: John Doe)",
            searchPlaceholder: "Nach einem Zertifikat suchen",
            revoke: "Widerrufen",
            renew: "Erneuern",
            lang: {
                english: "Englisch",
                french: "Französisch",
                spanish: "Spanisch",
                german: "Deutsch"
            },
            oneCertificate: "1 Zertifikat",
            tenCertificates: "10 Zertifikate",
            hundredCertificates: "100 Zertifikate",
            thousandCertificates: "1000 Zertifikate",
            refresh: "Aktualisieren",
            done: "Fertig!",
            statusBtn: {
                valid: "Gültig",
                expired: "Abgelaufen",
                revoked: "Widerrufen",
                unknown: "Unbekannt"
            },
            status: "Status",
            serial: "Seriennummer",
            startDate: "Startdatum",
            endDate: "Enddatum",
            common_name: "Allgemeiner Name (CN)",
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
        $('#revokeSelected').html(`<img src="src/images/ban-solid.svg" class="icon mr-1"/> ${texts[lang].revoke}`);
        $('#renewSelected').html(`<img src="src/images/rotate-right-solid.svg" class="icon mr-1"/> ${texts[lang].renew}`);
        $('#refresh').html(`<img src="src/images/rotate-solid.svg" class="icon mr-1"/> ${texts[lang].refresh}`);
        $('#english').html(`${texts[lang].lang.english} <span class="checkmark"><img src="src/images/check-solid.svg" class="icon ml-3"/></span>`);
        $('#french').html(`${texts[lang].lang.french} <span class="checkmark"><img src="src/images/check-solid.svg" class="icon ml-3"/></span>`);
        $('#spanish').html(`${texts[lang].lang.spanish} <span class="checkmark"><img src="src/images/check-solid.svg" class="icon ml-3"/></span>`);
        $('#german').html(`${texts[lang].lang.german} <span class="checkmark"><img src="src/images/check-solid.svg" class="icon ml-3"/></span>`);

        // Update dropdown items
        $('.create[data-count="1"]').text(texts[lang].oneCertificate);
        $('.create[data-count="10"]').text(texts[lang].tenCertificates);
        $('.create[data-count="100"]').text(texts[lang].hundredCertificates);
        $('.create[data-count="1000"]').text(texts[lang].thousandCertificates);
        
        // Update table headers
        $('th[data-sort="serial"]').html(`<img src="src/images/hashtag-solid.svg" class="icon mr-1"/> ${texts[lang].serial}`);
        $('th[data-sort="startDate"]').html(`<img src="src/images/calendar-day-solid.svg" class="icon mr-1"/> ${texts[lang].startDate}`);
        $('th[data-sort="endDate"]').html(`<img src="src/images/calendar-days-solid.svg" class="icon mr-1"/> ${texts[lang].endDate}`);
        $('th[data-sort="actions"]').html(`<img src="src/images/gear-solid.svg" class="icon mr-1"/> ${texts[lang].actions}`);
        $('th[data-sort="downloads"]').html(`<img src="src/images/download-solid.svg" class="icon mr-1"/> ${texts[lang].downloads}`);
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
    function sortTable(columnIndex, order) {
        const rows = Array.from(certTableBody.querySelectorAll('tr'));
        const headers = document.querySelectorAll('th');
        const sortKey = headers[columnIndex].getAttribute('data-sort');

        rows.sort((a, b) => {
            const cellA = a.querySelector(`td[data-sort="${sortKey}"]`);
            const cellB = b.querySelector(`td[data-sort="${sortKey}"]`);

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

            const valueA = cellA.textContent.trim();
            const valueB = cellB.textContent.trim();

            if (sortKey === 'startDate' || sortKey === 'endDate') {
                const dateA = new Date(valueA);
                const dateB = new Date(valueB);
                return order === 'asc' ? dateA - dateB : dateB - dateA;
            }

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

                    // Determine status color and button text based on the status
                    if (status === 'V') {
                        statusColor = 'success';
                        statusText = texts[lang].statusBtn.valid;
                        statusBtn = `<img src="src/images/circle-check-solid.svg" class="icon mr-1"/> ${statusText}`;
                    } else if (status === 'E') {
                        statusColor = 'warning';
                        statusText = texts[lang].statusBtn.expired;
                        statusBtn = `<img src="src/images/triangle-exclamation-solid.svg" class="icon mr-1"/> ${statusText}`;
                    } else if (status === 'R') {
                        statusColor = 'danger';
                        statusText = texts[lang].statusBtn.revoked;
                        statusBtn = `<img src="src/images/circle-xmark-solid.svg" class="icon mr-1"/> ${statusText}`;
                    } else {
                        statusColor = 'secondary';
                        statusText = texts[lang].statusBtn.unknown;
                        statusBtn = `<img src="src/images/question-solid.svg" class="icon mr-1"/> ${statusText}`;
                    }

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td><input type="checkbox" class="cert-checkbox" data-id="${cert.id}" ${status === 'R' ? 'disabled' : ''}></td>                        
                        <td data-sort="status"><button class="btn btn-ssm btn-${statusColor} rounded-pill w-75" data-id="${cert.id}">${statusBtn}</button></td>
                        <td data-sort="serial"><span class="tooltip-container" data-toggle="tooltip" data-html="true" data-placement="bottom" title="<div>Signature: ${cert.signature}</div>">${cert.serial}</span></td>
                        <td data-sort="startDate"><span class="tooltip-container" data-toggle="tooltip" data-placement="bottom" title="${cert.startDate}">${formatDate(cert.startDate)}</span></td>
                        <td data-sort="endDate"><span class="tooltip-container" data-toggle="tooltip" data-placement="bottom" title="${cert.endDate}">${formatDate(cert.endDate)}</span></td>
                        <td data-sort="id">${cert.id}</td>
                        <td data-sort="downloads">
                            <a class="btn btn-info btn-sm" href="/src/certs/${cert.id}.crt" download><img src="src/images/file-arrow-down-solid.svg" class="icon mr-1"/>.crt</a>
                            <a class="btn btn-info btn-sm" href="/src/certs/${cert.id}.csr" download><img src="src/images/file-arrow-down-solid.svg" class="icon mr-1"/>.csr</a>
                            <a class="btn btn-info btn-sm" href="/src/private/${cert.id}.key" download><img src="src/images/file-arrow-down-solid.svg" class="icon mr-1"/>.key</a>
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
            })
            .catch(error => console.error('Certificate loading error:', error));
    }

    // Check if input is empty or not
    function toggleCreateButton() {
        if (certNameInput.value.trim() === "") {
            createDropdown.disabled = true;
        } else {
            createDropdown.disabled = false;
        }
    }

    // Initialize tool tips
    function initializeTooltips() {
        $('[data-toggle="tooltip"]').tooltip({
            html: true
        });
    }

    // Update create button based on input
    certNameInput.addEventListener('input', toggleCreateButton);

    // Dropdown menu to generate a specific number of certificates
    createItems.forEach(item => {
        item.addEventListener('click', function() {
            const certCount = this.getAttribute('data-count');
            const certName = encodeName(certNameInput.value);
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
    
    // Refreshing the table
    refreshButton.addEventListener('click', function(event) {
        event.preventDefault();
        loadCertData();
        refreshButton.disabled = true;
        refreshButton.querySelector('img').style.transition = '1s ease-in-out';
        refreshButton.querySelector('img').style.transform = 'rotate(720deg)';

        setTimeout(() => {
            refreshButton.classList.add('btn-success');
            refreshButton.innerHTML = `<img src="src/images/square-check-white-solid.svg" class="icon mr-1"/> ${texts[lang].done}`;
        }, 1000);
        
        setTimeout(() => {
            refreshButton.classList.remove('btn-success');
            refreshButton.innerHTML = `<img src="src/images/rotate-solid.svg" class="icon mr-1"/> ${texts[lang].refresh}`;
            refreshButton.disabled = false;
        }, 2500);
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
    document.querySelectorAll('thead th').forEach((header, index) => {
        header.addEventListener('click', function() {
            const currentOrder = this.classList.contains('asc') ? 'desc' : 'asc';
            sortTable(index, currentOrder);
            document.querySelectorAll('thead th').forEach(th => th.classList.remove('asc', 'desc'));
            this.classList.add(currentOrder);
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
    toggleCreateButton();
});
