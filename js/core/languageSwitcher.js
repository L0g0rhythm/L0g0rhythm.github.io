/* FILE: js/core/languageSwitcher.js */

import { initHackerEffect } from "../components/hackerText.js";
import { renderProfile } from "../components/render/profile.js";
import { APP_CONFIG } from "./appConfig.js";
import { loadAllData } from "./dataLoader.js";
import { dictionary } from "./dictionary.js";
import { getCurrentView, setPageTitles } from "./navigation.js";
import { showSystemToast } from "./toast.js";

let currentLang = localStorage.getItem("userLang") || APP_CONFIG.DEFAULT_LANG;

export function getCurrentLang() {
  return currentLang;
}

export function initPageTitles() {
  const dict = dictionary[currentLang] || dictionary[APP_CONFIG.DEFAULT_LANG];
  const titles = {
    hero: "L0g0rhythm | Architect",
    about: `L0g0rhythm | ${dict.nav_arch}`,
    services: `L0g0rhythm | ${dict.nav_sol}`,
    projects: `L0g0rhythm | ${dict.nav_works}`,
  };
  setPageTitles(titles);
  return titles;
}

export function translateStaticUI(lang) {
  const dict = dictionary[lang] || dictionary[APP_CONFIG.DEFAULT_LANG];
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key]) {
      el.tagName === "INPUT" && el.placeholder
        ? (el.placeholder = dict[key])
        : (el.textContent = dict[key]);
      if (el.hasAttribute("data-text"))
        el.setAttribute("data-text", dict[key]);
    }
  });
  const titles = initPageTitles();
  const view = getCurrentView();
  if (view && titles[view]) document.title = titles[view];
}

export function updateLangUI(lang) {
  document
    .querySelectorAll(".lang-opt")
    .forEach((el) => el.classList.toggle("active", el.dataset.lang === lang));
}

export async function switchLanguage(newLang) {
  if (newLang === currentLang) return;
  currentLang = newLang;
  localStorage.setItem("userLang", newLang);
  updateLangUI(newLang);
  translateStaticUI(newLang);

  document.body.classList.remove("loaded");
  try {
    const data = await loadAllData(newLang);
    renderProfile(data);
    setTimeout(() => {
      initHackerEffect();
      document.body.classList.add("loaded");
      showSystemToast(dictionary[newLang]?.toast_lang || "LANG UPDATED");
      if (window.observeElements) window.observeElements();
    }, 300);
  } catch (e) {
    console.error(e);
    document.body.classList.add("loaded");
  }
}

export function bindLanguageEvents() {
  document.querySelectorAll(".lang-opt").forEach((opt) => {
    opt.addEventListener("click", (e) =>
      switchLanguage(e.target.dataset.lang)
    );
  });
}
