/* FILE: js/core/navigation.js */

import { APP_CONFIG } from "./appConfig.js";
import { audioSystem } from "./audioSynth.js";

let currentView = "hero";
let mobileMenuOpen = false;
let isNavigating = false;
let pageTitles = {};

export function getCurrentView() {
  return currentView;
}

export function getIsNavigating() {
  return isNavigating;
}

export function setPageTitles(titles) {
  pageTitles = titles;
}

export function navigate(id) {
  if (id === currentView || isNavigating) return;
  if (mobileMenuOpen) {
    const btn = document.querySelector(APP_CONFIG.SELECTORS.MOBILE_MENU_BTN);
    const overlay = document.querySelector(APP_CONFIG.SELECTORS.MOBILE_OVERLAY);
    if (btn && overlay) toggleMobileMenu(btn, overlay);
  }
  history.pushState({ section: id }, "", `#${id}`);
  switchSection(id);
}

export function switchSection(id) {
  const next = document.getElementById(id);
  if (!next) return;
  isNavigating = true;
  localStorage.setItem("currentSection", id);
  if (pageTitles[id]) document.title = pageTitles[id];
  document
    .querySelectorAll(APP_CONFIG.SELECTORS.NAV_LINKS)
    .forEach((li) => li.classList.toggle("active", li.dataset.target === id));
  const current = document.getElementById(currentView);
  if (current) current.classList.remove("active");
  requestAnimationFrame(() => {
    next.classList.add("active");
    currentView = id;
    setTimeout(() => (isNavigating = false), 500);
  });
}

export function navigateNext() {
  const idx = APP_CONFIG.SECTIONS.indexOf(currentView);
  if (idx < APP_CONFIG.SECTIONS.length - 1)
    navigate(APP_CONFIG.SECTIONS[idx + 1]);
}

export function navigatePrev() {
  const idx = APP_CONFIG.SECTIONS.indexOf(currentView);
  if (idx > 0) navigate(APP_CONFIG.SECTIONS[idx - 1]);
}

export function toggleMobileMenu(btn, overlay) {
  mobileMenuOpen = !mobileMenuOpen;
  overlay.classList.toggle("open", mobileMenuOpen);
  btn.innerHTML = `<i class="fas ${mobileMenuOpen ? "fa-times" : "fa-bars"
    }"></i>`;
}

export function bindNavEvents() {
  const bindNav = (selector) => {
    document
      .querySelectorAll(selector)
      .forEach((item) =>
        item.addEventListener("click", () => navigate(item.dataset.target))
      );
  };
  bindNav(APP_CONFIG.SELECTORS.NAV_LINKS);
  bindNav(APP_CONFIG.SELECTORS.MOBILE_LINKS);

  const cta = document.querySelector(APP_CONFIG.SELECTORS.MOBILE_CTA);
  if (cta)
    cta.addEventListener("click", () => navigate(cta.dataset.target));

  const logo = document.querySelector(APP_CONFIG.SELECTORS.LOGO);
  if (logo) logo.addEventListener("click", () => navigate("hero"));

  const menuBtn = document.querySelector(APP_CONFIG.SELECTORS.MOBILE_MENU_BTN);
  const menuOverlay = document.querySelector(APP_CONFIG.SELECTORS.MOBILE_OVERLAY);
  if (menuBtn && menuOverlay) {
    menuBtn.addEventListener("click", () =>
      toggleMobileMenu(menuBtn, menuOverlay)
    );
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900 && mobileMenuOpen)
        toggleMobileMenu(menuBtn, menuOverlay);
    });
  }

  window.addEventListener("popstate", (e) =>
    switchSection(e.state?.section || "hero")
  );

  // Email clipboard handler
  document.addEventListener("click", (e) => {
    const mailLink = e.target.closest('a[href^="mailto:"]');
    if (mailLink) {
      e.preventDefault();
      const email = mailLink.href.replace("mailto:", "");
      navigator.clipboard
        .writeText(email)
        .then(() => {
          const { showSystemToast } = window.__toast;
          const { dictionary } = window.__dict;
          const lang = localStorage.getItem("userLang") || "pt";
          const dict = dictionary[lang] || dictionary["pt"];
          showSystemToast(dict.toast_copy || "EMAIL ID COPIED");
          if (audioSystem.enabled) audioSystem.playClick();
        })
        .catch(console.error);
    }
  });

  // Custom event listeners for cross-module communication
  window.addEventListener("app:navigate", (e) => {
    if (e.detail?.target) navigate(e.detail.target);
  });
}
