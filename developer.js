document.addEventListener('DOMContentLoaded', () => {
    // Auth Logic
    const authSection = document.getElementById('authSection');
    const dashboardSection = document.getElementById('dashboardSection');
    const devPasswordInput = document.getElementById('devPassword');
    const loginBtn = document.getElementById('loginBtn');
    const authMessage = document.getElementById('authMessage');

    // DOM Elements for form
    const customProjectList = document.getElementById('customProjectList');
    const addProjectForm = document.getElementById('addProjectForm');
    const projTypeSelect = document.getElementById('projType');
    const sizeGroup = document.getElementById('sizeGroup');
    const editProjectIdInput = document.getElementById('editProjectId');
    const formTitle = document.getElementById('formTitle');
    const submitProjectBtn = document.getElementById('submitProjectBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');

    // Simple Authentication (Hardcoded for demo: 'hawkin')
    loginBtn.addEventListener('click', () => {
        if (devPasswordInput.value === 'hawkin') {
            authSection.style.display = 'none';
            dashboardSection.style.display = 'block';
            renderCustomProjects();
        } else {
            authMessage.style.display = 'block';
            setTimeout(() => {
                authMessage.style.display = 'none';
            }, 3000);
        }
    });

    devPasswordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loginBtn.click();
        }
    });

    // Handle Type Selection to toggle size input
    projTypeSelect.addEventListener('change', (e) => {
        if (e.target.value === 'web') {
            sizeGroup.style.display = 'none';
        } else {
            sizeGroup.style.display = 'block';
        }
    });

    // Render projects list in dashboard
    const renderCustomProjects = () => {
        const storedApps = JSON.parse(localStorage.getItem('hawkinsAddedApps')) || [];
        customProjectList.innerHTML = '';

        if (storedApps.length === 0) {
            customProjectList.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No custom projects added yet.</p>';
            return;
        }

        storedApps.forEach(project => {
            const item = document.createElement('div');
            item.className = 'custom-app-item';

            const isWeb = project.type === 'web';

            item.innerHTML = `
                <div class="custom-app-info">
                    <div class="custom-app-icon"><i class="fas ${project.icon}"></i></div>
                    <div class="custom-app-details">
                        <h4>${project.title}</h4>
                        <p>${isWeb ? 'Website' : 'App'} • ${project.category} • ${project.version}</p>
                    </div>
                </div>
                <div class="custom-app-actions">
                    <button class="action-btn edit-btn" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="action-btn del-btn" title="Delete"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;

            // Edit Event
            item.querySelector('.edit-btn').addEventListener('click', () => {
                populateEditForm(project);
            });

            // Delete Event
            item.querySelector('.del-btn').addEventListener('click', () => {
                if (confirm(`Are you sure you want to delete '${project.title}'?`)) {
                    deleteProject(project.id);
                }
            });

            customProjectList.appendChild(item);
        });
    };

    // Populate the form for editing
    const populateEditForm = (project) => {
        editProjectIdInput.value = project.id;

        document.getElementById('projType').value = project.type;
        document.getElementById('projTitle').value = project.title;
        document.getElementById('projCategory').value = project.category;
        document.getElementById('projDesc').value = project.description;
        document.getElementById('projIcon').value = project.icon;
        document.getElementById('projVersion').value = project.version;
        document.getElementById('projSize').value = project.size !== '-' ? project.size : '';
        document.getElementById('projLink').value = project.link;

        // Toggle size group
        sizeGroup.style.display = project.type === 'web' ? 'none' : 'block';

        // Update UI
        formTitle.innerHTML = '<i class="fas fa-pen"></i> Edit Project';
        submitProjectBtn.textContent = 'Update Dashboard';
        cancelEditBtn.style.display = 'block';

        // Open the accordion
        addProjectForm.closest('.admin-form-container').classList.add('open');

        // Scroll gracefully to form
        addProjectForm.closest('.admin-form-container').scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    // Reset Form to Add Mode
    const resetForm = () => {
        addProjectForm.reset();
        editProjectIdInput.value = '';
        formTitle.innerHTML = '<i class="fas fa-plus-circle"></i> Add New Project';
        submitProjectBtn.textContent = 'Add to Dashboard';
        cancelEditBtn.style.display = 'none';
        sizeGroup.style.display = 'block';
    };

    cancelEditBtn.addEventListener('click', resetForm);

    // Delete a project
    const deleteProject = (id) => {
        let storedApps = JSON.parse(localStorage.getItem('hawkinsAddedApps')) || [];
        storedApps = storedApps.filter(app => app.id !== id);
        localStorage.setItem('hawkinsAddedApps', JSON.stringify(storedApps));

        // Also remove from favorites if favorited
        let favoriteApps = JSON.parse(localStorage.getItem('hawkinsFavorites')) || [];
        favoriteApps = favoriteApps.filter(favId => favId !== id);
        localStorage.setItem('hawkinsFavorites', JSON.stringify(favoriteApps));

        renderCustomProjects();
        if (editProjectIdInput.value === id) {
            resetForm();
        }
    };

    // Handle Form Submission for Edit & Add
    addProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const type = projTypeSelect.value;
        const currentEditId = editProjectIdInput.value;

        const projectData = {
            id: currentEditId || ('custom-' + Date.now()),
            type: type,
            title: document.getElementById('projTitle').value,
            category: document.getElementById('projCategory').value,
            description: document.getElementById('projDesc').value,
            icon: document.getElementById('projIcon').value || 'fa-star',
            version: document.getElementById('projVersion').value || 'v1.0.0',
            size: type === 'web' ? '-' : document.getElementById('projSize').value || 'Unknown',
            link: document.getElementById('projLink').value || '#'
        };

        const storedApps = JSON.parse(localStorage.getItem('hawkinsAddedApps')) || [];

        if (currentEditId) {
            // Update existing
            const index = storedApps.findIndex(app => app.id === currentEditId);
            if (index !== -1) {
                storedApps[index] = projectData;
            }
        } else {
            // Add new array
            storedApps.push(projectData);
        }

        // Save
        localStorage.setItem('hawkinsAddedApps', JSON.stringify(storedApps));

        renderCustomProjects();
        resetForm();

        // Let user know
        if (currentEditId) {
            alert('Project updated successfully!');
        } else {
            alert('Project added successfully!');
        }
    });

});
