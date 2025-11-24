/* ARQUIVO: js/core/audioManager.js */
export const audioSystem = {
  sounds: {
    hover: new Audio("./assets/sounds/hover.mp3"),
    click: new Audio("./assets/sounds/click.mp3"),
    boot: new Audio("./assets/sounds/boot.mp3"),
  },

  init() {
    // Configura volume baixo para não irritar
    Object.values(this.sounds).forEach((s) => (s.volume = 0.2));

    // Hover em links e botões
    document
      .querySelectorAll("a, button, .nav-links li, .service-card")
      .forEach((el) => {
        el.addEventListener("mouseenter", () => this.play("hover"));
        el.addEventListener("click", () => this.play("click"));
      });
  },

  play(type) {
    if (this.sounds[type]) {
      this.sounds[type].currentTime = 0;
      this.sounds[type].play().catch(() => {}); // Ignora erro se usuário não interagiu ainda
    }
  },
};
