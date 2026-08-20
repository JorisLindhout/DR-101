/**
 * Audio Visualizer Component
 * Real-time waveform and envelope visualization using Canvas
 */

import { audioEngine } from '../audio/AudioEngine.js';

export class Visualizer {
  constructor(waveformCanvas, envelopeCanvas) {
    this.waveformCanvas = waveformCanvas;
    this.envelopeCanvas = envelopeCanvas;
    this.waveformCtx = waveformCanvas?.getContext('2d');
    this.envelopeCtx = envelopeCanvas?.getContext('2d');
    
    this.isRunning = false;
    this.animationId = null;
    this.envelope = null;
    this.envelopeStartTime = 0;
    
    this.setupCanvases();
    this.drawStatic();
  }

  /**
   * Setup canvas dimensions for retina displays
   */
  setupCanvases() {
    const setupCanvas = (canvas, ctx) => {
      if (!canvas || !ctx) return;
      
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      
      // Store display dimensions
      canvas.displayWidth = rect.width;
      canvas.displayHeight = rect.height;
    };

    setupCanvas(this.waveformCanvas, this.waveformCtx);
    setupCanvas(this.envelopeCanvas, this.envelopeCtx);

    // Handle resize
    window.addEventListener('resize', () => {
      setupCanvas(this.waveformCanvas, this.waveformCtx);
      setupCanvas(this.envelopeCanvas, this.envelopeCtx);
      this.drawStatic();
    });
  }

  /**
   * Draw static/idle state
   */
  drawStatic() {
    this.drawWaveformIdle();
    this.drawEnvelopeIdle();
  }

  /**
   * Draw idle waveform (flat line)
   */
  drawWaveformIdle() {
    const canvas = this.waveformCanvas;
    const ctx = this.waveformCtx;
    if (!canvas || !ctx) return;

    const width = canvas.displayWidth;
    const height = canvas.displayHeight;

    ctx.clearRect(0, 0, width, height);

    // Get accent color
    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent').trim() || '#4a7c59';

    // Draw center line
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.strokeStyle = accentColor + '40'; // 25% opacity
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw label
    ctx.font = '10px monospace';
    ctx.fillStyle = accentColor + '80';
    ctx.fillText('WAVEFORM', 8, 14);
  }

  /**
   * Draw idle envelope
   */
  drawEnvelopeIdle() {
    const canvas = this.envelopeCanvas;
    const ctx = this.envelopeCtx;
    if (!canvas || !ctx) return;

    const width = canvas.displayWidth;
    const height = canvas.displayHeight;

    ctx.clearRect(0, 0, width, height);

    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent').trim() || '#4a7c59';

    // Draw baseline
    ctx.beginPath();
    ctx.moveTo(0, height - 10);
    ctx.lineTo(width, height - 10);
    ctx.strokeStyle = accentColor + '40';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw label
    ctx.font = '10px monospace';
    ctx.fillStyle = accentColor + '80';
    ctx.fillText('ENVELOPE', 8, 14);
  }

