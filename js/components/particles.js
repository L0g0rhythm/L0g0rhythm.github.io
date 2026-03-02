/* FILE: js/components/particles.js */

export function initParticles() {
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  let width, height;

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  resizeCanvas();

  const particles = [];

  let lastMouseMoveTime = 0;
  const PARTICLE_THROTTLE_MS = 50;

  window.addEventListener("resize", resizeCanvas);

  document.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastMouseMoveTime > PARTICLE_THROTTLE_MS) {
      createParticles(e.clientX, e.clientY);
      lastMouseMoveTime = now;
    }
  });

  function createParticles(x, y) {
    for (let i = 0; i < 2; i++) {
      particles.push({
        x: x,
        y: y,
        size: Math.random() * 2 + 1,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1,
        life: 1.0,
        color: Math.random() > 0.5 ? "157, 78, 221" : "255, 255, 255",
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Swap-and-pop removal: O(1) per element instead of O(n) splice
    let len = particles.length;
    for (let i = len - 1; i >= 0; i--) {
      const p = particles[i];

      if (p.life <= 0.01) {
        particles[i] = particles[len - 1];
        particles.pop();
        len--;
        continue;
      }

      ctx.fillStyle = `rgba(${p.color}, ${p.life})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      p.x += p.speedX;
      p.y += p.speedY;
      p.life -= 0.02;
      p.size *= 0.95;
    }

    requestAnimationFrame(animate);
  }

  animate();
}
