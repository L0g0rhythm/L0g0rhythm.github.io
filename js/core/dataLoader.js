/* FILE: js/core/dataLoader.js */

export async function loadAllData(lang = "pt") {
  const resources = [
    "profile",
    "about",
    "projects",
    "services",
    "socials",
    "tools",
  ];

  const data = {};

  // Isolated error handling per resource prevents cascade failures
  const promises = resources.map(async (res) => {
    try {
      const response = await fetch(`./data/${res}.json`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return { key: res, value: await response.json(), status: "success" };
    } catch (e) {
      console.warn(`[System] Failed to load module: ${res}`, e);
      return { key: res, value: null, status: "error" };
    }
  });

  const results = await Promise.all(promises);

  results.forEach(({ key, value, status }) => {
    if (status === "success" && value) {
      // Language selection: use locale branch if available, else universal data
      if (value[lang]) {
        data[key] = value[lang];
      } else {
        data[key] = value;
      }
    } else {
      // Safe fallback to prevent undefined in renderer
      data[key] = null;
    }
  });

  return data;
}
