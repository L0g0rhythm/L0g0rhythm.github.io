/* FILE: js/components/cmd.js */

/**
 * @file cmd.js
 * @description Command Palette.
 * REFACTOR: Removed dependency on global 'window.app'. Enforced Event Bus communication.
 */

import { audioSystem } from "../core/audioSynth.js";
import { dictionary } from "../core/dictionary.js";

const CMD_CONFIG = {
  CLASSES: {
    OVERLAY: "cmd-overlay",
    MODAL: "cmd-modal",
    INPUT_WRAPPER: "cmd-input-wrapper",
    INPUT: "cmd-input",
    LIST: "cmd-list",
    ITEM: "cmd-item",
    SELECTED: "selected",
    OPEN: "open",
    SHORTCUT: "shortcut",
    ICON: "fas",
  },
  TYPES: {
    NAV: "nav",
    ACTION: "action",
    THEME: "theme",
  },
};

export function initCommandPalette() {
  if (document.querySelector(`.${CMD_CONFIG.CLASSES.OVERLAY}`)) return;

  // --- UI Construction (DOM API) ---
  const overlay = document.createElement("div");
  overlay.className = CMD_CONFIG.CLASSES.OVERLAY;

  const modal = document.createElement("div");
  modal.className = CMD_CONFIG.CLASSES.MODAL;

  const inputWrapper = document.createElement("div");
  inputWrapper.className = CMD_CONFIG.CLASSES.INPUT_WRAPPER;

  const icon = document.createElement("i");
  icon.className = "fas fa-terminal";

  const input = document.createElement("input");
  input.type = "text";
  input.className = CMD_CONFIG.CLASSES.INPUT;
  input.autofocus = true;

  inputWrapper.append(icon, input);

  const list = document.createElement("ul");
  list.className = CMD_CONFIG.CLASSES.LIST;

  modal.append(inputWrapper, list);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // --- State & Logic ---
  let isOpen = false;
  let selectedIndex = 0;
  let currentCommands = [];

  function getCommands() {
    const lang = localStorage.getItem("userLang") || "pt";
    const d = dictionary[lang] || dictionary["pt"];

    input.placeholder = d.cmd_placeholder;

    return [
      {
        id: "hero",
        icon: "fa-home",
        label: d.cmd_nav_hero,
        type: CMD_CONFIG.TYPES.NAV,
      },
      {
        id: "about",
        icon: "fa-user",
        label: d.cmd_nav_arch,
        type: CMD_CONFIG.TYPES.NAV,
      },
      {
        id: "services",
        icon: "fa-cog",
        label: d.cmd_nav_sol,
        type: CMD_CONFIG.TYPES.NAV,
      },
      {
        id: "projects",
        icon: "fa-code-branch",
        label: d.cmd_nav_works,
        type: CMD_CONFIG.TYPES.NAV,
      },
      {
        id: "sound",
        icon: "fa-volume-up",
        label: d.cmd_sys_sound,
        type: CMD_CONFIG.TYPES.ACTION,
      },
      {
        id: "matrix",
        icon: "fa-terminal",
        label: d.cmd_sys_matrix,
        type: CMD_CONFIG.TYPES.ACTION,
      },
      {
        id: "reload",
        icon: "fa-redo",
        label: d.cmd_sys_reboot,
        type: CMD_CONFIG.TYPES.ACTION,
      },
      {
        id: "theme-purple",
        icon: "fa-palette",
        label: d.cmd_theme_def,
        type: CMD_CONFIG.TYPES.THEME,
        color: "#9d4edd",
      },
      {
        id: "theme-blue",
        icon: "fa-palette",
        label: d.cmd_theme_blue,
        type: CMD_CONFIG.TYPES.THEME,
        color: "#00d2ff",
      },
      {
        id: "theme-green",
        icon: "fa-palette",
        label: d.cmd_theme_green,
        type: CMD_CONFIG.TYPES.THEME,
        color: "#00ff41",
      },
      {
        id: "theme-red",
        icon: "fa-palette",
        label: d.cmd_theme_red,
        type: CMD_CONFIG.TYPES.THEME,
        color: "#ff2a6d",
      },
      {
        id: "theme-gold",
        icon: "fa-palette",
        label: d.cmd_theme_gold,
        type: CMD_CONFIG.TYPES.THEME,
        color: "#ffd700",
      },
    ];
  }

  function renderList(filter = "") {
    list.replaceChildren(); // Fastest way to clear
    const allCommands = getCommands();
    const safeFilter = filter.toLowerCase();

    currentCommands = allCommands.filter((c) =>
      c.label ? c.label.toLowerCase().includes(safeFilter) : false
    );

    const fragment = document.createDocumentFragment();

    currentCommands.forEach((cmd, index) => {
      const li = document.createElement("li");
      li.className = `${CMD_CONFIG.CLASSES.ITEM} ${
        index === selectedIndex ? CMD_CONFIG.CLASSES.SELECTED : ""
      }`;

      const leftSpan = document.createElement("span");

      if (cmd.type === CMD_CONFIG.TYPES.THEME && cmd.color) {
        const colorDot = document.createElement("span");
        Object.assign(colorDot.style, {
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: cmd.color,
          display: "inline-block",
          marginRight: "10px",
        });
        leftSpan.appendChild(colorDot);
      } else {
        const itemIcon = document.createElement("i");
        itemIcon.className = `${CMD_CONFIG.CLASSES.ICON} ${cmd.icon}`;
        itemIcon.style.width = "20px";
        leftSpan.appendChild(itemIcon);
      }

      leftSpan.appendChild(document.createTextNode(` ${cmd.label}`));

      const rightSpan = document.createElement("span");
      rightSpan.className = CMD_CONFIG.CLASSES.SHORTCUT;
      rightSpan.textContent = cmd.type.toUpperCase();

      li.append(leftSpan, rightSpan);

      li.onclick = () => execute(cmd);
      li.onmouseenter = () => {
        selectedIndex = index;
        updateSelection();
      };

      fragment.appendChild(li);
    });

    list.appendChild(fragment);
  }

  function updateSelection() {
    Array.from(list.children).forEach((child, i) => {
      child.classList.toggle(CMD_CONFIG.CLASSES.SELECTED, i === selectedIndex);
    });
  }

  function execute(cmd) {
    close();
    if (audioSystem.enabled) audioSystem.playClick();

    if (cmd.type === CMD_CONFIG.TYPES.NAV) {
      // ARCHITECTURE FIX: Use Event Bus strictly. No direct window.app access.
      window.dispatchEvent(
        new CustomEvent("app:navigate", { detail: { target: cmd.id } })
      );
    } else if (cmd.type === CMD_CONFIG.TYPES.THEME) {
      document.documentElement.style.setProperty("--accent-primary", cmd.color);
      localStorage.setItem("userTheme", cmd.color);
      window.dispatchEvent(
        new CustomEvent("app:toast", { detail: { message: "THEME APPLIED" } })
      );
    } else if (cmd.id === "sound") {
      const btn = document.getElementById("sound-btn");
      if (btn) btn.click();
    } else if (cmd.id === "matrix") {
      window.dispatchEvent(new CustomEvent("app:matrix"));
    } else if (cmd.id === "reload") {
      window.location.reload();
    }
  }

  function open() {
    isOpen = true;
    overlay.classList.add(CMD_CONFIG.CLASSES.OPEN);
    input.value = "";
    setTimeout(() => input.focus(), 50);
    selectedIndex = 0;
    renderList("");
    if (audioSystem.enabled) audioSystem.playHover();
  }

  function close() {
    isOpen = false;
    overlay.classList.remove(CMD_CONFIG.CLASSES.OPEN);
  }

  // --- Global Inputs ---
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      isOpen ? close() : open();
    }
    if (e.key === "Escape" && isOpen) close();

    if (isOpen) {
      const visibleItems = currentCommands.length;
      if (visibleItems === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % visibleItems;
        updateSelection();
        list.children[selectedIndex]?.scrollIntoView({ block: "nearest" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + visibleItems) % visibleItems;
        updateSelection();
        list.children[selectedIndex]?.scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (currentCommands[selectedIndex])
          execute(currentCommands[selectedIndex]);
      }
    }
  });

  input.addEventListener("input", (e) => {
    selectedIndex = 0;
    renderList(e.target.value);
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
}
// enregion
