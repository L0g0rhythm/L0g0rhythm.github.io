export function initCardTilt() {
  const scene = document.querySelector(".scene-container");
  const card = document.getElementById("profile-card");
  if (!scene || !card) return;

  const maxTilt = 2;

  scene.addEventListener("mousemove", (e) => {
    const rect = scene.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    const tiltX = mouseY * -maxTilt * 2;
    const tiltY = mouseX * maxTilt * 2;
    const glareX = (1 - (e.clientX - rect.left) / rect.width) * 100;
    const glareY = (1 - (e.clientY - rect.top) / rect.height) * 100;

    requestAnimationFrame(() => {
      card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      card.style.setProperty("--glare-x", `${glareX}%`);
      card.style.setProperty("--glare-y", `${glareY}%`);
    });
  });

  scene.addEventListener("mouseenter", () => {
    card.style.setProperty("--glare-opacity", "1");
  });

  scene.addEventListener("mouseleave", () => {
    requestAnimationFrame(() => {
      card.style.transform = "rotateX(0deg) rotateY(0deg)";
      card.style.setProperty("--glare-opacity", "0");
    });
  });
}
