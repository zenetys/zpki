document.addEventListener('DOMContentLoaded', function() {
    const switchMenu = document.getElementById('switchMenu');

    // Fonction to show all available profiles
    const createProfileMenu = async () => {
        try {
            const response = await fetch('/profiles');
            const data = await response.json();

            if (Array.isArray(data.profiles)) {
                switchMenu.innerHTML = '';

                data.profiles.forEach(profile => {
                    const item = document.createElement('a');
                    item.className = 'dropdown-item text-truncate';
                    item.id = profile;
                    item.textContent = profile.charAt(0).toUpperCase() + profile.slice(1);

                    item.addEventListener('click', async () => {
                        document.getElementById('switchCurrentCA').innerHTML = profile.charAt(0).toUpperCase() + profile.slice(1);

                        await fetch('/switch-profile', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ profile })
                        });
                        [...switchMenu.children].forEach(el => el.classList.remove('active'));
                        item.classList.add('active');
                    });
                    switchMenu.appendChild(item);
                });
            } else {
                console.error('La réponse des profils n\'est pas un tableau:', data.profiles);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des profils:', error);
        }
    };

    createProfileMenu().then(() => {
        fetch('/profiles')
            .then(response => response.json())
            .then(data => {
                const currentButton = document.getElementById('switchCurrentCA');
                currentButton.innerHTML = data.currentProfile.charAt(0).toUpperCase() + data.currentProfile.slice(1);
                const activeItem = document.getElementById(data.currentProfile);
                if (activeItem) {
                    activeItem.classList.add('active');
                }
            })
            .catch(error => console.error('Error fetching current profile:', error));
    });
});
