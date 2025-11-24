/* FILE: js/components/particles.js */

/**
 * @file particles.js
 * @description Lightweight particle system with performance throttling.
 */

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
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Optimized Storage (TypedArray is overkill here, standard array is fine for <100 particles)
  const particles = [];

  // Throttling State
  let lastMouseMoveTime = 0;
  const PARTICLE_THROTTLE_MS = 50; // Max creation 20 times per second

  // Resize Handler
  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Mouse Handler with Throttle
  document.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastMouseMoveTime > PARTICLE_THROTTLE_MS) {
      createParticles(e.clientX, e.clientY);
      lastMouseMoveTime = now;
    }
  });

  function createParticles(x, y) {
    // Reduced count per emission for cleaner look
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

    // Backward loop allows safe removal during iteration
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      // Optimization: Skip rendering invisible particles
      if (p.life <= 0.01) {
        particles.splice(i, 1);
        continue;
      }

      ctx.fillStyle = `rgba(${p.color}, ${p.life})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      p.x += p.speedX;
      p.y += p.speedY;
      p.life -= 0.02; // Decay rate
      p.size *= 0.95; // Shrink
    }

    requestAnimationFrame(animate);
  }

  animate();
}
