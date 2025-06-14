/*
 * Componente: Efeito de Inclinação 3D com Brilho Físico Realista
 */

export function initCardTilt() {
  // O 'scene-container' é o nosso palco 3D e a área de detecção do mouse.
  const scene = document.querySelector(".scene-container");

  // O 'profile-card' é o elemento que realmente irá se mover.
  const card = document.getElementById("profile-card");

  // Verificação para garantir que os elementos existem antes de continuar.
  if (!scene || !card) {
    console.error(
      "Tilt effect requires .scene-container and #profile-card to exist."
    );
    return;
  }

  const maxTilt = 2; // Ângulo máximo de inclinação para um efeito sutil.

  scene.addEventListener("mousemove", (e) => {
    const rect = scene.getBoundingClientRect();

    // Posição do mouse normalizada dentro do card (de -0.5 a 0.5)
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5;

    // Calcula a inclinação com base na posição do mouse
    const tiltX = mouseY * -maxTilt * 2;
    const tiltY = mouseX * maxTilt * 2;

    // Calcula a FÍSICA DO REFLEXO:
    // O brilho se posiciona no lado OPOSTO ao do mouse para simular um reflexo.
    const glareX = mouseX * -100 + 50;
    const glareY = mouseY * -100 + 50;

    // Otimiza a animação para rodar no momento ideal do navegador.
    requestAnimationFrame(() => {
      // Aplica a inclinação 3D ao card
      card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

      // Define as variáveis CSS que o pseudo-elemento ::before irá usar
      card.style.setProperty("--glare-x", `${glareX}%`);
      card.style.setProperty("--glare-y", `${glareY}%`);
    });
  });

  // Mostra o brilho quando o mouse entra na área
  scene.addEventListener("mouseenter", () => {
    card.style.setProperty("--glare-opacity", "1");
  });

  // Esconde o brilho e reseta a inclinação quando o mouse sai
  scene.addEventListener("mouseleave", () => {
    requestAnimationFrame(() => {
      card.style.transform = "rotateX(0deg) rotateY(0deg)";
      card.style.setProperty("--glare-opacity", "0");
    });
  });
}
