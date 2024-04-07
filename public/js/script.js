    // prevent whitespace from being typed in the search bar
    const searchInput = document.getElementById('search_term');

    searchInput.addEventListener('keypress', function(event) {
        const keyValue = event.key;

        if (keyValue === ' ') {
            event.preventDefault();
        }
    });