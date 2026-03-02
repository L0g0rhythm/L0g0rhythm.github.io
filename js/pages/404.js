/* FILE: js/pages/404.js */

document.addEventListener("DOMContentLoaded", () => {
  // Theme Restoration
  const savedTheme = localStorage.getItem("userTheme");
  if (savedTheme) {
    document.documentElement.style.setProperty("--accent-primary", savedTheme);
  }
});
