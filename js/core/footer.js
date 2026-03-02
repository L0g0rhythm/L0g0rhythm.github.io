/* FILE: js/core/footer.js */

import { APP_CONFIG } from "./appConfig.js";
import { dictionary } from "./dictionary.js";
import { getCurrentLang } from "./languageSwitcher.js";

let footerInterval = null;
let logInterval = null;
let cachedUptime = null;
let cachedClock = null;

export function initFooterSystem() {
  const footerContent = document.querySelector(
    APP_CONFIG.SELECTORS.FOOTER_CONTENT
  );
  if (!footerContent) return;

  const lang = getCurrentLang();
  const dict = dictionary[lang] || dictionary[APP_CONFIG.DEFAULT_LANG];

  // Clear previous instances
  document.querySelector(".system-log")?.remove();
  document.querySelector(".telemetry-container")?.remove();

  // System log message
  const sysLog = document.createElement("div");
  sysLog.className = "system-log";
  sysLog.textContent = dict.sys_log_init;
  sysLog.style.opacity = "1";
  footerContent.insertBefore(sysLog, footerContent.firstChild);

  // Telemetry container
  const container = document.createElement("div");
  container.className = "telemetry-container";

  container.append(
    createMetric("UPTIME", "uptime-counter", "00:00:00"),
    createMetric("LOC", "local-clock", "--:--:--")
  );

  const tray = document.querySelector(APP_CONFIG.SELECTORS.SYSTEM_TRAY);
  tray ? tray.appendChild(container) : footerContent.appendChild(container);

  cachedUptime = document.getElementById("uptime-counter");
  cachedClock = document.getElementById("local-clock");

  // Update interval
  if (footerInterval) clearInterval(footerInterval);
  const start = Date.now();
  footerInterval = setInterval(() => {
    const d = new Date(Date.now() - start);
    if (cachedUptime) cachedUptime.textContent = d.toISOString().substr(11, 8);
    if (cachedClock)
      cachedClock.textContent = new Date().toLocaleTimeString("pt-BR", {
        hour12: false,
      });
  }, 1000);

  // Rotating log messages
  const msgs = [
    dict.sys_log_ver || "L0G0RHYTHM OS V16.2",
    dict.sys_log_enc || "ENCRYPTION: AES-256",
    dict.sys_log_opt || "STATUS: OPTIMAL",
    "VICTOR OLIVEIRA © 2026",
  ];
  let mIdx = 0;
  if (logInterval) clearInterval(logInterval);
  logInterval = setInterval(() => {
    mIdx = (mIdx + 1) % msgs.length;
    sysLog.style.opacity = "0";
    setTimeout(() => {
      sysLog.textContent = msgs[mIdx];
      sysLog.style.opacity = "1";
    }, 300);
  }, 5000);
}

function createMetric(label, id, defaultVal) {
  const div = document.createElement("div");
  div.className = label === "LOC" ? "local-time" : "system-uptime";
  div.innerHTML = `${label} <span id="${id}">${defaultVal}</span>`;
  return div;
}
