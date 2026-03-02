/* FILE: js/components/render/typewriter.js */

/**
 * TypeWriter effect: reveals text character by character.
 * Clears previous animation to prevent memory leaks and collision.
 * Attached to window for cross-module accessibility.
 */
export function initTypeWriter(text, element, speed) {
  if (!element) return;

  if (element.dataset.typeWriterId) {
    clearTimeout(parseInt(element.dataset.typeWriterId));
  }

  let i = 0;
  element.textContent = "";

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      const timerId = setTimeout(type, speed);
      element.dataset.typeWriterId = timerId.toString();
    } else {
      delete element.dataset.typeWriterId;
    }
  }
  type();
}

// Global binding for cross-module access
window.initTypeWriter = initTypeWriter;
