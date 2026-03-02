/* FILE: js/core/scrollObserver.js */

/**
 * Creates an IntersectionObserver to add 'in-view' class
 * when elements scroll into the viewport (entry animations).
 */
export function initScrollObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  window.observeElements = () => {
    document
      .querySelectorAll(".service-card, .project-row, .spec-item, .bio-text")
      .forEach((el) => observer.observe(el));
  };
}
