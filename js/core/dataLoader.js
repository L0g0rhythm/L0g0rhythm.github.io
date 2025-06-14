/*
 * Core: Carregador de Dados
 * Módulo responsável por buscar todos os arquivos JSON de forma assíncrona.
 */

export async function loadAllData() {
  // Lista de todos os arquivos de dados que a aplicação precisa.
  const resources = [
    "profile",
    "about",
    "projects",
    "services",
    "tools",
    "socials",
  ];

  try {
    // Dispara todas as requisições de fetch em paralelo para maior eficiência.
    // O caminho agora é absoluto (começa com /) para robustez no GitHub Pages.
    const fetchPromises = resources.map((res) => fetch(`/data/${res}.json`));
    const responses = await Promise.all(fetchPromises);

    // Verifica se todas as respostas da rede foram bem-sucedidas.
    for (const response of responses) {
      if (!response.ok) {
        throw new Error(
          `HTTP error! Status: ${response.status} on ${response.url}`
        );
      }
    }

    // Extrai o conteúdo JSON de todas as respostas.
    const jsonPromises = responses.map((res) => res.json());
    const jsonData = await Promise.all(jsonPromises);

    // Mapeia os dados para um objeto fácil de usar, com os nomes dos arquivos como chaves.
    return resources.reduce((acc, resource, index) => {
      acc[resource] = jsonData[index];
      return acc;
    }, {});
  } catch (error) {
    console.error("Data loading failed:", error);
    throw error; // Propaga o erro para ser tratado no ponto de entrada (main.js).
  }
}
