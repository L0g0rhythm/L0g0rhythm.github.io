/* FILE: js/main.js */

/**
 * @file main.js
 * @description Core App Controller.
 * REFACTOR: Restored "Signal Lost" Tab Feature + Audio Feedback Logic.
 * @version 4.3.0-FULL-FEATURE
 */

import { initParticles } from "./components/particles.js";
import { loadAllData } from "./core/dataLoader.js";
import { renderProfile } from "./components/renderer.js";
import { initTiltEffect } from "./components/tilt.js";
import { audioSystem } from "./core/audioSynth.js";
import { startMatrixEffect } from "./components/matrix.js";
import { initHackerEffect } from "./components/hackerText.js";
import { initCommandPalette } from "./components/cmd.js";
import { initMagneticEffect } from "./components/magnetic.js";
import { initContextMenu } from "./components/contextMenu.js";
import { dictionary } from "./core/dictionary.js";

const APP_CONFIG = {
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

class AppController {
  constructor() {
    this.currentView = "hero";
    this.mobileMenuOpen = false;
    this.isNavigating = false;
    this.currentLang =
      localStorage.getItem("userLang") || APP_CONFIG.DEFAULT_LANG;
    this.pageTitles = {};
    this.inputSequence = [];
    this.intervals = { footer: null, monitor: null, log: null };
    this.toastTimer = null;
    this.cachedElements = {
      latencyStat: null,
      uptimeCounter: null,
      localClock: null,
      pwrStat: null,
    };
  }

  async init() {
    //.log(":: SYSTEM INITIALIZATION :: Phase 10 (Feature Complete)");

    window.showToast = (msg) => this.showSystemToast(msg);

    this.initPageTitles();
    this.bindEvents();
    this.initWindowEvents(); // RESTAURADO: Monitoramento de Aba (Signal Lost)
    this.restoreTheme();
    this.updateLangUI(this.currentLang);
    this.translateStaticUI(this.currentLang);

    this.initFooterSystem();
    this.initSystemMonitor();

    this.initScrollObserver();
    if (window.observeElements) window.observeElements();

    this.setupAudioUnlock();
  }

  initPageTitles() {
    const dict =
      dictionary[this.currentLang] || dictionary[APP_CONFIG.DEFAULT_LANG];
    this.pageTitles = {
      hero: "L0g0rhythm | Architect",
      about: `L0g0rhythm | ${dict.nav_arch}`,
      services: `L0g0rhythm | ${dict.nav_sol}`,
      projects: `L0g0rhythm | ${dict.nav_works}`,
    };
  }

  bindEvents() {
    const bindNav = (selector) => {
      document
        .querySelectorAll(selector)
        .forEach((item) =>
          item.addEventListener("click", () =>
            this.navigate(item.dataset.target)
          )
        );
    };
    bindNav(APP_CONFIG.SELECTORS.NAV_LINKS);
    bindNav(APP_CONFIG.SELECTORS.MOBILE_LINKS);

    const cta = document.querySelector(APP_CONFIG.SELECTORS.MOBILE_CTA);
    if (cta)
      cta.addEventListener("click", () => this.navigate(cta.dataset.target));

    const logo = document.querySelector(APP_CONFIG.SELECTORS.LOGO);
    if (logo) logo.addEventListener("click", () => this.navigate("hero"));

    const menuBtn = document.querySelector(
      APP_CONFIG.SELECTORS.MOBILE_MENU_BTN
    );
    const menuOverlay = document.querySelector(
      APP_CONFIG.SELECTORS.MOBILE_OVERLAY
    );
    if (menuBtn && menuOverlay) {
      menuBtn.addEventListener("click", () =>
        this.toggleMobileMenu(menuBtn, menuOverlay)
      );
      window.addEventListener("resize", () => {
        if (window.innerWidth > 900 && this.mobileMenuOpen)
          this.toggleMobileMenu(menuBtn, menuOverlay);
      });
    }

    document.querySelectorAll(".lang-opt").forEach((opt) => {
      opt.addEventListener("click", (e) =>
        this.switchLanguage(e.target.dataset.lang)
      );
    });

    this.initKeyboardShortcuts();
    this.initSwipe();
    window.addEventListener("popstate", (e) =>
      this.switchSection(e.state?.section || "hero")
    );
    this.initSoundToggle();

    document.addEventListener("click", (e) => {
      const mailLink = e.target.closest('a[href^="mailto:"]');
      if (mailLink) {
        e.preventDefault();
        const email = mailLink.href.replace("mailto:", "");
        navigator.clipboard
          .writeText(email)
          .then(() => {
            const dict =
              dictionary[this.currentLang] ||
              dictionary[APP_CONFIG.DEFAULT_LANG];
            this.showSystemToast(dict.toast_copy || "EMAIL ID COPIED");
            if (audioSystem.enabled) audioSystem.playClick();
          })
          .catch(console.error);
      }
    });

    window.addEventListener("app:navigate", (e) => {
      if (e.detail?.target) this.navigate(e.detail.target);
    });
    window.addEventListener("app:matrix", () => this.activateMatrixMode());
    window.addEventListener("app:toast", (e) => {
      if (e.detail?.message) this.showSystemToast(e.detail.message);
    });
  }

  // --- FEATURE RESTAURADA: COMPORTAMENTO DE ABA ---
  initWindowEvents() {
    const originalTitle = document.title;
    const altTitle = "⚠️ SIGNAL LOST // RECONNECT...";

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        document.title = altTitle;
      } else {
        // Restaura o título correto baseado na seção atual
        document.title = this.pageTitles[this.currentView] || originalTitle;
      }
    });
  }

  initAudioFeedback() {
    const elements = document.querySelectorAll(
      APP_CONFIG.SELECTORS.INTERACTIVES
    );
    elements.forEach((el) => {
      el.removeEventListener("mouseenter", this.handleHoverSound);
      el.addEventListener("mouseenter", () => {
        if (audioSystem.enabled) audioSystem.playHover();
      });
    });
    //console.log(
    //  `[Audio] Feedback system engaged for ${elements.length} elements.`
    //);
  }

  showSystemToast(msg) {
    let toast = document.querySelector(".system-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "system-toast";
      toast.innerHTML = `<i class="fas fa-terminal"></i> <span class="toast-msg"></span>`;
      document.body.appendChild(toast);
    }
    toast.querySelector(".toast-msg").textContent = msg;
    toast.classList.remove("show");
    void toast.offsetWidth;
    toast.classList.add("show");
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => toast.classList.remove("show"), 4000);
  }

  navigateNext() {
    const idx = APP_CONFIG.SECTIONS.indexOf(this.currentView);
    if (idx < APP_CONFIG.SECTIONS.length - 1)
      this.navigate(APP_CONFIG.SECTIONS[idx + 1]);
  }
  navigatePrev() {
    const idx = APP_CONFIG.SECTIONS.indexOf(this.currentView);
    if (idx > 0) this.navigate(APP_CONFIG.SECTIONS[idx - 1]);
  }
  navigate(id) {
    if (id === this.currentView || this.isNavigating) return;
    if (this.mobileMenuOpen) {
      const btn = document.querySelector(APP_CONFIG.SELECTORS.MOBILE_MENU_BTN);
      const overlay = document.querySelector(
        APP_CONFIG.SELECTORS.MOBILE_OVERLAY
      );
      if (btn && overlay) this.toggleMobileMenu(btn, overlay);
    }
    history.pushState({ section: id }, "", `#${id}`);
    this.switchSection(id);
  }

  switchSection(id) {
    const next = document.getElementById(id);
    if (!next) return;
    this.isNavigating = true;
    localStorage.setItem("currentSection", id);
    if (this.pageTitles[id]) document.title = this.pageTitles[id];
    document
      .querySelectorAll(APP_CONFIG.SELECTORS.NAV_LINKS)
      .forEach((li) => li.classList.toggle("active", li.dataset.target === id));
    const current = document.getElementById(this.currentView);
    if (current) current.classList.remove("active");
    requestAnimationFrame(() => {
      next.classList.add("active");
      this.currentView = id;
      setTimeout(() => (this.isNavigating = false), 500);
    });
  }

  restoreTheme() {
    const saved = localStorage.getItem("userTheme");
    if (saved)
      document.documentElement.style.setProperty("--accent-primary", saved);
  }

  activateMatrixMode() {
    document.documentElement.style.setProperty(
      "--accent-primary",
      APP_CONFIG.THEMES.MATRIX
    );
    document.documentElement.style.setProperty(
      "--bg-void",
      APP_CONFIG.THEMES.VOID
    );
    const dict =
      dictionary[this.currentLang] || dictionary[APP_CONFIG.DEFAULT_LANG];
    this.showSystemToast(dict.toast_matrix);
    if (audioSystem.enabled) audioSystem.playClick();
    startMatrixEffect();
  }

  async switchLanguage(newLang) {
    if (newLang === this.currentLang) return;
    this.currentLang = newLang;
    localStorage.setItem("userLang", newLang);
    this.updateLangUI(newLang);
    this.translateStaticUI(newLang);
    this.initFooterSystem();
    if (audioSystem.enabled) audioSystem.playClick();
    document.body.classList.remove("loaded");
    try {
      const data = await loadAllData(newLang);
      renderProfile(data);
      setTimeout(() => {
        initHackerEffect();
        this.initAudioFeedback();
        document.body.classList.add("loaded");
        this.showSystemToast(dictionary[newLang]?.toast_lang || "LANG UPDATED");
        if (window.observeElements) window.observeElements();
      }, 300);
    } catch (e) {
      console.error(e);
      document.body.classList.add("loaded");
    }
  }

  translateStaticUI(lang) {
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
    this.initPageTitles();
    if (this.currentView) document.title = this.pageTitles[this.currentView];
  }

  updateLangUI(lang) {
    document
      .querySelectorAll(".lang-opt")
      .forEach((el) => el.classList.toggle("active", el.dataset.lang === lang));
  }

  initFooterSystem() {
    const footerContent = document.querySelector(
      APP_CONFIG.SELECTORS.FOOTER_CONTENT
    );
    if (!footerContent) return;
    const dict =
      dictionary[this.currentLang] || dictionary[APP_CONFIG.DEFAULT_LANG];

    document.querySelector(".system-log")?.remove();
    document.querySelector(".telemetry-container")?.remove();

    const sysLog = document.createElement("div");
    sysLog.className = "system-log";
    sysLog.textContent = dict.sys_log_init;
    sysLog.style.opacity = "1";
    footerContent.insertBefore(sysLog, footerContent.firstChild);

    const container = document.createElement("div");
    container.className = "telemetry-container";
    const createMetric = (label, id, defaultVal) => {
      const div = document.createElement("div");
      div.className = label === "LOC" ? "local-time" : "system-uptime";
      div.innerHTML = `${label} <span id="${id}">${defaultVal}</span>`;
      return div;
    };
    container.append(
      createMetric("UPTIME", "uptime-counter", "00:00:00"),
      createMetric("LOC", "local-clock", "--:--:--")
    );

    const tray = document.querySelector(APP_CONFIG.SELECTORS.SYSTEM_TRAY);
    tray ? tray.appendChild(container) : footerContent.appendChild(container);

    this.cachedElements.uptimeCounter =
      document.getElementById("uptime-counter");
    this.cachedElements.localClock = document.getElementById("local-clock");

    if (this.intervals.footer) clearInterval(this.intervals.footer);
    const start = Date.now();
    this.intervals.footer = setInterval(() => {
      const d = new Date(Date.now() - start);
      if (this.cachedElements.uptimeCounter)
        this.cachedElements.uptimeCounter.textContent = d
          .toISOString()
          .substr(11, 8);
      if (this.cachedElements.localClock)
        this.cachedElements.localClock.textContent =
          new Date().toLocaleTimeString("pt-BR", { hour12: false });
    }, 1000);

    const msgs = [
      dict.sys_log_ver || "L0G0RHYTHM OS V16.2",
      dict.sys_log_enc || "ENCRYPTION: AES-256",
      dict.sys_log_opt || "STATUS: OPTIMAL",
      "VICTOR OLIVEIRA © 2025",
    ];
    let mIdx = 0;
    if (this.intervals.log) clearInterval(this.intervals.log);
    this.intervals.log = setInterval(() => {
      mIdx = (mIdx + 1) % msgs.length;
      sysLog.style.opacity = "0";
      setTimeout(() => {
        sysLog.textContent = msgs[mIdx];
        sysLog.style.opacity = "1";
      }, 300);
    }, 5000);
  }

  initSystemMonitor() {
    if (this.intervals.monitor) clearInterval(this.intervals.monitor);
    const dict =
      dictionary[this.currentLang] || dictionary[APP_CONFIG.DEFAULT_LANG];
    const heroStats = document.querySelector(APP_CONFIG.SELECTORS.HERO_STATS);
    if (!heroStats) return;

    let latencyEl = heroStats.querySelector(".stat:nth-child(1)");
    if (!latencyEl) {
      latencyEl = document.createElement("div");
      latencyEl.className = "stat";
      heroStats.appendChild(latencyEl);
    }
    latencyEl.innerHTML = `<span data-i18n="stat_latency">${dict.stat_latency}</span> <span id="lat-val"> --ms</span>`;
    this.cachedElements.latencyStat =
      latencyEl.querySelector("#lat-val") || latencyEl.lastChild;

    const updateLatency = () => {
      if (this.cachedElements.latencyStat)
        this.cachedElements.latencyStat.textContent = ` ${
          Math.floor(Math.random() * 15) + 5
        }.0ms`;
    };
    this.intervals.monitor = setInterval(updateLatency, 3000);
    updateLatency();

    if ("getBattery" in navigator) {
      navigator.getBattery().then((bat) => {
        const updateBat = () => {
          const dict =
            dictionary[this.currentLang] || dictionary[APP_CONFIG.DEFAULT_LANG];
          const lvl = Math.round(bat.level * 100);
          let pwrEl = document.getElementById("pwr-stat");
          if (!pwrEl) {
            pwrEl = document.createElement("div");
            pwrEl.id = "pwr-stat";
            pwrEl.className = "stat";
            pwrEl.innerHTML = `<span data-i18n="stat_pwr">${dict.stat_pwr}</span> <span id="pwr-val"></span>`;
            heroStats.appendChild(pwrEl);
            this.cachedElements.pwrStat = pwrEl.querySelector("#pwr-val");
          }
          if (this.cachedElements.pwrStat)
            this.cachedElements.pwrStat.textContent = ` ${lvl}% ${
              bat.charging ? "⚡" : ""
            }`;
          document.body.classList.toggle(
            "low-power",
            lvl < 20 && !bat.charging
          );
        };
        bat.addEventListener("levelchange", updateBat);
        bat.addEventListener("chargingchange", updateBat);
        updateBat();
      });
    }
  }

  initScrollObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    window.observeElements = () => {
      document
        .querySelectorAll(".service-card, .project-row, .spec-item, .bio-text")
        .forEach((el) => observer.observe(el));
    };
  }

  setupAudioUnlock() {
    const unlock = () => {
      if (audioSystem.analyser?.context.state === "suspended")
        audioSystem.analyser.context.resume();
      this.initAudioFeedback();
      ["click", "keydown", "touchstart"].forEach((evt) =>
        document.removeEventListener(evt, unlock)
      );
    };
    ["click", "keydown", "touchstart"].forEach((evt) =>
      document.addEventListener(evt, unlock)
    );
  }

  initSwipe() {
    let tx = 0,
      ty = 0;
    document.addEventListener(
      "touchstart",
      (e) => {
        tx = e.changedTouches[0].screenX;
        ty = e.changedTouches[0].screenY;
      },
      { passive: true }
    );
    document.addEventListener(
      "touchend",
      (e) => {
        if (this.isNavigating) return;
        const dx = tx - e.changedTouches[0].screenX;
        const dy = ty - e.changedTouches[0].screenY;
        if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 2)
          dx > 0 ? this.navigateNext() : this.navigatePrev();
      },
      { passive: true }
    );
  }

  initKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      if (
        !this.isNavigating &&
        !this.inputSequence.length &&
        !e.ctrlKey &&
        !e.altKey
      ) {
        if (["ArrowRight", "ArrowDown"].includes(e.key)) this.navigateNext();
        if (["ArrowLeft", "ArrowUp"].includes(e.key)) this.navigatePrev();
      }
      this.inputSequence.push(e.key);
      if (this.inputSequence.length > APP_CONFIG.SECRET_SEQUENCE.length)
        this.inputSequence.shift();
      if (
        JSON.stringify(this.inputSequence) ===
        JSON.stringify(APP_CONFIG.SECRET_SEQUENCE)
      ) {
        this.activateMatrixMode();
        this.inputSequence = [];
      }
    });
  }

  initSoundToggle() {
    const btn = document.getElementById("sound-btn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      audioSystem.enabled = !audioSystem.enabled;
      btn.classList.toggle("muted", !audioSystem.enabled);
      btn.innerHTML = `<i class="fas ${
        audioSystem.enabled ? "fa-volume-up" : "fa-volume-mute"
      }"></i>`;
      if (audioSystem.enabled) {
        if (audioSystem.analyser?.context.state === "suspended")
          audioSystem.analyser.context.resume();
        audioSystem.playClick();
        this.showSystemToast("AUDIO: ONLINE");
      } else {
        this.showSystemToast("AUDIO: MUTED");
      }
    });
  }

  toggleMobileMenu(btn, overlay) {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    overlay.classList.toggle("open", this.mobileMenuOpen);
    btn.innerHTML = `<i class="fas ${
      this.mobileMenuOpen ? "fa-times" : "fa-bars"
    }"></i>`;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  //console.log(
  //"%c L0G0RHYTHM // SYSTEM OPTIMAL ",
  //   "background:#000; color:#00ff41; padding:5px; font-family:monospace;"
  //);
  const app = new AppController();
  try {
    const userLang =
      localStorage.getItem("userLang") || APP_CONFIG.DEFAULT_LANG;
    const data = await loadAllData(userLang);
    renderProfile(data || {});
    const hasBooted = sessionStorage.getItem("systemBooted");
    setTimeout(
      () => {
        const boot = document.getElementById("boot-sequence");
        if (boot) {
          if (hasBooted) {
            boot.style.display = "none";
          } else {
            boot.style.opacity = "0";
            setTimeout(() => boot.remove(), 500);
          }
        }
        sessionStorage.setItem("systemBooted", "true");
        document.body.classList.add("loaded");
        app.init();
        initTiltEffect();
        initCommandPalette();
        initParticles();
        initMagneticEffect();
        initContextMenu();
        audioSystem.init();
        setTimeout(() => initHackerEffect(), 200);
      },
      hasBooted ? 0 : 2200
    );
    if ("serviceWorker" in navigator)
      navigator.serviceWorker.register("./sw.js").catch(() => {});
  } catch (e) {
    console.error("Boot Fail", e);
    document.body.classList.add("loaded");
  }
});
