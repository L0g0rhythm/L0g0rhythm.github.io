/* ARQUIVO: js/core/dataLoader.js */

export async function loadAllData(lang = "pt") {
  const resources = [
    "profile",
    "about",
    "projects",
    "services",
    "socials",
    "tools", // Incluído para garantir carregamento completo
  ];

  const data = {};

  // Cria promessas individuais com tratamento de erro isolado
  const promises = resources.map(async (res) => {
    try {
      const response = await fetch(`./data/${res}.json`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return { key: res, value: await response.json(), status: "success" };
    } catch (e) {
      console.warn(`[System] Failed to load module: ${res}`, e);
      return { key: res, value: null, status: "error" }; // Não quebra o fluxo
    }
  });

  // Aguarda todas, independentemente de sucesso ou falha
  const results = await Promise.all(promises);

  results.forEach(({ key, value, status }) => {
    if (status === "success" && value) {
      // Lógica de Seleção de Idioma
      if (value[lang]) {
        data[key] = value[lang];
      } else {
        data[key] = value; // Dados universais (ex: socials)
      }
    } else {
      // Fallback seguro para evitar undefined no renderer
      data[key] = null;
    }
  });

  return data;
}
