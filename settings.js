document.addEventListener('DOMContentLoaded', () => {
    // Theme Logic
    const themeDarkBtn = document.getElementById('themeDarkBtn');
    const themeLightBtn = document.getElementById('themeLightBtn');

    if (themeDarkBtn && themeLightBtn) {
        if (document.documentElement.getAttribute('data-theme') === 'light') {
            themeLightBtn.classList.add('active');
            themeDarkBtn.classList.remove('active');
        }

        themeDarkBtn.addEventListener('click', () => {
            document.documentElement.removeAttribute('data-theme');
            localStorage.removeItem('hawkinsTheme');
            themeDarkBtn.classList.add('active');
            themeLightBtn.classList.remove('active');
        });

        themeLightBtn.addEventListener('click', () => {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('hawkinsTheme', 'light');
            themeLightBtn.classList.add('active');
            themeDarkBtn.classList.remove('active');
        });
    }

    // Support Logic
    const contactBtn = document.getElementById('contactBtn');
    const reportBtn = document.getElementById('reportBtn');

    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            window.location.href = 'mailto:developer@example.com?subject=Contact Developer';
        });
    }

    if (reportBtn) {
        reportBtn.addEventListener('click', () => {
            window.location.href = 'mailto:developer@example.com?subject=Bug Report - Hawkins Web';
        });
    }

    // Data Management Logic
    const clearFavsBtn = document.getElementById('clearFavsBtn');
    const clearAppsBtn = document.getElementById('clearAppsBtn');

    if (clearFavsBtn) {
        clearFavsBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to completely clear your favorites? This action cannot be undone.')) {
                localStorage.removeItem('hawkinsFavorites');
                alert('Favorites completely cleared!');
            }
        });
    }

    if (clearAppsBtn) {
        clearAppsBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to erase all locally added projects? This cannot be undone.')) {
                localStorage.removeItem('hawkinsAddedApps');
                alert('Added projects successfully removed! Return to Dashboard to see changes.');
            }
        });
    }

});
