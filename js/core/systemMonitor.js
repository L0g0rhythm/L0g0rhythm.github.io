/* FILE: js/core/systemMonitor.js */

import { APP_CONFIG } from "./appConfig.js";
import { dictionary } from "./dictionary.js";
import { getCurrentLang } from "./languageSwitcher.js";

let monitorInterval = null;

export function initSystemMonitor() {
  if (monitorInterval) clearInterval(monitorInterval);

  const lang = getCurrentLang();
  const dict = dictionary[lang] || dictionary[APP_CONFIG.DEFAULT_LANG];
  const heroStats = document.querySelector(APP_CONFIG.SELECTORS.HERO_STATS);
  if (!heroStats) return;

  // Latency stat
  let latencyEl = heroStats.querySelector(".stat:nth-child(1)");
  if (!latencyEl) {
    latencyEl = document.createElement("div");
    latencyEl.className = "stat";
    heroStats.appendChild(latencyEl);
  }
  latencyEl.innerHTML = `<span data-i18n="stat_latency">${dict.stat_latency}</span> <span id="lat-val"> --ms</span>`;
  const latencyVal = latencyEl.querySelector("#lat-val");

  const updateLatency = () => {
    if (latencyVal)
      latencyVal.textContent = ` ${Math.floor(Math.random() * 15) + 5}.0ms`;
  };
  monitorInterval = setInterval(updateLatency, 3000);
  updateLatency();

  // Battery API (progressive enhancement)
  if ("getBattery" in navigator) {
    navigator.getBattery().then((bat) => {
      const updateBat = () => {
        const currentDict =
          dictionary[getCurrentLang()] ||
          dictionary[APP_CONFIG.DEFAULT_LANG];
        const lvl = Math.round(bat.level * 100);
        let pwrEl = document.getElementById("pwr-stat");
        if (!pwrEl) {
          pwrEl = document.createElement("div");
          pwrEl.id = "pwr-stat";
          pwrEl.className = "stat";
          pwrEl.innerHTML = `<span data-i18n="stat_pwr">${currentDict.stat_pwr}</span> <span id="pwr-val"></span>`;
          heroStats.appendChild(pwrEl);
        }
        const pwrVal = pwrEl.querySelector("#pwr-val");
        if (pwrVal)
          pwrVal.textContent = ` ${lvl}% ${bat.charging ? "⚡" : ""}`;
        document.body.classList.toggle("low-power", lvl < 20 && !bat.charging);
      };
      bat.addEventListener("levelchange", updateBat);
      bat.addEventListener("chargingchange", updateBat);
      updateBat();
    });
  }
}
