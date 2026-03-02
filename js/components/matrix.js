/* FILE: js/components/matrix.js */

export function startMatrixEffect() {
  const canvas = document.createElement("canvas");
  canvas.id = "matrix-overlay";
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.zIndex = "99999";
  canvas.style.pointerEvents = "none";
  canvas.style.opacity = "0";
  canvas.style.transition = "opacity 1s ease";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);

  // Character set: Katakana + Latin + Digits
  const chars =
    "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charArray = chars.split("");

  const fontSize = 14;
  const columns = window.innerWidth / fontSize;
  const drops = [];

  for (let x = 0; x < columns; x++) {
    drops[x] = 1;
  }

  requestAnimationFrame(() => (canvas.style.opacity = "0.8"));

  function draw() {
    // Semi-transparent black overlay creates trailing effect
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    ctx.fillStyle = "#0F0";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
      const text = charArray[Math.floor(Math.random() * charArray.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > window.innerHeight && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }

    if (canvas.dataset.active === "true") {
      requestAnimationFrame(draw);
    }
  }

  canvas.dataset.active = "true";
  draw();

  // Auto-destroy after 10s to avoid navigation interference
  setTimeout(() => {
    canvas.style.opacity = "0";
    setTimeout(() => {
      canvas.dataset.active = "false";
      canvas.remove();
    }, 1000);
  }, 10000);
}
