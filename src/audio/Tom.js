/**
 * Tom Drum Synthesizer
 * Sine/triangle oscillator with pitch envelope and medium decay
 */
import { audioEngine } from './AudioEngine.js';

export class Tom {
  constructor() {
    this.params = {
      // Pitch envelope
      startFreq: 200,      // Starting frequency (Hz)
      endFreq: 100,        // Ending frequency (Hz)
      pitchDecay: 0.08,    // Pitch envelope decay time (seconds)
      
      // Amplitude envelope
      attack: 0.005,       // Attack time (seconds)
      decay: 0.25,         // Decay time (seconds)
      
      // Waveform
      waveform: 'sine',    // 'sine' or 'triangle'
      
      // Tone
      volume: 0.75,        // Overall volume (0-1)
      body: 0.5,           // Low-frequency body amount (0-1)
      
      // Filter (optional tone shaping)
      filterFreq: 2000,    // Low-pass cutoff (Hz)
    };
  }

  /**
   * Trigger the tom drum sound
   */
  trigger(time = null) {
    const ctx = audioEngine.context;
    if (!ctx) return;

    const now = time ?? ctx.currentTime;
    const { 
      startFreq, endFreq, pitchDecay, 
      attack, decay, waveform, volume, body, filterFreq 
    } = this.params;

    // === MAIN OSCILLATOR ===
    const osc = ctx.createOscillator();
    osc.type = waveform;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(endFreq, 20), 
      now + pitchDecay
    );

    // Main envelope
    const mainGain = ctx.createGain();
    mainGain.gain.setValueAtTime(0, now);
    mainGain.gain.linearRampToValueAtTime(volume, now + attack);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + attack + decay);

    // Low-pass filter for tone shaping
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = filterFreq;
    filter.Q.value = 0.7;

    osc.connect(filter);
    filter.connect(mainGain);

    // === BODY (Sub) OSCILLATOR ===
    let subOsc = null;
    let subGain = null;
    
    if (body > 0) {
      subOsc = ctx.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(startFreq * 0.5, now);
      subOsc.frequency.exponentialRampToValueAtTime(
        Math.max(endFreq * 0.5, 20), 
        now + pitchDecay * 1.2
      );

      subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0, now);
      subGain.gain.linearRampToValueAtTime(volume * body * 0.6, now + attack);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + attack + decay * 1.2);

      subOsc.connect(subGain);
      subGain.connect(audioEngine.masterGain);
    }

    // === ATTACK TRANSIENT ===
    const clickOsc = ctx.createOscillator();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(startFreq * 3, now);
    clickOsc.frequency.exponentialRampToValueAtTime(startFreq, now + 0.015);

    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(volume * 0.3, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    clickOsc.connect(clickGain);
    clickGain.connect(audioEngine.masterGain);

    // Connect main to output
    mainGain.connect(audioEngine.masterGain);

    // Start and stop
    const maxDuration = attack + decay * 1.3 + 0.1;
    
    osc.start(now);
    osc.stop(now + maxDuration);
    
    clickOsc.start(now);
    clickOsc.stop(now + 0.03);

    if (subOsc) {
      subOsc.start(now);
      subOsc.stop(now + maxDuration);
    }

    // Cleanup
    osc.onended = () => {
      osc.disconnect();
      filter.disconnect();
      mainGain.disconnect();
    };

    clickOsc.onended = () => {
      clickOsc.disconnect();
      clickGain.disconnect();
    };

    if (subOsc) {
      subOsc.onended = () => {
        subOsc.disconnect();
        subGain.disconnect();
      };
    }
  }

  /**
   * Get parameter definitions for UI generation
   */
  static getParamDefinitions() {
    return [
      {
        group: 'pitch',
        groupLabel: 'Pitch Envelope',
        groupInfo: 'pitchEnvelope',
        params: [
          { key: 'startFreq', label: 'Start', min: 100, max: 500, unit: 'Hz', info: 'pitchStart' },
          { key: 'endFreq', label: 'End', min: 40, max: 300, unit: 'Hz', info: 'pitchEnd' },
          { key: 'pitchDecay', label: 'Decay', min: 0.02, max: 0.2, unit: 's', info: 'pitchDecay' },
        ]
      },
      {
        group: 'amp',
        groupLabel: 'Amplitude',
        groupInfo: 'amplitudeEnvelope',
        params: [
          { key: 'attack', label: 'Attack', min: 0.001, max: 0.05, unit: 's', info: 'attack' },
          { key: 'decay', label: 'Decay', min: 0.1, max: 0.8, unit: 's', info: 'decay' },
          { key: 'volume', label: 'Volume', min: 0, max: 1, unit: '', info: 'amplitude' },
        ]
      },
      {
        group: 'tone',
        groupLabel: 'Tone',
        groupInfo: 'oscillator',
        params: [
          { key: 'body', label: 'Body', min: 0, max: 1, unit: '', info: 'body' },
          { key: 'filterFreq', label: 'Tone', min: 500, max: 5000, unit: 'Hz', info: 'cutoff' },
        ]
      }
    ];
  }
}
