/* ARQUIVO: js/components/visualizer.js */

import { audioSystem } from "../core/audioSynth.js";

export function initAudioVisualizer() {
  const canvas = document.getElementById("audio-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const analyser = audioSystem.analyser;
  const dataArray = audioSystem.dataArray;

  // Ajusta tamanho interno do canvas para nitidez
  canvas.width = 40;
  canvas.height = 20;

  function draw() {
    requestAnimationFrame(draw);

    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Se o áudio estiver mudo, desenha linha flat ou ícone de mute estático
    if (!audioSystem.enabled) {
      // O ícone de mute é controlado via HTML/CSS
      ctx.fillStyle = "rgba(255, 71, 87, 0.5)"; // Vermelho apagado
      ctx.fillRect(0, 9, canvas.width, 2);
      return;
    }

    // Pega os dados de frequência atuais
    analyser.getByteFrequencyData(dataArray);

    // Configura estilo das barras
    ctx.fillStyle = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent-primary")
      .trim();

    const barWidth = (canvas.width / dataArray.length) * 2.5;
    let barHeight;
    let x = 0;

    // Desenha as barras
    for (let i = 0; i < dataArray.length; i++) {
      // Normaliza a altura (os valores vêm de 0 a 255)
      barHeight = (dataArray[i] / 255) * canvas.height * 1.5;

      // Garante uma altura mínima para parecer "vivo" mesmo em silêncio
      if (barHeight < 2) barHeight = 2;

      // Centraliza verticalmente
      const y = (canvas.height - barHeight) / 2;

      ctx.fillRect(x, y, barWidth, barHeight);

      x += barWidth + 1;
    }
  }

  draw();
}

