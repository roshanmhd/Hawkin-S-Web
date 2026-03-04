document.addEventListener('DOMContentLoaded', () => {
    const appGrid = document.getElementById('appGrid');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    let currentFilter = 'all';
    let searchQuery = '';

    // Load custom apps from localStorage
    const storedApps = JSON.parse(localStorage.getItem('hawkinsAddedApps')) || [];
    const allApps = [...apps, ...storedApps];

    // Load favorites
    let favoriteApps = JSON.parse(localStorage.getItem('hawkinsFavorites')) || [];

    // Modal Elements
    const appModalOverlay = document.getElementById('appModalOverlay');
    const appModal = document.getElementById('appModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    // Function to render apps
    const renderApps = () => {
        appGrid.innerHTML = '';

        let filteredApps = allApps.filter(app => {
            if (currentFilter === 'favorites') {
                return favoriteApps.includes(app.id);
            }

            const matchesFilter = currentFilter === 'all' || app.type === currentFilter;
            const matchesSearch = app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                app.description.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesFilter && matchesSearch;
        });

        if (filteredApps.length === 0) {
            appGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 50px;">
                    <i class="fas fa-search-minus" style="font-size: 40px; margin-bottom: 15px; color: var(--primary-blue);"></i>
                    <h3>No apps found</h3>
                    <p>Try a different search term or filter.</p>
                </div>
            `;
            return;
        }

        filteredApps.forEach((app, index) => {
            const card = document.createElement('div');
            card.className = 'app-card';
            card.style.animationDelay = `${index * 0.1}s`;

            card.innerHTML = `
                <div>
                    <div class="app-header">
                        <div class="app-icon">
                            <i class="fas ${app.icon}"></i>
                        </div>
                        <div>
                            <div class="app-title">${app.title}</div>
                            <div class="app-category">${app.category}</div>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="app-meta">
                        <span><i class="fas fa-code-branch"></i> ${app.version}</span>
                        <span>${app.type === 'web' ? '<i class="fas fa-globe"></i> Web' : `<i class="fas fa-hdd"></i> ${app.size}`}</span>
                    </div>
                    ${app.type === 'web'
                    ? `<a href="${app.link}" class="download-btn" target="_blank"><i class="fas fa-external-link-alt"></i> Visit Link</a>`
                    : `<a href="${app.link}" class="download-btn"><i class="fas fa-download"></i> Download</a>`}
                </div>
            `;

            // Make card clickable
            card.addEventListener('click', (e) => {
                if (e.target.closest('.download-btn')) return; // Prevent triggering if clicking download directly

                openModal(app);
            });

            appGrid.appendChild(card);
        });
    };

    const openModal = (app) => {
        document.getElementById('modalIcon').innerHTML = `<i class="fas ${app.icon}"></i>`;
        document.getElementById('modalTitle').innerText = app.title;
        document.getElementById('modalCategory').innerText = app.category;
        document.getElementById('modalDesc').innerText = app.description;
        document.getElementById('modalVersion').innerHTML = `<i class="fas fa-code-branch"></i> ${app.version}`;
        document.getElementById('modalSize').innerHTML = app.type === 'web' ? '<i class="fas fa-globe"></i> Web' : `<i class="fas fa-hdd"></i> ${app.size}`;

        const actionBtn = document.getElementById('modalActionBtn');
        actionBtn.href = app.link;
        actionBtn.innerHTML = app.type === 'web' ? '<i class="fas fa-external-link-alt"></i> Visit Project' : '<i class="fas fa-download"></i> Download App';

        const favBtn = document.getElementById('modalFavBtn');
        if (favoriteApps.includes(app.id)) {
            favBtn.innerHTML = '<i class="fas fa-heart"></i>';
            favBtn.classList.add('active');
            favBtn.style.color = 'var(--primary-blue)';
        } else {
            favBtn.innerHTML = '<i class="far fa-heart"></i>';
            favBtn.classList.remove('active');
            favBtn.style.color = 'var(--text-main)';
        }

        favBtn.onclick = () => {
            if (favoriteApps.includes(app.id)) {
                favoriteApps = favoriteApps.filter(id => id !== app.id);
                favBtn.innerHTML = '<i class="far fa-heart"></i>';
                favBtn.style.color = 'var(--text-main)';
            } else {
                favoriteApps.push(app.id);
                favBtn.innerHTML = '<i class="fas fa-heart"></i>';
                favBtn.style.color = 'var(--primary-blue)';
            }
            localStorage.setItem('hawkinsFavorites', JSON.stringify(favoriteApps));

            // Re-render if favorites tab is open currently to immediately reflect it
            if (currentFilter === 'favorites') renderApps();
        };

        appModalOverlay.style.display = 'block';
        appModal.style.display = 'block';

        // Timeout for transition
        setTimeout(() => {
            appModalOverlay.classList.add('show');
            appModal.classList.add('show');
        }, 10);
    };

    const closeModal = () => {
        appModalOverlay.classList.remove('show');
        appModal.classList.remove('show');

        setTimeout(() => {
            appModalOverlay.style.display = 'none';
            appModal.style.display = 'none';
        }, 300);
    };

    closeModalBtn.addEventListener('click', closeModal);
    appModalOverlay.addEventListener('click', closeModal);

    // Initial render
    renderApps();

    // Event listener for search input
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderApps();
    });

    // Event listener for search button
    searchButton.addEventListener('click', () => {
        searchQuery = searchInput.value;
        renderApps();
    });

    // Function to update filter
    const updateFilter = (type) => {
        currentFilter = type;

        // Update sidebar items
        const sidebarMenuItems = document.querySelectorAll('#sidebarMenu .menu-item');
        sidebarMenuItems.forEach(item => {
            if (item.dataset.type) {
                item.classList.remove('active');
                if (item.dataset.type === type) item.classList.add('active');
            }
            // Deal with hardcoded favorites button if it exists
            if (item.innerHTML.includes('Favorites') && type !== 'favorites') {
                item.classList.remove('active');
            } else if (item.innerHTML.includes('Favorites') && type === 'favorites') {
                item.classList.add('active');

                // Unset other active tabs since dataset.type is different
                sidebarMenuItems.forEach(x => { if (x.dataset.type) x.classList.remove('active'); });
            }
        });

        renderApps();
    };

    // Event listeners for sidebar menu
    const sidebarMenuItems = document.querySelectorAll('#sidebarMenu .menu-item');
    sidebarMenuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (item.dataset.type) {
                e.preventDefault();
                updateFilter(item.dataset.type);
            }
        });
    });
});