  /**
   * Start real-time visualization
   */
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  /**
   * Stop visualization
   */
  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    // Return to idle after a short delay
    setTimeout(() => {
      if (!this.isRunning) {
        this.drawStatic();
      }
    }, 100);
  }

  /**
   * Animation loop
   */
  animate() {
    if (!this.isRunning) return;

    this.drawWaveform();
    this.drawEnvelope();

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  /**
   * Draw real-time waveform from analyser
   */
  drawWaveform() {
    const canvas = this.waveformCanvas;
    const ctx = this.waveformCtx;
    if (!canvas || !ctx || !audioEngine.isInitialized) return;

    const width = canvas.displayWidth;
    const height = canvas.displayHeight;
    const dataArray = audioEngine.getWaveformData();

    ctx.clearRect(0, 0, width, height);

    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent').trim() || '#4a7c59';
    const accentBright = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent-bright').trim() || '#5a9c6a';

    // Draw grid lines
    ctx.strokeStyle = accentColor + '20';
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw waveform
    ctx.beginPath();
    ctx.strokeStyle = accentBright;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const sliceWidth = width / dataArray.length;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.stroke();

    // Add glow effect
    ctx.shadowColor = accentBright;
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw label
    ctx.font = '10px monospace';
    ctx.fillStyle = accentColor + '80';
    ctx.fillText('WAVEFORM', 8, 14);
  }

  /**
   * Set envelope parameters for visualization
   */
  setEnvelope(attack, decay, startValue = 1, endValue = 0) {
    this.envelope = { attack, decay, startValue, endValue };
    this.envelopeStartTime = performance.now();
  }

  /**
   * Draw envelope visualization
   */
  drawEnvelope() {
    const canvas = this.envelopeCanvas;
    const ctx = this.envelopeCtx;
    if (!canvas || !ctx) return;

    const width = canvas.displayWidth;
    const height = canvas.displayHeight;
    const padding = 10;
    const drawHeight = height - padding * 2;
    const drawWidth = width - padding * 2;

    ctx.clearRect(0, 0, width, height);

    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent').trim() || '#4a7c59';
    const accentBright = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent-bright').trim() || '#5a9c6a';

    // Draw grid
    ctx.strokeStyle = accentColor + '20';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    if (!this.envelope) {
      // Draw label only
      ctx.font = '10px monospace';
      ctx.fillStyle = accentColor + '80';
      ctx.fillText('ENVELOPE', 8, 14);
      return;
    }

    const { attack, decay, startValue, endValue } = this.envelope;
    const totalTime = attack + decay;
    const attackWidth = (attack / totalTime) * drawWidth;
    const elapsed = (performance.now() - this.envelopeStartTime) / 1000;
    const progress = Math.min(1, elapsed / totalTime);

    // Draw envelope shape
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);

    // Attack phase
    ctx.lineTo(padding + attackWidth, padding);

    // Decay phase (exponential curve approximation)
    const decaySteps = 30;
    for (let i = 0; i <= decaySteps; i++) {
      const t = i / decaySteps;
      const x = padding + attackWidth + t * (drawWidth - attackWidth);
      const envValue = Math.exp(-t * 5) * startValue;
      const y = height - padding - envValue * drawHeight;
      ctx.lineTo(x, y);
    }

    ctx.strokeStyle = accentColor + '40';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw filled progress
    if (progress > 0) {
      ctx.beginPath();
      ctx.moveTo(padding, height - padding);

      // Progress through attack
      const attackProgress = Math.min(1, elapsed / attack);
      if (attackProgress < 1) {
        const progressX = padding + attackProgress * attackWidth;
        const progressY = height - padding - attackProgress * drawHeight;
        ctx.lineTo(progressX, progressY);
      } else {
        ctx.lineTo(padding + attackWidth, padding);
        
        // Progress through decay
        const decayElapsed = elapsed - attack;
        const decayProgress = Math.min(1, decayElapsed / decay);
        
        const decaySteps = Math.floor(decayProgress * 30);
        for (let i = 0; i <= decaySteps; i++) {
          const t = i / 30;
          const x = padding + attackWidth + t * (drawWidth - attackWidth);
          const envValue = Math.exp(-t * 5) * startValue;
          const y = height - padding - envValue * drawHeight;
          ctx.lineTo(x, y);
        }
      }

      // Fill to baseline
      ctx.lineTo(ctx.canvas.width, height - padding);
      ctx.lineTo(padding, height - padding);
      ctx.closePath();

      ctx.fillStyle = accentBright + '30';
      ctx.fill();
    }

    // Draw current position marker
    if (progress < 1) {
      let markerX, markerY;
      
      if (elapsed < attack) {
        const t = elapsed / attack;
        markerX = padding + t * attackWidth;
        markerY = height - padding - t * drawHeight;
      } else {
        const t = (elapsed - attack) / decay;
        markerX = padding + attackWidth + t * (drawWidth - attackWidth);
        const envValue = Math.exp(-t * 5) * startValue;
        markerY = height - padding - envValue * drawHeight;
      }

      ctx.beginPath();
      ctx.arc(markerX, markerY, 4, 0, Math.PI * 2);
      ctx.fillStyle = accentBright;
      ctx.fill();
      
      // Glow
      ctx.shadowColor = accentBright;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Draw labels
    ctx.font = '10px monospace';
    ctx.fillStyle = accentColor + '80';
    ctx.fillText('ENVELOPE', 8, 14);
    ctx.fillText('A', padding + attackWidth / 2 - 3, height - 2);
    ctx.fillText('D', padding + attackWidth + (drawWidth - attackWidth) / 2 - 3, height - 2);
  }

  /**
   * Trigger a one-shot visualization for a sound
   */
  triggerForSound(attack, decay) {
    this.setEnvelope(attack, decay);
    this.start();

    // Stop after envelope completes
    setTimeout(() => {
      this.stop();
    }, (attack + decay) * 1000 + 200);
  }
}
