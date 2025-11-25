/* ARQUIVO: js/core/audioSynth.js */

let audioCtx = null;
let analyser = null;

export const audioSystem = {
  enabled: true,
  analyser: null,

  initContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;

      const masterGain = audioCtx.createGain();
      masterGain.gain.value = 0.8; // Master boost
      masterGain.connect(audioCtx.destination);

      analyser.connect(masterGain);
      this.analyser = analyser;

      //console.log(":: AUDIO SYNTH :: Context Created (Tactical Mode)");
    }

    if (audioCtx.state === "suspended") {
      audioCtx.resume().catch((e) => console.warn("Audio resume blocked:", e));
    }
  },

  playHover() {
    if (!this.enabled) return;
    this.initContext();
    // Volume ajustado: 0.01 -> 0.05 (Audível, mas sutil)
    // Frequência: Um pouco mais "brilhante" (400->600Hz) para clareza
    this.createTone(400, 600, "sine", 0.05, 0.08);
  },

  playClick() {
    if (!this.enabled) return;
    this.initContext();
    // Volume ajustado: 0.03 -> 0.1 (Feedback tátil claro)
    this.createTone(300, 100, "sine", 0.1, 0.15);
  },

  createTone(startFreq, endFreq, type, volume, duration) {
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const noteGain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(startFreq, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(
        endFreq,
        audioCtx.currentTime + duration
      );

      noteGain.gain.setValueAtTime(0, audioCtx.currentTime);
      noteGain.gain.linearRampToValueAtTime(
        volume,
        audioCtx.currentTime + 0.01
      );
      noteGain.gain.linearRampToValueAtTime(
        0.001,
        audioCtx.currentTime + duration
      );

      osc.connect(noteGain);
      noteGain.connect(analyser);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);

      osc.onended = () => {
        osc.disconnect();
        noteGain.disconnect();
      };
    } catch (e) {
      console.error("Audio error:", e);
    }
  },

  init() {
    const unlockAudio = () => {
      this.initContext();
      if (audioCtx && audioCtx.state === "running") {
        document.removeEventListener("click", unlockAudio);
        document.removeEventListener("keydown", unlockAudio);
        document.removeEventListener("touchstart", unlockAudio);
      }
    };
    document.addEventListener("click", unlockAudio);
    document.addEventListener("keydown", unlockAudio);
    document.addEventListener("touchstart", unlockAudio);
  },
};
