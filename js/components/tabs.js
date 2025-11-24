import { renderTabContent } from "./renderer.js";

export function initTabs(allData) {
  const tabsContainer = document.getElementById("tabs-nav");
  const card = document.getElementById("profile-card");

  if (!tabsContainer || !card) {
    console.error("Tab initialization failed: essential elements not found.");
    return;
  }

  tabsContainer.addEventListener("click", (event) => {
    const clickedTab = event.target.closest(".tab-icon");
    if (!clickedTab) return;

    const isMobile = window.innerWidth <= 768;

    if (!isMobile) {
      // Lógica de Desktop
      const currentActiveTab = tabsContainer.querySelector(".active-tab");
      if (currentActiveTab !== clickedTab) {
        currentActiveTab?.classList.remove("active-tab");
        clickedTab.classList.add("active-tab");
        const tabId = clickedTab.dataset.tab;
        renderTabContent(tabId, allData);
      }
      return;
    }

    // Lógica para Mobile (com Modo Foco)
    const isAlreadyActive = clickedTab.classList.contains("active-tab");

    if (isAlreadyActive) {
      // Se a aba clicada JÁ ESTÁ ATIVA, apenas alterna (liga/desliga) o Modo Foco.
      card.classList.toggle("focus-mode");
    } else {
      // Se a aba clicada NÃO ESTAVA ATIVA (é uma nova aba):
      // 1. Troca a aba ativa.
      tabsContainer
        .querySelector(".active-tab")
        ?.classList.remove("active-tab");
      clickedTab.classList.add("active-tab");

      // 2. Renderiza o conteúdo da nova aba.
      const tabId = clickedTab.dataset.tab;
      renderTabContent(tabId, allData);

      // 3. Garante que o card entre em Modo Foco.
      card.classList.add("focus-mode");
    }
  });
}
