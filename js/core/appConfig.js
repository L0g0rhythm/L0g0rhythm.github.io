/* FILE: js/core/appConfig.js */

export const APP_CONFIG = {
  DEFAULT_LANG: "pt",
  SECTIONS: ["hero", "about", "services", "projects"],
  SECRET_SEQUENCE: [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ],
  THEMES: { DEFAULT: "#9d4edd", MATRIX: "#00ff00", VOID: "#000500" },
  SELECTORS: {
    NAV_LINKS: ".nav-links li",
    MOBILE_LINKS: ".mobile-links a",
    MOBILE_CTA: ".mobile-cta",
    LOGO: ".logo",
    MOBILE_MENU_BTN: ".mobile-menu-btn",
    MOBILE_OVERLAY: ".mobile-nav-overlay",
    HERO_STATS: ".hero-stats",
    FOOTER_CONTENT: ".footer-content",
    SYSTEM_TRAY: ".system-tray",
    INTERACTIVES:
      "a, button, .nav-links li, .service-card, .project-link, .dock-icon, .lang-opt, .sound-control",
  },
};
