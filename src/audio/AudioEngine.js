/**
 * AudioEngine - Central Web Audio API management
 * Handles audio context creation, analyser nodes, and global audio state
 */
export class AudioEngine {
  constructor() {
    this.context = null;
    this.analyser = null;
    this.masterGain = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the audio context (must be called after user interaction)
   */
  async init() {
    if (this.isInitialized) return;

    try {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create master gain node
      this.masterGain = this.context.createGain();
      this.masterGain.gain.value = 0.8;
      
      // Create analyser for visualization
      this.analyser = this.context.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.8;
      
      // Connect master gain to analyser, then to destination
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.context.destination);
      
      this.isInitialized = true;
      console.log('AudioEngine initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AudioEngine:', error);
      throw error;
    }
  }

  /**
   * Resume audio context if suspended (required for mobile/autoplay policies)
   */
  async resume() {
    if (this.context && this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  /**
   * Get the current audio time
   */
  get currentTime() {
    return this.context ? this.context.currentTime : 0;
  }

  /**
   * Get waveform data for visualization
   */
  getWaveformData() {
    if (!this.analyser) return new Uint8Array(0);
    
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteTimeDomainData(dataArray);
    return dataArray;
  }

  /**
   * Get frequency data for visualization
   */
  getFrequencyData() {
    if (!this.analyser) return new Uint8Array(0);
    
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  /**
   * Create a noise buffer for hi-hats and snares
   */
  createNoiseBuffer(duration = 1) {
    const sampleRate = this.context.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = this.context.createBuffer(1, bufferSize, sampleRate);
    const output = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    return buffer;
  }

  /**
   * Create a distortion curve for waveshaper
   */
  createDistortionCurve(amount) {
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;
    
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }
    
    return curve;
  }

  /**
   * Set master volume
   */
  setMasterVolume(value) {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(value, this.context.currentTime);
    }
  }

  /**
   * Cleanup resources
   */
  dispose() {
    if (this.context) {
      this.context.close();
      this.context = null;
      this.isInitialized = false;
    }
  }
}

// Singleton instance
export const audioEngine = new AudioEngine();
