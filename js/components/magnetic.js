/* ARQUIVO: js/components/magnetic.js */

/**
 * @file magnetic.js
 * @description Magnetic UI effect for buttons.
 * REFACTOR: Optimized using RAF and Cached Rects to eliminate Layout Thrashing.
 * @version 2.0.0-60FPS
 */

export function initMagneticEffect() {
  const magnets = document.querySelectorAll(
    ".dock-icon, .mobile-cta, .sound-control, .nav-links li"
  );

  magnets.forEach((magnet) => {
    let rect = null;
    let isHovering = false;

    // 1. Pre-calculate geometry ONLY on entry (Performance Win)
    magnet.addEventListener("mouseenter", () => {
      rect = magnet.getBoundingClientRect();
      isHovering = true;
    });

    magnet.addEventListener("mousemove", (e) => {
      if (!isHovering || !rect) return;

      // 2. Physics Logic (Lightweight)
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      // 3. Render via RAF (VSync Aligned)
      requestAnimationFrame(() => {
        magnet.style.transform = `translate(${x / 3}px, ${y / 3}px)`;
        magnet.style.transition = "transform 0.1s ease-out";
      });
    });

    magnet.addEventListener("mouseleave", () => {
      isHovering = false;
      requestAnimationFrame(() => {
        magnet.style.transform = "translate(0, 0)";
        magnet.style.transition =
          "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)";
      });
    });

    // Resize Observer to invalidate cache if layout changes
    window.addEventListener("resize", () => {
      rect = null;
    });
  });
}
// enregion
