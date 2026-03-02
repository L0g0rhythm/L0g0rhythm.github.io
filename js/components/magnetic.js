/* FILE: js/components/magnetic.js */

export function initMagneticEffect() {
  const magnets = document.querySelectorAll(
    ".dock-icon, .mobile-cta, .sound-control, .nav-links li"
  );

  magnets.forEach((magnet) => {
    let rect = null;
    let isHovering = false;

    // Pre-calculate geometry only on entry (avoids per-frame layout thrash)
    magnet.addEventListener("mouseenter", () => {
      rect = magnet.getBoundingClientRect();
      isHovering = true;
    });

    magnet.addEventListener("mousemove", (e) => {
      if (!isHovering || !rect) return;

      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      // VSync-aligned render via requestAnimationFrame
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

    // Invalidate cached geometry on layout change
    window.addEventListener("resize", () => {
      rect = null;
    });
  });
}
