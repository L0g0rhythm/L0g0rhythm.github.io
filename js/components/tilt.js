/* ARQUIVO: js/components/tilt.js */
export function initTiltEffect() {
  const cards = document.querySelectorAll(
    ".service-card, .project-row, .about-container"
  );

  cards.forEach((card) => {
    // Verifica se já existe um listener ativo neste elemento para evitar empilhamento
    // (Memory Leak / Performance Drain)
    if (card.dataset.tiltActive === "true") return;
    card.dataset.tiltActive = "true";

    let ticking = false;

    card.addEventListener("mousemove", (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          applyTilt(card, e.clientX, e.clientY);
          ticking = false;
        });
        ticking = true;
      }
    });

    card.addEventListener("mouseleave", () => {
      // Reset
      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
      card.style.background = "rgba(10, 10, 14, 0.6)";
      card.style.borderColor = "rgba(255, 255, 255, 0.05)";
    });
  });
}

function applyTilt(card, mouseX, mouseY) {
  const rect = card.getBoundingClientRect();
  const x = mouseX - rect.left;
  const y = mouseY - rect.top;

  // Calcula rotação sutil
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = ((y - centerY) / centerY) * -2; // Max 2deg
  const rotateY = ((x - centerX) / centerX) * 2;

  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;

  // Efeito de brilho dinâmico (Glare)
  card.style.background = `
    radial-gradient(
      circle at ${x}px ${y}px,
      rgba(157, 78, 221, 0.15),
      transparent 60%
    ),
    rgba(10, 10, 15, 0.8)
  `;

  card.style.borderColor = "rgba(157, 78, 221, 0.5)";
}
