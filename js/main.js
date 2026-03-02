/* FILE: js/main.js */

// Core
import { APP_CONFIG } from "./core/appConfig.js";
import { audioSystem } from "./core/audioSynth.js";
import {
  initSoundToggle,
  setupAudioUnlock,
} from "./core/audioUnlock.js";
import { loadAllData } from "./core/dataLoader.js";
import { dictionary } from "./core/dictionary.js";
import { initFooterSystem } from "./core/footer.js";
import { initKeyboardShortcuts, initSwipe } from "./core/inputHandler.js";
import {
  bindLanguageEvents,
  initPageTitles,
  translateStaticUI,
  updateLangUI
} from "./core/languageSwitcher.js";
import { bindNavEvents } from "./core/navigation.js";
import { initScrollObserver } from "./core/scrollObserver.js";
import { initSystemMonitor } from "./core/systemMonitor.js";
import { activateMatrixMode, restoreTheme } from "./core/themeManager.js";
import { showSystemToast } from "./core/toast.js";
import { initWindowEvents } from "./core/windowEvents.js";

// Components
import { initCommandPalette } from "./components/cmd.js";
import { initContextMenu } from "./components/contextMenu.js";
import { initHackerEffect } from "./components/hackerText.js";
import { initMagneticEffect } from "./components/magnetic.js";
import { initParticles } from "./components/particles.js";
import { renderProfile } from "./components/render/profile.js";
import "./components/render/typewriter.js";
import { initTiltEffect } from "./components/tilt.js";

// Cross-module communication bridge
window.__toast = { showSystemToast };
window.__dict = { dictionary };
window.showToast = (msg) => showSystemToast(msg);

// Matrix mode event
window.addEventListener("app:matrix", () => activateMatrixMode());
window.addEventListener("app:toast", (e) => {
  if (e.detail?.message) showSystemToast(e.detail.message);
});

// JSON-LD injection (external file, no inline script)
fetch("./data/schema.json")
  .then((r) => r.text())
  .then((json) => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = json;
    document.head.appendChild(script);
  })
  .catch(() => { });

document.addEventListener("DOMContentLoaded", async () => {
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

        // Initialize all subsystems
        const pageTitles = initPageTitles();
        bindNavEvents();
        bindLanguageEvents();
        initWindowEvents(pageTitles);
        restoreTheme();
        updateLangUI(userLang);
        translateStaticUI(userLang);
        initFooterSystem();
        initSystemMonitor();
        initScrollObserver();
        if (window.observeElements) window.observeElements();
        setupAudioUnlock();
        initKeyboardShortcuts();
        initSwipe();
        initSoundToggle();
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
      navigator.serviceWorker.register("./sw.js").catch(() => { });
  } catch (e) {
    console.error("Boot Fail", e);
    document.body.classList.add("loaded");
  }
});
