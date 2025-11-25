/* ARQUIVO: js/components/hackerText.js */

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

export function initHackerEffect() {
  const targets = document.querySelectorAll(
    ".nav-links li, .mobile-links a, .about-data h2, .section-header h2, .hero-title"
  );

  // 1. Observer: Dispara o efeito apenas quando o elemento entra na tela
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          // Reinicia o efeito sempre que aparecer (comportamento "vivo")
          // Se quiser que rode apenas uma vez, descomente a linha abaixo:
          // observer.unobserve(el);
          runEffect(el);
        }
      });
    },
    { threshold: 0.5 } // Dispara quando 50% do elemento estiver visível
  );

  targets.forEach((element) => {
    // Evita múltiplos bindings (Memory Leak Prevention)
    if (element.dataset.hackerBound === "true") return;
    element.dataset.hackerBound = "true";

    // Cache do estado original (Defense in Depth contra perda de dados)
    if (!element.dataset.originalHtml) {
      element.dataset.originalHtml = element.innerHTML;
      element.dataset.originalText = element.innerText; // Cache puro do texto
    }

    // Interatividade: Mouseover
    element.addEventListener("mouseover", () => runEffect(element));

    // Auto-run: Delega para o Observer em vez de rodar cego
    // Aplica-se a H2 (títulos de seção) e ao Título Hero
    if (element.tagName === "H2" || element.classList.contains("hero-title")) {
      observer.observe(element);
    }
  });
}

/**
 * Core logic for the scramble effect.
 * Optimized to use Cached Text and prevent interval collision.
 */
function runEffect(el) {
  const originalText = el.dataset.originalText || el.innerText;

  // Limpa animação anterior se houver (Thread Safety)
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
      // Restaura o HTML original para recuperar cores/spans (ex: <span class="accent">)
      if (el.dataset.originalHtml) {
        el.innerHTML = el.dataset.originalHtml;
      }
    }

    // Aceleração não-linear para sensação orgânica
    iterations += 1 / 3;
  }, 30);
}
