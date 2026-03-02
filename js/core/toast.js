/* FILE: js/core/toast.js */

let toastTimer = null;

/**
 * Displays a system notification toast at the bottom of the screen.
 * Creates the DOM element lazily on first call.
 */
export function showSystemToast(msg) {
  let toast = document.querySelector(".system-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "system-toast";
    toast.innerHTML = `<i class="fas fa-terminal"></i> <span class="toast-msg"></span>`;
    document.body.appendChild(toast);
  }
  toast.querySelector(".toast-msg").textContent = msg;
  toast.classList.remove("show");
  void toast.offsetWidth;
  toast.classList.add("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 4000);
}
