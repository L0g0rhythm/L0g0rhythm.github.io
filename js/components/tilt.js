/* FILE: js/components/tilt.js */

export function initTiltEffect() {
  const cards = document.querySelectorAll(
    ".service-card, .project-row, .about-container"
  );

  // Read accent color from CSS variable for theme-awareness
  const accentColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--accent-primary")
    .trim() || "#9d4edd";

  cards.forEach((card) => {
    // Prevent listener stacking (memory leak / performance drain)
    if (card.dataset.tiltActive === "true") return;
    card.dataset.tiltActive = "true";

    let ticking = false;

    card.addEventListener("mousemove", (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          applyTilt(card, e.clientX, e.clientY, accentColor);
          ticking = false;
        });
        ticking = true;
      }
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
      card.style.background = "rgba(10, 10, 14, 0.6)";
      card.style.borderColor = "rgba(255, 255, 255, 0.05)";
    });
  });
}

function applyTilt(card, mouseX, mouseY, accentColor) {
  const rect = card.getBoundingClientRect();
  const x = mouseX - rect.left;
  const y = mouseY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = ((y - centerY) / centerY) * -2;
  const rotateY = ((x - centerX) / centerX) * 2;

  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;

  // Dynamic glare reads from CSS variable to respect active theme
  card.style.background = `
    radial-gradient(
      circle at ${x}px ${y}px,
      ${accentColor}26,
      transparent 60%
    ),
    rgba(10, 10, 15, 0.8)
  `;

  card.style.borderColor = `${accentColor}80`;
}
