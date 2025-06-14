/*
 * Componente: Renderizador (Versão Final e Corrigida)
 * Contém todas as funções que criam e injetam o HTML na página.
 */

/**
 * Renderiza a estrutura inicial do card com a sidebar e a área de conteúdo principal.
 * @param {object} data - O objeto completo com todos os dados carregados.
 */
export function renderProfile(data) {
  const card = document.getElementById("profile-card");
  if (!card || !data.profile) return;

  const profile = data.profile;
  const socialsHTML = getSocialsHTML(data.socials);

  card.innerHTML = `
    <aside class="profile-sidebar">
        <img src="${profile.pictureUrl}" alt="${profile.name}" class="profile-picture" />
        <h1>${profile.name}</h1>
        <p class="handle">${profile.handle}</p>
        <p class="subtitle">${profile.subtitle}</p>
        <div class="social-icons">${socialsHTML}</div>
    </aside>
    <section class="profile-main">
        <nav class="tabs" id="tabs-nav"></nav>
        <div class="tab-content-area" id="tab-content-area"></div>
    </section>
  `;
}

/**
 * Renderiza os botões de navegação das abas.
 */
export function renderTabs() {
  const tabsNav = document.getElementById("tabs-nav");
  if (!tabsNav) return;
  tabsNav.innerHTML = `
    <i class="fas fa-terminal tab-icon active-tab" data-tab="about" title="Sobre mim"></i>
    <i class="fas fa-briefcase tab-icon" data-tab="projects" title="Projetos"></i>
    <i class="fas fa-cogs tab-icon" data-tab="services" title="Serviços"></i>
    <i class="fas fa-wrench tab-icon" data-tab="tools" title="Ferramentas"></i>
  `;
}

/**
 * Renderiza o conteúdo da primeira aba ('about') ao carregar a página.
 * @param {object} data - O objeto completo com todos os dados.
 */
export function renderInitialContent(data) {
  renderTabContent("about", data);
}

/**
 * Renderiza o conteúdo dinâmico dentro da área de conteúdo principal, baseado na aba clicada.
 * @param {string} tabId - O ID da aba a ser renderizada.
 * @param {object} allData - O objeto completo com todos os dados.
 */
export function renderTabContent(tabId, allData) {
  const contentArea = document.getElementById("tab-content-area");
  if (!contentArea) return;

  let contentHTML = "";
  switch (tabId) {
    case "about":
      contentHTML = getAboutHTML(allData.about);
      break;
    case "projects":
      contentHTML = getProjectsHTML(allData.projects);
      break;
    case "services":
      contentHTML = getServicesHTML(allData.services);
      break;
    case "tools":
      contentHTML = getToolsHTML(allData.tools);
      break;
    default:
      contentHTML =
        '<p class="empty-list-message">Conteúdo não encontrado.</p>';
  }
  contentArea.innerHTML = `<div class="tab-content">${contentHTML}</div>`;
}

// --- Funções Geradoras de HTML ---

function getSocialsHTML(data) {
  if (!Array.isArray(data)) {
    console.error("Dados sociais estão ausentes ou em formato incorreto.");
    return "";
  }
  // Versão estável que renderiza ícones circulares simples
  return data
    .map(
      (s) =>
        `<a href="${s.url}" target="_blank" rel="noopener noreferrer" class="social-icon ${s.cssClass}" title="${s.name}" aria-label="${s.name}">
      <i class="${s.iconClass}"></i>
    </a>`
    )
    .join("");
}

function getAboutHTML(data) {
  // Constrói o parágrafo principal a partir da chave 'main_text'
  const mainParagraph = `<p class="about-paragraph">${data.main_text}</p>`;

  // Constrói a lista de interesses, se ela existir
  let interestsHTML = "";
  if (data.interests_list && data.interests_list.length > 0) {
    const interestItems = data.interests_list
      .map(
        (item) =>
          `<li><span aria-hidden="true">${item.emoji}</span>${item.text}</li>`
      )
      .join("");

    interestsHTML = `
      <h3 class="interests-title">${data.interests_title}</h3>
      <ul class="interests-list">${interestItems}</ul>
    `;
  }

  // Retorna o HTML final com as duas seções
  return `<h2>Sobre mim</h2>${mainParagraph}${interestsHTML}`;
}

function getProjectsHTML(data) {
  const list = data
    .map(
      (p) =>
        `<div class="project-item"><h3><a href="${p.repoUrl}" target="_blank" rel="noopener noreferrer" class="project-title-link"><i class="fab fa-github"></i> ${p.title}</a></h3><p>${p.description}</p></div>`
    )
    .join("");
  return `<h2>Projetos</h2><div class="project-list">${list || '<p class="empty-list-message">Nenhum projeto ainda.</p>'}</div>`;
}

function getServicesHTML(data) {
  const list = data
    .map(
      (s) =>
        `<div class="service-item"><h3>${s.title}</h3><p>${s.description}</p></div>`
    )
    .join("");
  return `<h2>Serviços</h2><div class="service-list">${list || '<p class="empty-list-message">Nenhum serviço listado.</p>'}</div>`;
}

function getToolsHTML(data) {
  const list = data
    .map(
      (t) =>
        `<div class="tool-item"><h3><a href="${t.url}" target="_blank" rel="noopener noreferrer" class="tool-title-link"><i class="${t.iconClass}"></i> ${t.title}</a></h3><p>${t.description}</p></div>`
    )
    .join("");
  return `<h2>Ferramentas</h2><div class="tool-list">${list || '<p class="empty-list-message">Nenhuma ferramenta disponível.</p>'}</div>`;
}
