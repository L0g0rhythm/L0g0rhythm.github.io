/* FILE: js/core/audioUnlock.js */

import { APP_CONFIG } from "./appConfig.js";
import { audioSystem } from "./audioSynth.js";
import { showSystemToast } from "./toast.js";

/**
 * Unlocks AudioContext on first user interaction (browser security requirement).
 */
export function setupAudioUnlock() {
  const unlock = () => {
    if (audioSystem.analyser?.context.state === "suspended")
      audioSystem.analyser.context.resume();
    initAudioFeedback();
    ["click", "keydown", "touchstart"].forEach((evt) =>
      document.removeEventListener(evt, unlock)
    );
  };
  ["click", "keydown", "touchstart"].forEach((evt) =>
    document.addEventListener(evt, unlock)
  );
}

/**
 * Binds hover sound to all interactive elements.
 */
export function initAudioFeedback() {
  const elements = document.querySelectorAll(
    APP_CONFIG.SELECTORS.INTERACTIVES
  );
  elements.forEach((el) => {
    el.removeEventListener("mouseenter", handleHoverSound);
    el.addEventListener("mouseenter", handleHoverSound);
  });
}

function handleHoverSound() {
  if (audioSystem.enabled) audioSystem.playHover();
}

/**
 * Sound toggle button handler.
 */
export function initSoundToggle() {
  const btn = document.getElementById("sound-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    audioSystem.enabled = !audioSystem.enabled;
    btn.classList.toggle("muted", !audioSystem.enabled);
    btn.innerHTML = `<i class="fas ${audioSystem.enabled ? "fa-volume-up" : "fa-volume-mute"
      }"></i>`;
    if (audioSystem.enabled) {
      if (audioSystem.analyser?.context.state === "suspended")
        audioSystem.analyser.context.resume();
      audioSystem.playClick();
      showSystemToast("AUDIO: ONLINE");
    } else {
      showSystemToast("AUDIO: MUTED");
    }
  });
}
