const certSearchInput = document.getElementById('certSearch');
const tagSuggestions = document.getElementById('tagSuggestions');

// Available tags
const availableTags = [
    'Primary',
    'Secondary',
    'Success',
    'Danger',
    'Warning',
    'Info',
    'Light',
    'Dark',
];

// For storing selected tags
const selectedTags = new Set();

// Function to update the search input with selected tags
function updateSearchInput() {
    const tags = Array.from(selectedTags).map(tag => `<span class="badge rounded-pill text-bg-primary">${tag}</span>`).join(' ');
    certSearchInput.value = `tag: ${Array.from(selectedTags).join(' ')}`;
    certSearchInput.innerHTML = tags; // Update the display with selected tags
}

// Display suggestions based on input
certSearchInput.addEventListener('input', function() {
    const value = this.value.toLowerCase();
    if (value.startsWith('tag:')) {
        const query = value.slice(4).trim(); // Get the part after "tag:"
        const suggestions = availableTags.filter(tag => tag.toLowerCase().includes(query) && !selectedTags.has(tag));

        if (suggestions.length > 0) {
            tagSuggestions.innerHTML = suggestions.map(tag => `<button type="button" class="dropdown-item">${tag}</button>`).join('');
            tagSuggestions.style.display = 'block'; // Show suggestions
        } else {
            tagSuggestions.style.display = 'none'; // Hide suggestions
        }
    } else {
        tagSuggestions.style.display = 'none'; // Hide suggestions if not starting with "tag:"
    }
});

// Click event for suggestions
tagSuggestions.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON') {
        const tag = e.target.textContent;
        selectedTags.add(tag);
        updateSearchInput();
        tagSuggestions.style.display = 'none'; // Hide suggestions
    }
});

// Quick access buttons
document.getElementById('validTag').addEventListener('click', () => {
    selectedTags.add('Valid');
    updateSearchInput();
});
document.getElementById('revokedTag').addEventListener('click', () => {
    selectedTags.add('Revoked');
    updateSearchInput();
});
document.getElementById('expiredTag').addEventListener('click', () => {
    selectedTags.add('Expired');
    updateSearchInput();
});

// To prevent selecting a tag multiple times
certSearchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Tab') {
        event.preventDefault(); // Prevent the default tab behavior
        const activeElement = document.activeElement;
        if (activeElement.classList.contains('dropdown-item')) {
            const tag = activeElement.textContent;
            selectedTags.add(tag);
            updateSearchInput();
            tagSuggestions.style.display = 'none'; // Hide suggestions
        }
    }
});
