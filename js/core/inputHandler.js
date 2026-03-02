/* FILE: js/core/inputHandler.js */

import { APP_CONFIG } from "./appConfig.js";
import { getIsNavigating, navigateNext, navigatePrev } from "./navigation.js";
import { activateMatrixMode } from "./themeManager.js";

let inputSequence = [];

/**
 * Keyboard navigation (arrows) and Konami code detection.
 */
export function initKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    if (!getIsNavigating() && !inputSequence.length && !e.ctrlKey && !e.altKey) {
      if (["ArrowRight", "ArrowDown"].includes(e.key)) navigateNext();
      if (["ArrowLeft", "ArrowUp"].includes(e.key)) navigatePrev();
    }
    inputSequence.push(e.key);
    if (inputSequence.length > APP_CONFIG.SECRET_SEQUENCE.length)
      inputSequence.shift();
    if (
      JSON.stringify(inputSequence) ===
      JSON.stringify(APP_CONFIG.SECRET_SEQUENCE)
    ) {
      activateMatrixMode();
      inputSequence = [];
    }
  });
}

/**
 * Touch swipe navigation for mobile.
 */
export function initSwipe() {
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
      if (getIsNavigating()) return;
      const dx = tx - e.changedTouches[0].screenX;
      const dy = ty - e.changedTouches[0].screenY;
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 2)
        dx > 0 ? navigateNext() : navigatePrev();
    },
    { passive: true }
  );
}
