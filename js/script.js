// js/script.js

document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab-icon");
    const contents = document.querySelectorAll(".tab-content");

    if (tabs.length > 0 && contents.length > 0) {
        let initialActiveTabFound = false;
        tabs.forEach((tab) => {
            if (tab.classList.contains("active-tab")) {
                initialActiveTabFound = true;
                const targetId = tab.getAttribute("data-tab");
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    contents.forEach((c) => c.classList.remove("active-content"));
                    targetContent.classList.add("active-content");
                }
            }
        });
        if (!initialActiveTabFound && tabs.length > 0) {
            tabs[0].classList.add("active-tab");
            const firstContentId = tabs[0].getAttribute("data-tab");
            const firstContent = document.getElementById(firstContentId);
            if (firstContent) {
                contents.forEach((c) => c.classList.remove("active-content"));
                firstContent.classList.add("active-content");
            }
        }

        tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                const targetId = tab.getAttribute("data-tab");
                const targetContent = document.getElementById(targetId);
                tabs.forEach((t) => t.classList.remove("active-tab"));
                contents.forEach((c) => c.classList.remove("active-content"));
                tab.classList.add("active-tab");
                if (targetContent) {
                    targetContent.classList.add("active-content");
                }
            });
        });
    }

    const projectListContainer = document.querySelector(
        "#projects-content .project-list"
    );
    async function loadProjects() {
        if (!projectListContainer) return;
        try {
            const response = await fetch("data/projects.json");
            if (!response.ok)
                throw new Error(
                    `HTTP error loading projects! status: ${response.status}`
                );
            const projects = await response.json();
            let projectHTML = "";
            if (!Array.isArray(projects))
                throw new Error("Project data is not an array.");

            if (projects.length === 0) {
                projectHTML =
                    '<p style="color: var(--color-text-medium); text-align: center;">No projects to display yet.</p>';
            } else {
                projects.forEach((project) => {
                    if (!project.title || !project.repoUrl || !project.description) {
                        console.warn(
                            "Skipping project with missing data:",
                            project.title || "Unknown"
                        );
                        return;
                    }
                    projectHTML += `
                        <div class="project-item">
                            <h3 class="project-title">
                                <a href="${
                                    project.repoUrl
                                }" target="_blank" class="project-title-link" title="View ${
                        project.title
                    } Repository on GitHub">
                                    <i class="fab fa-github"></i> ${
                                        project.title
                                    }
                                </a>
                            </h3>
                            <p class="project-description">${
                                project.description
                            }</p>
                            <div class="project-extra-links">
                                ${
                                    project.demoUrl
                                    ? `<a href="${project.demoUrl}" target="_blank" class="project-extra-link" title="View Demo"><i class="fas fa-external-link-alt"></i> Demo</a>`
                                    : ""
                                }
                                ${
                                    project.articleUrl
                                    ? `<a href="${project.articleUrl}" target="_blank" class="project-extra-link" title="Read Article"><i class="fab fa-medium"></i> Article</a>`
                                    : ""
                                }
                            </div>
                        </div>`;
                });
            }
            projectListContainer.innerHTML = projectHTML;
        } catch (error) {
            console.error("Error loading or rendering projects:", error);
            if (projectListContainer)
                projectListContainer.innerHTML =
                    '<p style="color: var(--color-text-medium); text-align: center;">Failed to load projects.</p>';
        }
    }

    const serviceListContainer = document.querySelector(
        "#services-content .service-list"
    );
    async function loadServices() {
        if (!serviceListContainer) return;
        try {
            const response = await fetch("data/services.json");
            if (!response.ok)
                throw new Error(
                    `HTTP error loading services! status: ${response.status}`
                );
            const services = await response.json();
            let serviceHTML = "";
            if (!Array.isArray(services))
                throw new Error("Service data is not an array.");

            if (services.length === 0) {
                serviceHTML =
                    '<p style="color: var(--color-text-medium); text-align: center;">No services listed yet.</p>';
            } else {
                services.forEach((service) => {
                    if (!service.title || !service.description) {
                        console.warn(
                            "Skipping service with missing data:",
                            service.title || "Unknown"
                        );
                        return;
                    }
                    serviceHTML += `
                        <div class="service-item">
                            <h3 class="service-title">${service.title}</h3>
                            <p class="service-description">${service.description}</p>
                        </div>`;
                });
            }
            serviceListContainer.innerHTML = serviceHTML;
        } catch (error) {
            console.error("Error loading or rendering services:", error);
            if (serviceListContainer)
                serviceListContainer.innerHTML =
                    '<p style="color: var(--color-text-medium); text-align: center;">Failed to load services.</p>';
        }
    }

    const socialButtonsContainer = document.querySelector(
        "#social-content .social-buttons"
    );
    async function loadSocialLinks() {
        if (!socialButtonsContainer) return;
        try {
            const response = await fetch("data/socials.json");
            if (!response.ok)
                throw new Error(
                    `HTTP error loading social links! status: ${response.status}`
                );
            const socials = await response.json();
            let linksHTML = "";
            if (!Array.isArray(socials))
                throw new Error("Socials data is not an array.");

            if (socials.length > 0) {
                socials.forEach((social) => {
                    if (
                        !social.name ||
                        !social.url ||
                        !social.iconClass ||
                        !social.cssClass
                    ) {
                        console.warn(
                            "Skipping social link with missing data:",
                            social.name || "Unknown"
                        );
                        return;
                    }
                    linksHTML += `
                        <a href="${social.url}" target="_blank" class="social-button ${social.cssClass}" title="${social.name}">
                            <i class="${social.iconClass}"></i> ${social.name}
                        </a>
                    `;
                });
            }
            socialButtonsContainer.innerHTML = linksHTML;
        } catch (error) {
            console.error("Error loading or rendering social links:", error);
            if (socialButtonsContainer)
                socialButtonsContainer.innerHTML =
                    '<p style="color: var(--color-text-medium); text-align: center;">Failed to load links.</p>';
        }
    }

    const aboutMeContainer = document.querySelector(
        "#about-content .about-me-dynamic-content"
    );
    async function loadAboutMe() {
        if (!aboutMeContainer) return;
        try {
            const response = await fetch("data/about.json");
            if (!response.ok)
                throw new Error(
                    `HTTP error loading about me! status: ${response.status}`
                );
            const aboutData = await response.json();
            let contentHTML = "";
            if (typeof aboutData !== "object" || aboutData === null) {
                throw new Error("About me data is not an object.");
            }

            if (aboutData.introduction) {
                contentHTML += `<p class="about-paragraph">${aboutData.introduction}`;
                if (aboutData.flag && aboutData.flag.src && aboutData.flag.alt) {
                    contentHTML += ` <img src="${aboutData.flag.src}" alt="${aboutData.flag.alt}" style="height: 1em; vertical-align: middle;">`;
                }
                let focusText = aboutData.focus ? ` ${aboutData.focus}` : "";
                contentHTML += `.${focusText}</p>`;
            } else if (aboutData.focus) {
                contentHTML += `<p class="about-paragraph">${aboutData.focus}</p>`;
            }

            let interestsExist = false;
            if (
                aboutData.interests &&
                Array.isArray(aboutData.interests) &&
                aboutData.interests.length > 0
            ) {
                contentHTML += '<ul class="interests-list">';
                aboutData.interests.forEach((item) => {
                    if (item.text) {
                        contentHTML += `<li class="interest-item">`;
                        if (item.emoji) {
                            contentHTML += `<span aria-hidden="true">${item.emoji}</span> `;
                        }
                        contentHTML += `${item.text}</li>`;
                        interestsExist = true;
                    }
                });
                contentHTML += "</ul>";
            }
            aboutMeContainer.innerHTML = contentHTML;
        } catch (error) {
            console.error("Error loading or rendering about me:", error);
            if (aboutMeContainer)
                aboutMeContainer.innerHTML =
                    '<p style="color: var(--color-text-medium); text-align: center;">Failed to load content.</p>';
        }
    }

     const toolListContainer = document.querySelector('#tools-content .tool-list');
     async function loadTools() {
         if (!toolListContainer) return;
         try {
             const response = await fetch('data/tools.json');
             if (!response.ok) throw new Error(`HTTP error loading tools! status: ${response.status}`);
             const tools = await response.json();
             toolListContainer.innerHTML = '';
             if (!Array.isArray(tools)) throw new Error('Tools data is not an array.');
             if (tools.length === 0) { toolListContainer.innerHTML = '<p style="color: var(--color-text-medium); text-align: center;">No tools listed yet.</p>'; return; }

             let toolsHTML = '';
             tools.forEach(tool => {
                  if (!tool.title || !tool.url || !tool.description || !tool.iconClass) { console.warn('Skipping tool with missing data:', tool.title || 'Unknown'); return; }
                  toolsHTML += `
                      <div class="tool-item">
                          <h3 class="tool-title">
                              <a href="${tool.url}" target="_blank" class="tool-title-link" title="Open ${tool.title}">
                                  </i> ${tool.title}
                              </a>
                          </h3>
                          <p class="tool-description">${tool.description}</p>
                      </div>
                  `;
              });
              toolListContainer.innerHTML = toolsHTML;
         } catch (error) {
              console.error('Error loading or rendering tools:', error);
              if (toolListContainer) toolListContainer.innerHTML = '<p style="color: var(--color-text-medium); text-align: center;">Failed to load tools.</p>';
         }
     }

    loadProjects();
    loadServices();
    loadSocialLinks();
    loadAboutMe();
    loadTools();

});
