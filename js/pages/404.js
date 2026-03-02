/* FILE: js/pages/404.js */

import { audioSystem } from "../core/audioSynth.js";

document.addEventListener("DOMContentLoaded", () => {
  // Theme Restoration
  const savedTheme = localStorage.getItem("userTheme");
  if (savedTheme) {
    document.documentElement.style.setProperty("--accent-primary", savedTheme);
  }

  // Audio Subsystem Initialization
  const unlockAudio = () => {
    if (audioSystem.analyser?.context.state === "suspended") {
      audioSystem.analyser.context.resume();
    }
    audioSystem.initContext();

    document.removeEventListener("click", unlockAudio);
    document.removeEventListener("keydown", unlockAudio);
  };

  document.addEventListener("click", unlockAudio);
  document.addEventListener("keydown", unlockAudio);

  // Audio Bind on Return Button
  const btn = document.getElementById("return-btn");
  if (btn) {
    btn.addEventListener("mouseenter", () => {
      if (audioSystem.enabled) audioSystem.playHover();
    });

    btn.addEventListener("click", () => {
      if (audioSystem.enabled) audioSystem.playClick();
    });
  }
});
