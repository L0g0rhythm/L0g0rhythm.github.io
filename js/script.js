document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-icon');
    const contents = document.querySelectorAll('.tab-content');

    if (tabs.length > 0 && contents.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetId = tab.getAttribute('data-tab');
                const targetContent = document.getElementById(targetId);

                tabs.forEach(t => t.classList.remove('active-tab'));
                contents.forEach(c => c.classList.remove('active-content'));

                tab.classList.add('active-tab');
                if (targetContent) {
                    targetContent.classList.add('active-content');
                }
            });
        });
    }

    const projectListContainer = document.querySelector('#projects-content .project-list');

    async function loadProjects() {
        if (!projectListContainer) {
             return;
        }

        try {
            const response = await fetch('data/projects.json');

            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
                throw new Error('Failed to fetch project data.');
            }
            const projects = await response.json();

            projectListContainer.innerHTML = '';

            if (!Array.isArray(projects)) {
                throw new Error('Project data is not an array.');
            }

            if (projects.length === 0) {
                 projectListContainer.innerHTML = '<p style="color: var(--color-text-medium); text-align: center;">No projects to display yet.</p>';
                 return;
            }

            projects.forEach(project => {
                if (!project.title || !project.repoUrl || !project.description) {
                    console.warn('Skipping project with missing essential data:', project.title || 'Unknown');
                    return;
                }

                const projectItemHTML = `
                    <div class="project-item">
                        <h3 class="project-title">
                            <a href="${project.repoUrl}" target="_blank" class="project-title-link" title="View ${project.title} Repository on GitHub">
                                <i class="fab fa-github"></i> ${project.title}
                            </a>
                        </h3>
                        <p class="project-description">${project.description}</p>
                        <div class="project-extra-links">
                            ${project.demoUrl ? `
                                <a href="${project.demoUrl}" target="_blank" class="project-extra-link" title="View Demo">
                                    <i class="fas fa-external-link-alt"></i> Demo
                                </a>` : ''}
                            ${project.articleUrl ? `
                                <a href="${project.articleUrl}" target="_blank" class="project-extra-link" title="Read Article">
                                    <i class="fab fa-medium"></i> Article
                                </a>` : ''}
                        </div>
                    </div>
                `;
                projectListContainer.insertAdjacentHTML('beforeend', projectItemHTML);
            });

        } catch (error) {
            console.error('Error loading or rendering projects:', error);
            if (projectListContainer) {
                 projectListContainer.innerHTML = '<p style="color: var(--color-text-medium); text-align: center;">Failed to load projects.</p>';
            }
        }
    }

    loadProjects();

});