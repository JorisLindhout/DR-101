/**
 * Kick Drum Synthesizer
 * Uses sine oscillator with pitch envelope and amplitude decay
 */
import { audioEngine } from './AudioEngine.js';

export class Kick {
  constructor() {
    this.params = {
      // Pitch envelope
      startFreq: 150,      // Starting frequency (Hz)
      endFreq: 50,         // Ending frequency (Hz)
      pitchDecay: 0.05,    // Pitch envelope decay time (seconds)
      
      // Amplitude envelope
      attack: 0.005,       // Attack time (seconds)
      decay: 0.3,          // Decay time (seconds)
      
      // Tone
      volume: 0.8,         // Overall volume (0-1)
      drive: 0,            // Distortion amount (0-100)
      click: 0.3,          // Click/attack transient amount (0-1)
    };
  }

  /**
   * Trigger the kick drum sound
   */
  trigger(time = null) {
    const ctx = audioEngine.context;
    if (!ctx) {
      console.error('Kick: No audio context!');
      return;
    }

    const now = time ?? ctx.currentTime;
    console.log('Kick trigger at:', now, 'context state:', ctx.state);
    const { startFreq, endFreq, pitchDecay, attack, decay, volume, drive, click } = this.params;

    // Main tone oscillator (sine wave)
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(endFreq, 20), 
      now + pitchDecay
    );

    // Amplitude envelope
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + attack + decay);

    // Click transient (short burst of higher frequency)
    let clickOsc = null;
    let clickGain = null;
    if (click > 0) {
      clickOsc = ctx.createOscillator();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(startFreq * 2, now);
      clickOsc.frequency.exponentialRampToValueAtTime(startFreq, now + 0.01);

      clickGain = ctx.createGain();
      clickGain.gain.setValueAtTime(click * volume, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

      clickOsc.connect(clickGain);
    }

    // Optional distortion
    let outputNode = gainNode;
    if (drive > 0) {
      const distortion = ctx.createWaveShaper();
      distortion.curve = audioEngine.createDistortionCurve(drive);
      distortion.oversample = '2x';
      gainNode.connect(distortion);
      outputNode = distortion;
    }

    // Connect everything
    osc.connect(gainNode);
    outputNode.connect(audioEngine.masterGain);
    
    if (clickGain) {
      clickGain.connect(audioEngine.masterGain);
    }

    // Start and stop
    osc.start(now);
    osc.stop(now + attack + decay + 0.1);

    if (clickOsc) {
      clickOsc.start(now);
      clickOsc.stop(now + 0.03);
    }

    // Cleanup
    osc.onended = () => {
      osc.disconnect();
      gainNode.disconnect();
      if (outputNode !== gainNode) outputNode.disconnect();
    };

    if (clickOsc) {
      clickOsc.onended = () => {
        clickOsc.disconnect();
        clickGain.disconnect();
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
          { key: 'startFreq', label: 'Start', min: 60, max: 400, unit: 'Hz', info: 'pitchStart' },
          { key: 'endFreq', label: 'End', min: 20, max: 200, unit: 'Hz', info: 'pitchEnd' },
          { key: 'pitchDecay', label: 'Decay', min: 0.01, max: 0.2, unit: 's', info: 'pitchDecay' },
        ]
      },
      {
        group: 'amp',
        groupLabel: 'Amplitude',
        groupInfo: 'amplitudeEnvelope',
        params: [
          { key: 'attack', label: 'Attack', min: 0.001, max: 0.05, unit: 's', info: 'attack' },
          { key: 'decay', label: 'Decay', min: 0.05, max: 1.0, unit: 's', info: 'decay' },
          { key: 'volume', label: 'Volume', min: 0, max: 1, unit: '', info: 'amplitude' },
        ]
      },
      {
        group: 'character',
        groupLabel: 'Character',
        groupInfo: 'general',
        params: [
          { key: 'click', label: 'Click', min: 0, max: 1, unit: '', info: 'transient' },
          { key: 'drive', label: 'Drive', min: 0, max: 100, unit: '', info: 'distortion' },
        ]
      }
    ];
  }
}
