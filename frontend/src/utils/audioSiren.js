let activeAudioCtx = null;
let activeOscillator = null;

export function triggerEmergencySiren(zoneName, onEndCallback) {
  const alertMessage = `EMERGENCY SOS ALERT ACTIVATED! ALL FIRST RESPONDERS DISPATCHED TO RED HAZARD ZONE: ${zoneName}! EVACUATE IMMEDIATE AREA NOW!`;

  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      if (activeAudioCtx) {
        try { activeAudioCtx.close(); } catch (e) { }
      }
      activeAudioCtx = new AudioCtx();
      const osc = activeAudioCtx.createOscillator();
      const gainNode = activeAudioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, activeAudioCtx.currentTime);

      for (let i = 0; i < 3; i++) {
        osc.frequency.exponentialRampToValueAtTime(1400, activeAudioCtx.currentTime + 0.4 + i * 0.8);
        osc.frequency.exponentialRampToValueAtTime(600, activeAudioCtx.currentTime + 0.8 + i * 0.8);
      }

      gainNode.gain.setValueAtTime(0.35, activeAudioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, activeAudioCtx.currentTime + 2.5);

      osc.connect(gainNode);
      gainNode.connect(activeAudioCtx.destination);

      osc.start();
      osc.stop(activeAudioCtx.currentTime + 2.5);
      activeOscillator = osc;
    }
  } catch (e) {
    console.warn('Web Audio Context initialization restricted by browser.');
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(alertMessage);
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    utterance.volume = 1.0;
    utterance.onend = () => {
      if (typeof onEndCallback === 'function') onEndCallback();
    };
    utterance.onerror = () => {
      if (typeof onEndCallback === 'function') onEndCallback();
    };
    window.speechSynthesis.speak(utterance);
  } else {
    setTimeout(() => {
      if (typeof onEndCallback === 'function') onEndCallback();
    }, 3000);
  }

  return alertMessage;
}

export function stopEmergencySiren() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  if (activeAudioCtx) {
    try {
      activeAudioCtx.close();
      activeAudioCtx = null;
    } catch (e) { }
  }
}