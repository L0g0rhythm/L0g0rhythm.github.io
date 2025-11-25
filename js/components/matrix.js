/* ARQUIVO: js/components/matrix.js */

export function startMatrixEffect() {
  // Cria o Canvas
  const canvas = document.createElement("canvas");
  canvas.id = "matrix-overlay";
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.zIndex = "99999"; // Acima de tudo
  canvas.style.pointerEvents = "none"; // Permite clicar através
  canvas.style.opacity = "0";
  canvas.style.transition = "opacity 1s ease";
  document.body.appendChild(canvas);

  // Configuração do Contexto
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Caracteres (Katakana + Latino + Números)
  const chars =
    "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charArray = chars.split("");

  const fontSize = 14;
  const columns = canvas.width / fontSize;
  const drops = [];

  // Inicializa as gotas
  for (let x = 0; x < columns; x++) {
    drops[x] = 1;
  }

  // Fade In
  requestAnimationFrame(() => (canvas.style.opacity = "0.8"));

  function draw() {
    // Fundo preto com transparência para criar rastro
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#0F0"; // Verde Hacker
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
      const text = charArray[Math.floor(Math.random() * charArray.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      // Reseta a gota aleatoriamente ou se sair da tela
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
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

  // Auto-destruição após 10 segundos para não atrapalhar a navegação
  setTimeout(() => {
    canvas.style.opacity = "0";
    setTimeout(() => {
      canvas.dataset.active = "false";
      canvas.remove();
    }, 1000);
  }, 10000);
}

