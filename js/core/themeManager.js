/* FILE: js/core/themeManager.js */

import { startMatrixEffect } from "../components/matrix.js";
import { APP_CONFIG } from "./appConfig.js";
import { dictionary } from "./dictionary.js";
import { showSystemToast } from "./toast.js";

export function restoreTheme() {
  const saved = localStorage.getItem("userTheme");
  if (saved)
    document.documentElement.style.setProperty("--accent-primary", saved);
}

export function activateMatrixMode() {
  document.documentElement.style.setProperty(
    "--accent-primary",
    APP_CONFIG.THEMES.MATRIX
  );
  document.documentElement.style.setProperty(
    "--bg-void",
    APP_CONFIG.THEMES.VOID
  );
  const lang = localStorage.getItem("userLang") || APP_CONFIG.DEFAULT_LANG;
  const dict = dictionary[lang] || dictionary[APP_CONFIG.DEFAULT_LANG];
  showSystemToast(dict.toast_matrix);

  startMatrixEffect();
}
