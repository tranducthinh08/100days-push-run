/**
 * Web Audio API synthesizer for offline instant feedback.
 * No external mp3 files required.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playBeep(freq = 880, durationSec = 0.08, type: OscillatorType = 'sine'): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSec);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + durationSec);
  } catch (err) {
    console.warn('Audio play error:', err);
  }
}

export function playSetCompleteSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [659.25, 880]; // E5 -> A5
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playBeep(freq, 0.12, 'triangle');
      }, idx * 120);
    });
  } catch (err) {
    console.warn('Set complete audio error:', err);
  }
}

export function playTimerEndSound(): void {
  try {
    const notes = [587.33, 659.25, 880]; // D5 -> E5 -> A5
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playBeep(freq, 0.15, 'sine');
      }, idx * 140);
    });
  } catch (err) {
    console.warn('Timer end audio error:', err);
  }
}

export function playWhistleSound(): void {
  playBeep(1200, 0.15, 'triangle');
}

export function playIntervalPhaseSound(phase: 'work' | 'recovery'): void {
  if (phase === 'work') {
    // High alert beep
    playBeep(880, 0.2, 'square');
  } else {
    // Low recovery chime
    playBeep(440, 0.25, 'sine');
  }
}
