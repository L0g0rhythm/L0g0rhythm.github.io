/* FILE: js/components/contextMenu.js */

/**
 * @file contextMenu.js
 * @description Custom Right-Click Menu. Secure DOM construction.
 */

import { audioSystem } from "../core/audioSynth.js";
import { dictionary } from "../core/dictionary.js";

const CTX_CONFIG = {
  CLASSES: {
    MENU: "ctx-menu",
    ACTIVE: "active",
    LIST: "ctx-list",
    DANGER: "ctx-danger",
  },
  ACTIONS: {
    BACK: "back",
    RELOAD: "reload",
    COPY: "copy-email",
    MATRIX: "matrix",
    CLOSE: "close",
  },
};

export function initContextMenu() {
  const lang = localStorage.getItem("userLang") || "pt";
  const dict = dictionary[lang] || dictionary["pt"];

  // 1. Create Menu Container
  const menu = document.createElement("div");
  menu.className = CTX_CONFIG.CLASSES.MENU;

  const list = document.createElement("ul");
  list.className = CTX_CONFIG.CLASSES.LIST;

  // 2. Define Menu Items Structure
  const menuItems = [
    {
      action: CTX_CONFIG.ACTIONS.BACK,
      icon: "fa-arrow-left",
      label: dict.ctx_back,
    },
    {
      action: CTX_CONFIG.ACTIONS.RELOAD,
      icon: "fa-sync-alt",
      label: dict.ctx_reload,
    },
    { type: "separator" },
    {
      action: CTX_CONFIG.ACTIONS.COPY,
      icon: "fa-envelope",
      label: dict.ctx_copy,
    },
    {
      action: CTX_CONFIG.ACTIONS.MATRIX,
      icon: "fa-terminal",
      label: dict.ctx_matrix,
    },
    { type: "separator" },
    {
      action: CTX_CONFIG.ACTIONS.CLOSE,
      icon: "fa-times",
      label: dict.ctx_cancel,
      danger: true,
    },
  ];

  // 3. Build Items
  menuItems.forEach((item) => {
    if (item.type === "separator") {
      list.appendChild(document.createElement("hr"));
      return;
    }

    const li = document.createElement("li");
    li.dataset.action = item.action;
    if (item.danger) li.classList.add(CTX_CONFIG.CLASSES.DANGER);

    const icon = document.createElement("i");
    icon.className = `fas ${item.icon}`;

    const text = document.createElement("span");
    text.textContent = item.label; // Secure text insertion

    li.append(icon, text);

    // Event Listener per item (Clean & Fast)
    li.addEventListener("click", () => handleMenuAction(item.action));

    list.appendChild(li);
  });

  menu.appendChild(list);
  document.body.appendChild(menu);

  // Logic: Open
  document.addEventListener("contextmenu", (e) => {
    if (e.shiftKey) return; // Shift bypass
    e.preventDefault();

    const x = e.clientX;
    const y = e.clientY;

    // Boundary check
    const menuWidth = 200;
    const menuHeight = 220;
    const posX = x + menuWidth > window.innerWidth ? x - menuWidth : x;
    const posY = y + menuHeight > window.innerHeight ? y - menuHeight : y;

    menu.style.left = `${posX}px`;
    menu.style.top = `${posY}px`;
    menu.classList.add(CTX_CONFIG.CLASSES.ACTIVE);

    if (audioSystem.enabled) audioSystem.playHover();
  });

  // Logic: Close
  const closeMenu = () => menu.classList.remove(CTX_CONFIG.CLASSES.ACTIVE);
  document.addEventListener("click", closeMenu);
  window.addEventListener("scroll", closeMenu);

  // Logic: Action Handler
  function handleMenuAction(action) {
    if (audioSystem.enabled) audioSystem.playClick();

    switch (action) {
      case CTX_CONFIG.ACTIONS.BACK:
        window.history.back();
        break;
      case CTX_CONFIG.ACTIONS.RELOAD:
        window.location.reload();
        break;
      case CTX_CONFIG.ACTIONS.COPY:
        // Try to find email link safely
        const emailLink = document.querySelector('a[href^="mailto:"]');
        if (emailLink) emailLink.click();
        break;
      case CTX_CONFIG.ACTIONS.MATRIX:
        // Dispatch event compatible with new main.js architecture
        window.dispatchEvent(new CustomEvent("app:matrix"));
        break;
    }
  }
}
