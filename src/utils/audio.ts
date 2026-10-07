/**
 * Web Audio API synthesizer for emergency sirens and operational tones.
 * Complies with strict browser autoplay policies via explicit user activation.
 */

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Authentic Emergency Alert System (EAS) Dual Attention Tone
   * Broadcast standard: 853 Hz and 960 Hz played simultaneously.
   */
  public playEASTone(durationSeconds: number = 2.5) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.exponentialRampToValueAtTime(0.18, now + 0.05);
    masterGain.gain.setValueAtTime(0.18, now + durationSeconds - 0.1);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);
    masterGain.connect(ctx.destination);

    // Osc 1: 853 Hz (Sine)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(853, now);
    osc1.connect(masterGain);
    osc1.start(now);
    osc1.stop(now + durationSeconds);

    // Osc 2: 960 Hz (Sine)
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(960, now);
    osc2.connect(masterGain);
    osc2.start(now);
    osc2.stop(now + durationSeconds);
  }

  /**
   * SOS Morse code acoustic beacon: ... --- ... (short short short, long long long, short short short)
   */
  public playSOSMorseBeacon() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const dotLen = 0.09;
    const dashLen = 0.24;
    const elemGap = 0.06;

    // Pattern: 3 dots, 3 dashes, 3 dots
    const timings = [
      dotLen, dotLen, dotLen,
      dashLen, dashLen, dashLen,
      dotLen, dotLen, dotLen
    ];

    let t = now + 0.05;
    timings.forEach((duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(750, t);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.01);
      gain.gain.setValueAtTime(0.12, t + duration - 0.01);
      gain.gain.linearRampToValueAtTime(0.0001, t + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + duration);

      t += duration + elemGap;
    });
  }

  /**
   * Quick confirmation dispatch radio squawk
   */
  public playDispatchChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  /**
   * Resolved / All-Clear pleasant dual chime
   */
  public playAllClearChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [440, 660, 880].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + idx * 0.1;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.08, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.4);
    });
  }
}

export const soundManager = new SoundEffectsManager();
