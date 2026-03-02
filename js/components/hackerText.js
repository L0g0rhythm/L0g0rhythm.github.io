/* FILE: js/components/hackerText.js */

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

export function initHackerEffect() {
  const targets = document.querySelectorAll(
    ".nav-links li, .mobile-links a, .about-data h2, .section-header h2, .hero-title"
  );

  // Observer: triggers effect only when element enters viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          runEffect(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  targets.forEach((element) => {
    // Prevent multiple bindings (memory leak prevention)
    if (element.dataset.hackerBound === "true") return;
    element.dataset.hackerBound = "true";

    // Cache original state (defense in depth against data loss)
    if (!element.dataset.originalHtml) {
      element.dataset.originalHtml = element.innerHTML;
      element.dataset.originalText = element.innerText;
    }

    element.addEventListener("mouseover", () => runEffect(element));

    // Auto-run via observer for section headers and hero title
    if (element.tagName === "H2" || element.classList.contains("hero-title")) {
      observer.observe(element);
    }
  });
}

/**
 * Core scramble effect logic.
 * Uses cached text and prevents interval collision.
 */
function runEffect(el) {
  const originalText = el.dataset.originalText || el.innerText;

  // Clear previous animation if running (thread safety)
  if (el.interval) clearInterval(el.interval);

  let iterations = 0;

  el.interval = setInterval(() => {
    el.innerText = originalText
      .split("")
      .map((letter, index) => {
        if (index < iterations) {
          return originalText[index];
        }
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      })
      .join("");

    if (iterations >= originalText.length) {
      clearInterval(el.interval);
      // Restore original HTML to recover styled spans (e.g. <span class="accent">)
      if (el.dataset.originalHtml) {
        el.innerHTML = el.dataset.originalHtml;
      }
    }

    // Non-linear acceleration for organic feel
    iterations += 1 / 3;
  }, 30);
}
