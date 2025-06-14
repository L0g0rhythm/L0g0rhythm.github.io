/* js/main.js (Versão de Diagnóstico) */

import { loadAllData } from "./core/dataLoader.js";
import {
  renderProfile,
  renderTabs,
  renderInitialContent,
} from "./components/renderer.js";
import { initTabs } from "./components/tabs.js";
import { initCardTilt } from "./components/card-tilt.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("PASSO 1: DOM carregado. Iniciando aplicação...");
  try {
    console.log("PASSO 2: Tentando carregar os dados...");
    const data = await loadAllData();
    console.log("PASSO 3: DADOS CARREGADOS COM SUCESSO.", data);

    console.log("PASSO 4: Tentando renderizar o perfil...");
    renderProfile(data);
    console.log("PASSO 5: PERFIL RENDERIZADO COM SUCESSO.");

    console.log("PASSO 6: Tentando renderizar as abas de navegação...");
    renderTabs();
    console.log("PASSO 7: ABAS RENDERIZADAS COM SUCESSO.");

    console.log(
      "PASSO 8: Tentando renderizar o conteúdo inicial ('Sobre mim')..."
    );
    renderInitialContent(data);
    console.log("PASSO 9: CONTEÚDO INICIAL RENDERIZADO COM SUCESSO.");

    console.log("PASSO 10: Tentando inicializar a interatividade das abas...");
    initTabs(data);
    console.log(
      "PASSO 11: INTERATIVIDADE DAS ABAS INICIADA. Os botões deveriam funcionar agora."
    );

    console.log("PASSO 12: Tentando inicializar o efeito de inclinação...");
    initCardTilt();
    console.log("PASSO 13: EFEITO DE INCLINAÇÃO INICIADO COM SUCESSO.");
  } catch (error) {
    console.error("ERRO FATAL DURANTE A INICIALIZAÇÃO:", error);
  }
});
