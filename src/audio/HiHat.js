/**
 * Hi-Hat Synthesizer
 * Noise + high-pass filter with short/long decay for closed/open
 */
import { audioEngine } from './AudioEngine.js';

export class HiHat {
  constructor(type = 'closed') {
    this.type = type;
    
    // Different defaults for closed vs open
    const isOpen = type === 'open';
    
    this.params = {
      // Filter
      filterFreq: isOpen ? 6000 : 8000,  // High-pass cutoff (Hz)
      filterQ: 1.0,                       // Filter resonance
      
      // Amplitude envelope
      attack: 0.001,                      // Attack time (seconds)
      decay: isOpen ? 0.4 : 0.08,        // Decay time (seconds)
      
      // Tone
      volume: isOpen ? 0.5 : 0.6,        // Overall volume (0-1)
      
      // Character
      metallic: 0.3,                      // Metallic overtone amount (0-1)
      brightness: 0.5,                    // High frequency content (0-1)
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
   * Trigger the hi-hat sound
   */
  trigger(time = null) {
    const ctx = audioEngine.context;
    if (!ctx) return;

    this.ensureNoiseBuffer();
    const now = time ?? ctx.currentTime;
    const { filterFreq, filterQ, attack, decay, volume, metallic, brightness } = this.params;

    // === MAIN NOISE COMPONENT ===
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = this.noiseBuffer;

    // High-pass filter (fundamental hi-hat character)
    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = filterFreq;
    highpass.Q.value = filterQ;

    // Brightness filter (low-pass to tame harshness if needed)
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 8000 + brightness * 10000;

    // Main envelope
    const mainGain = ctx.createGain();
    mainGain.gain.setValueAtTime(0, now);
    mainGain.gain.linearRampToValueAtTime(volume, now + attack);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + attack + decay);

    noiseSource.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(mainGain);

    // === METALLIC OVERTONES ===
    // Create pseudo-metallic character with multiple band-passed oscillators
    const metallicOscs = [];
    const metallicGains = [];
    
    if (metallic > 0) {
      // Frequencies loosely based on cymbal partials
      const metallicFreqs = [2093, 2637, 3136, 3951, 4698, 5274];
      
      metallicFreqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'square';
        osc.frequency.value = freq * (0.98 + Math.random() * 0.04); // Slight detuning
        
        const gain = ctx.createGain();
        const level = metallic * volume * 0.15 * (1 - i * 0.1);
        gain.gain.setValueAtTime(level, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + decay * 0.8);
        
        // Band-pass for each partial
        const bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = freq;
        bp.Q.value = 20;
        
        osc.connect(bp);
        bp.connect(gain);
        gain.connect(audioEngine.masterGain);
        
        metallicOscs.push(osc);
        metallicGains.push(gain);
        
        osc.start(now);
        osc.stop(now + decay + 0.1);
        
        osc.onended = () => {
          osc.disconnect();
          bp.disconnect();
          gain.disconnect();
        };
      });
    }

    // Connect main noise to output
    mainGain.connect(audioEngine.masterGain);

    // Start and stop
    noiseSource.start(now);
    noiseSource.stop(now + attack + decay + 0.1);

    // Cleanup
    noiseSource.onended = () => {
      noiseSource.disconnect();
      highpass.disconnect();
      lowpass.disconnect();
      mainGain.disconnect();
    };
  }

  /**
   * Get parameter definitions for UI generation
   */
  static getParamDefinitions(type = 'closed') {
    const isOpen = type === 'open';
    
    return [
      {
        group: 'filter',
        groupLabel: 'Filter',
        groupInfo: 'highpassFilter',
        params: [
          { 
            key: 'filterFreq', 
            label: 'Cutoff', 
            min: 3000, 
            max: 12000, 
            unit: 'Hz', 
            info: 'cutoff' 
          },
          { 
            key: 'filterQ', 
            label: 'Reso', 
            min: 0.5, 
            max: 5, 
            unit: '', 
            info: 'resonance' 
          },
        ]
      },
      {
        group: 'amp',
        groupLabel: 'Amplitude',
        groupInfo: 'amplitudeEnvelope',
        params: [
          { 
            key: 'attack', 
            label: 'Attack', 
            min: 0.001, 
            max: 0.01, 
            unit: 's', 
            info: 'attack' 
          },
          { 
            key: 'decay', 
            label: 'Decay', 
            min: isOpen ? 0.1 : 0.02, 
            max: isOpen ? 1.0 : 0.3, 
            unit: 's', 
            info: 'decay' 
          },
          { 
            key: 'volume', 
            label: 'Volume', 
            min: 0, 
            max: 1, 
            unit: '', 
            info: 'amplitude' 
          },
        ]
      },
      {
        group: 'character',
        groupLabel: 'Character',
        groupInfo: 'general',
        params: [
          { 
            key: 'metallic', 
            label: 'Metallic', 
            min: 0, 
            max: 1, 
            unit: '', 
            info: 'metallic' 
          },
          { 
            key: 'brightness', 
            label: 'Bright', 
            min: 0, 
            max: 1, 
            unit: '', 
            info: 'brightness' 
          },
        ]
      }
    ];
  }
}
