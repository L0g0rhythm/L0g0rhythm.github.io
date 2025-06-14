/*
 * Componente: Lógica das Abas (Versão Final Corrigida)
 * Gerencia os eventos de clique na navegação de abas.
 */

import { renderTabContent } from "./renderer.js";

export function initTabs(allData) {
  const tabsContainer = document.getElementById("tabs-nav");
  if (!tabsContainer) return;

  tabsContainer.addEventListener("click", (event) => {
    const clickedTab = event.target.closest(".tab-icon");

    if (!clickedTab || clickedTab.classList.contains("active-tab")) {
      return;
    }

    // Gerenciamento da classe 'active-tab'
    tabsContainer.querySelector(".active-tab")?.classList.remove("active-tab");
    clickedTab.classList.add("active-tab");

    // CORREÇÃO PRINCIPAL:
    // Pega o ID da aba do atributo data-tab
    const tabId = clickedTab.dataset.tab;

    // Chama a função para renderizar o conteúdo, passando o objeto de dados completo.
    // A função renderTabContent saberá como usar o 'tabId' para acessar os dados corretos (ex: allData.projects).
    renderTabContent(tabId, allData);
  });
}
