/**
 * Goindol (Prehistorik) Retro AdLib / 8-bit Sound Engine
 * Uses Web Audio API with zero external audio asset dependencies
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.currentTrack = 'jungle';
    this.stepIndex = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopBGM();
    } else {
      this.startBGM(this.currentTrack);
    }
    return this.muted;
  }

  playTone(freq, type, duration, vol = 0.15, slideFreq = null) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideFreq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideFreq), now + duration);
    }

    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  playNoise(duration, vol = 0.2, filterFreq = 800) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
  }

  jump() {
    this.playTone(180, 'square', 0.16, 0.12, 480);
  }

  spring() {
    this.playTone(220, 'triangle', 0.28, 0.18, 880);
    setTimeout(() => this.playTone(440, 'square', 0.18, 0.12, 960), 70);
  }

  clubSwing() {
    this.playTone(240, 'sawtooth', 0.11, 0.14, 70);
  }

  groundSlam() {
    this.playNoise(0.22, 0.28, 350);
    this.playTone(110, 'triangle', 0.2, 0.25, 35);
  }

  enemyBonk() {
    this.playTone(320, 'square', 0.08, 0.18, 620);
    setTimeout(() => this.playTone(520, 'square', 0.14, 0.16, 160), 60);
  }

  axeThrow() {
    this.playTone(500, 'triangle', 0.1, 0.1, 260);
  }

  foodEat() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      setTimeout(() => this.playTone(n, 'square', 0.08, 0.12), idx * 45);
    });
  }

  secretFound() {
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((n, idx) => {
      setTimeout(() => this.playTone(n, 'triangle', 0.12, 0.16), idx * 55);
    });
  }

  playerHurt() {
    this.playTone(280, 'sawtooth', 0.28, 0.2, 75);
    this.playNoise(0.2, 0.18, 500);
  }

  bossRoar() {
    this.playNoise(0.55, 0.32, 260);
    this.playTone(95, 'sawtooth', 0.55, 0.24, 42);
  }

  dash() {
    this.playNoise(0.12, 0.14, 1400);
    this.playTone(340, 'triangle', 0.12, 0.12, 720);
  }

  powerup() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    notes.forEach((n, idx) => {
      setTimeout(() => this.playTone(n, 'triangle', 0.11, 0.15), idx * 45);
    });
  }

  explosion() {
    this.playNoise(0.38, 0.34, 420);
    this.playTone(130, 'sawtooth', 0.32, 0.24, 30);
  }

  shieldBlock() {
    this.playTone(660, 'triangle', 0.15, 0.18, 330);
    setTimeout(() => this.playTone(880, 'square', 0.12, 0.14, 440), 50);
  }

  stageClear() {
    const fanfare = [
      { f: 523.25, d: 0.14, t: 0 },
      { f: 659.25, d: 0.14, t: 140 },
      { f: 783.99, d: 0.14, t: 280 },
      { f: 1046.5, d: 0.35, t: 420 },
      { f: 783.99, d: 0.14, t: 620 },
      { f: 1046.5, d: 0.45, t: 770 },
    ];
    fanfare.forEach(note => {
      setTimeout(() => this.playTone(note.f, 'square', note.d, 0.16), note.t);
    });
  }

  startBGM(track = 'jungle') {
    this.currentTrack = track;
    this.stopBGM();
    if (this.muted) return;
    this.init();
    this.bgmPlaying = true;
    this.stepIndex = 0;

    // Prehistoric bouncy chiptune melodies for all 6 stages
    const tracks = {
      jungle: {
        tempo: 155,
        melody: [
          261.63, 329.63, 392.00, 329.63, 440.00, 392.00, 329.63, 293.66,
          261.63, 329.63, 392.00, 523.25, 493.88, 392.00, 440.00, 392.00
        ],
        bass: [
          130.81, 130.81, 196.00, 196.00, 146.83, 146.83, 196.00, 146.83,
          130.81, 130.81, 164.81, 196.00, 174.61, 196.00, 130.81, 130.81
        ]
      },
      swamp: {
        tempo: 162,
        melody: [
          293.66, 349.23, 440.00, 392.00, 349.23, 329.63, 293.66, 261.63,
          293.66, 349.23, 440.00, 523.25, 466.16, 440.00, 392.00, 349.23
        ],
        bass: [
          146.83, 146.83, 174.61, 174.61, 130.81, 130.81, 146.83, 110.00,
          146.83, 146.83, 174.61, 196.00, 174.61, 164.81, 146.83, 146.83
        ]
      },
      cave: {
        tempo: 170,
        melody: [
          220.00, 0, 261.63, 246.94, 220.00, 329.63, 293.66, 261.63,
          196.00, 0, 246.94, 220.00, 196.00, 261.63, 246.94, 220.00
        ],
        bass: [
          110.00, 110.00, 164.81, 110.00, 130.81, 130.81, 146.83, 130.81,
          98.00, 98.00, 146.83, 98.00, 110.00, 130.81, 123.47, 110.00
        ]
      },
      ice: {
        tempo: 148,
        melody: [
          329.63, 392.00, 493.88, 523.25, 493.88, 392.00, 440.00, 329.63,
          293.66, 349.23, 440.00, 493.88, 440.00, 392.00, 329.63, 293.66
        ],
        bass: [
          164.81, 164.81, 196.00, 196.00, 146.83, 146.83, 164.81, 130.81,
          146.83, 146.83, 174.61, 174.61, 130.81, 146.83, 164.81, 164.81
        ]
      },
      desert: {
        tempo: 144,
        melody: [
          220.00, 233.08, 277.18, 293.66, 329.63, 277.18, 233.08, 220.00,
          293.66, 329.63, 349.23, 329.63, 277.18, 233.08, 220.00, 196.00
        ],
        bass: [
          110.00, 110.00, 146.83, 110.00, 116.54, 116.54, 138.59, 110.00,
          110.00, 146.83, 116.54, 110.00, 98.00, 110.00, 110.00, 110.00
        ]
      },
      volcano: {
        tempo: 138,
        melody: [
          196.00, 233.08, 293.66, 261.63, 233.08, 196.00, 293.66, 349.23,
          329.63, 293.66, 261.63, 233.08, 196.00, 233.08, 261.63, 293.66
        ],
        bass: [
          98.00, 98.00, 116.54, 98.00, 110.00, 110.00, 130.81, 110.00,
          98.00, 98.00, 130.81, 116.54, 98.00, 87.31, 98.00, 98.00
        ]
      },
      sky: {
        tempo: 142,
        melody: [
          392.00, 440.00, 493.88, 587.33, 659.25, 587.33, 493.88, 440.00,
          392.00, 493.88, 587.33, 783.99, 659.25, 587.33, 493.88, 587.33
        ],
        bass: [
          196.00, 196.00, 246.94, 246.94, 164.81, 164.81, 196.00, 146.83,
          196.00, 196.00, 220.00, 246.94, 174.61, 196.00, 146.83, 196.00
        ]
      },
      boss: {
        tempo: 130,
        melody: [
          164.81, 174.61, 164.81, 220.00, 164.81, 174.61, 246.94, 233.08,
          164.81, 174.61, 164.81, 293.66, 261.63, 246.94, 220.00, 196.00
        ],
        bass: [
          82.41, 82.41, 87.31, 82.41, 82.41, 87.31, 110.00, 98.00,
          82.41, 82.41, 87.31, 82.41, 110.00, 98.00, 87.31, 82.41
        ]
      }
    };

    const selected = tracks[track] || tracks.jungle;

    this.bgmTimer = setInterval(() => {
      if (!this.bgmPlaying || this.muted) return;
      const idx = this.stepIndex % selected.melody.length;
      const mFreq = selected.melody[idx];
      const bFreq = selected.bass[idx];

      if (mFreq > 0) {
        this.playTone(mFreq, 'square', 0.11, 0.045);
      }
      if (bFreq > 0) {
        this.playTone(bFreq, 'triangle', 0.14, 0.06);
      }
      if (idx % 4 === 2) {
        this.playNoise(0.04, 0.035, 1200);
      }
      this.stepIndex++;
    }, selected.tempo);
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

window.soundEngine = new SoundEngine();
