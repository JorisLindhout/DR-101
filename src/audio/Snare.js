/**
 * Snare Drum Synthesizer
 * Combines noise (snare wires) + tone oscillator with bandpass filter
 */
import { audioEngine } from './AudioEngine.js';

export class Snare {
  constructor() {
    this.params = {
      // Tone (body)
      toneFreq: 180,       // Tone oscillator frequency (Hz)
      toneMix: 0.5,        // Mix of tone vs noise (0-1, higher = more tone)
      toneDecay: 0.1,      // Tone decay time (seconds)
      
      // Noise (snare wires)
      noiseDecay: 0.15,    // Noise decay time (seconds)
      
      // Filter
      filterFreq: 3000,    // Bandpass center frequency (Hz)
      filterQ: 1.2,        // Filter resonance/Q
      
      // Amplitude
      attack: 0.001,       // Attack time (seconds)
      volume: 0.7,         // Overall volume (0-1)
      
      // Character
      snap: 0.5,           // High-frequency snap amount (0-1)
    };

    this.noiseBuffer = null;
  }

  /**
   * Ensure noise buffer is created
   */
  ensureNoiseBuffer() {
    if (!this.noiseBuffer && audioEngine.context) {
      this.noiseBuffer = audioEngine.createNoiseBuffer(1);
    }
  }

  /**
   * Trigger the snare drum sound
   */
  trigger(time = null) {
    const ctx = audioEngine.context;
    if (!ctx) return;

    this.ensureNoiseBuffer();
    const now = time ?? ctx.currentTime;
    const { 
      toneFreq, toneMix, toneDecay, 
      noiseDecay, filterFreq, filterQ,
      attack, volume, snap 
    } = this.params;

    // === NOISE COMPONENT (Snare Wires) ===
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = this.noiseBuffer;

    // Bandpass filter for noise
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = filterFreq;
    noiseFilter.Q.value = filterQ;

    // High-pass for snap/brightness
    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 2000 + snap * 3000;

    // Noise envelope
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(volume * (1 - toneMix * 0.5), now + attack);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + attack + noiseDecay);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(highpass);
    highpass.connect(noiseGain);

    // === TONE COMPONENT (Body) ===
    const toneOsc = ctx.createOscillator();
    toneOsc.type = 'triangle';
    toneOsc.frequency.setValueAtTime(toneFreq, now);
    toneOsc.frequency.exponentialRampToValueAtTime(toneFreq * 0.5, now + toneDecay);

    // Second harmonic for body
    const toneOsc2 = ctx.createOscillator();
    toneOsc2.type = 'sine';
    toneOsc2.frequency.setValueAtTime(toneFreq * 1.5, now);
    toneOsc2.frequency.exponentialRampToValueAtTime(toneFreq * 0.8, now + toneDecay * 0.7);

    // Tone envelope
    const toneGain = ctx.createGain();
    toneGain.gain.setValueAtTime(0, now);
    toneGain.gain.linearRampToValueAtTime(volume * toneMix, now + attack);
    toneGain.gain.exponentialRampToValueAtTime(0.001, now + attack + toneDecay);

    const toneGain2 = ctx.createGain();
    toneGain2.gain.setValueAtTime(0, now);
    toneGain2.gain.linearRampToValueAtTime(volume * toneMix * 0.4, now + attack);
    toneGain2.gain.exponentialRampToValueAtTime(0.001, now + attack + toneDecay * 0.6);

    toneOsc.connect(toneGain);
    toneOsc2.connect(toneGain2);

    // === SNAP TRANSIENT ===
    const snapNoise = ctx.createBufferSource();
    snapNoise.buffer = this.noiseBuffer;

    const snapFilter = ctx.createBiquadFilter();
    snapFilter.type = 'highpass';
    snapFilter.frequency.value = 5000;

    const snapGain = ctx.createGain();
    snapGain.gain.setValueAtTime(snap * volume * 0.5, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    snapNoise.connect(snapFilter);
    snapFilter.connect(snapGain);

    // Connect to master
    noiseGain.connect(audioEngine.masterGain);
    toneGain.connect(audioEngine.masterGain);
    toneGain2.connect(audioEngine.masterGain);
    snapGain.connect(audioEngine.masterGain);

    // Start and stop
    const maxDuration = Math.max(noiseDecay, toneDecay) + attack + 0.1;
    
    noiseSource.start(now);
    noiseSource.stop(now + maxDuration);
    
    toneOsc.start(now);
    toneOsc.stop(now + maxDuration);
    
    toneOsc2.start(now);
    toneOsc2.stop(now + maxDuration);
    
    snapNoise.start(now);
    snapNoise.stop(now + 0.03);

    // Cleanup
    noiseSource.onended = () => {
      noiseSource.disconnect();
      noiseFilter.disconnect();
      highpass.disconnect();
      noiseGain.disconnect();
    };

    toneOsc.onended = () => {
      toneOsc.disconnect();
      toneGain.disconnect();
    };

    toneOsc2.onended = () => {
      toneOsc2.disconnect();
      toneGain2.disconnect();
    };

    snapNoise.onended = () => {
      snapNoise.disconnect();
      snapFilter.disconnect();
      snapGain.disconnect();
    };
  }

  /**
   * Get parameter definitions for UI generation
   */
  static getParamDefinitions() {
    return [
      {
        group: 'tone',
        groupLabel: 'Tone (Body)',
        groupInfo: 'oscillator',
        params: [
          { key: 'toneFreq', label: 'Frequency', min: 100, max: 400, unit: 'Hz', info: 'frequency' },
          { key: 'toneMix', label: 'Mix', min: 0, max: 1, unit: '', info: 'mix' },
          { key: 'toneDecay', label: 'Decay', min: 0.02, max: 0.3, unit: 's', info: 'decay' },
        ]
      },
      {
        group: 'noise',
        groupLabel: 'Noise (Wires)',
        groupInfo: 'noise',
        params: [
          { key: 'noiseDecay', label: 'Decay', min: 0.05, max: 0.5, unit: 's', info: 'decay' },
          { key: 'snap', label: 'Snap', min: 0, max: 1, unit: '', info: 'transient' },
        ]
      },
      {
        group: 'filter',
        groupLabel: 'Filter',
        groupInfo: 'bandpassFilter',
        params: [
          { key: 'filterFreq', label: 'Cutoff', min: 500, max: 8000, unit: 'Hz', info: 'cutoff' },
          { key: 'filterQ', label: 'Resonance', min: 0.5, max: 5, unit: '', info: 'resonance' },
        ]
      },
      {
        group: 'amp',
        groupLabel: 'Amplitude',
        groupInfo: 'amplitudeEnvelope',
        params: [
          { key: 'attack', label: 'Attack', min: 0.001, max: 0.02, unit: 's', info: 'attack' },
          { key: 'volume', label: 'Volume', min: 0, max: 1, unit: '', info: 'amplitude' },
        ]
      }
    ];
  }
}
