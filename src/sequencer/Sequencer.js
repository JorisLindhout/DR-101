/**
 * 16-Step Drum Sequencer
 * Web Audio API-based timing for accurate playback
 */

import { audioEngine } from '../audio/index.js';

export class Sequencer {
  constructor(options = {}) {
    this.steps = 16;
    this.tempo = options.tempo || 120;
    this.isPlaying = false;
    this.currentStep = 0;
    
    // Pattern: { soundType: [step0, step1, ...] }
    this.pattern = {
      'kick': new Array(this.steps).fill(false),
      'snare': new Array(this.steps).fill(false),
      'hihat-closed': new Array(this.steps).fill(false),
      'hihat-open': new Array(this.steps).fill(false),
      'tom': new Array(this.steps).fill(false)
    };

    // Sound instances (set externally)
    this.sounds = {};

    // Timing
    this.nextStepTime = 0;
    this.scheduleAheadTime = 0.1; // Schedule 100ms ahead
    this.lookahead = 25; // Check every 25ms
    this.timerID = null;

    // Callbacks
    this.onStepChange = options.onStepChange || (() => {});
    this.onPatternChange = options.onPatternChange || (() => {});

    // DOM elements
    this.gridElement = document.getElementById('sequencerGrid');
    this.playBtn = document.getElementById('seqPlayBtn');
    this.clearBtn = document.getElementById('seqClearBtn');
    this.tempoInput = document.getElementById('tempoInput');

    this.buildGrid();
    this.bindEvents();
  }

  /**
   * Build the sequencer grid UI
   */
  buildGrid() {
    if (!this.gridElement) return;

    const soundLabels = {
      'kick': 'KICK',
      'snare': 'SNR',
      'hihat-closed': 'CH',
      'hihat-open': 'OH',
      'tom': 'TOM'
    };

    this.gridElement.innerHTML = '';

    for (const [soundType, label] of Object.entries(soundLabels)) {
      const row = document.createElement('div');
      row.className = 'seq-row';
      row.dataset.sound = soundType;

      const rowLabel = document.createElement('span');
      rowLabel.className = 'seq-row-label';
      rowLabel.textContent = label;
      row.appendChild(rowLabel);

      const stepsContainer = document.createElement('div');
      stepsContainer.className = 'seq-steps';

      for (let i = 0; i < this.steps; i++) {
        const step = document.createElement('button');
        step.className = 'seq-step';
        step.dataset.step = i;
        step.dataset.sound = soundType;
        step.setAttribute('aria-label', `${label} step ${i + 1}`);
        stepsContainer.appendChild(step);
      }

      row.appendChild(stepsContainer);
      this.gridElement.appendChild(row);
    }
  }

  /**
   * Bind events
   */
  bindEvents() {
    // Step toggle
    this.gridElement?.addEventListener('click', (e) => {
      const step = e.target.closest('.seq-step');
      if (step) {
        const stepIndex = parseInt(step.dataset.step);
        const soundType = step.dataset.sound;
        this.toggleStep(soundType, stepIndex);
      }
    });

    // Play/Stop button
    this.playBtn?.addEventListener('click', () => {
      this.toggle();
    });

    // Clear button
    this.clearBtn?.addEventListener('click', () => {
      this.clearPattern();
    });

    // Tempo input
    this.tempoInput?.addEventListener('change', (e) => {
      const newTempo = parseInt(e.target.value);
      if (newTempo >= 40 && newTempo <= 300) {
        this.setTempo(newTempo);
      }
    });
  }

  /**
   * Toggle a step on/off
   */
  toggleStep(soundType, stepIndex) {
    if (!this.pattern[soundType]) return;

    this.pattern[soundType][stepIndex] = !this.pattern[soundType][stepIndex];
    this.updateStepUI(soundType, stepIndex);
    this.onPatternChange(this.pattern);
  }

  /**
   * Update UI for a single step
   */
  updateStepUI(soundType, stepIndex) {
    const row = this.gridElement?.querySelector(`[data-sound="${soundType}"]`);
    const step = row?.querySelector(`[data-step="${stepIndex}"]`);
    if (step) {
      step.classList.toggle('active', this.pattern[soundType][stepIndex]);
    }
  }

  /**
   * Update current step indicator
   */
  updateCurrentStepUI() {
    // Remove current class from all steps
    this.gridElement?.querySelectorAll('.seq-step').forEach(step => {
      step.classList.remove('current');
    });

    // Add current class to current step column
    if (this.isPlaying) {
      this.gridElement?.querySelectorAll(`[data-step="${this.currentStep}"]`).forEach(step => {
        step.classList.add('current');
      });
    }
  }

  /**
   * Clear the pattern
   */
  clearPattern() {
    for (const soundType of Object.keys(this.pattern)) {
      this.pattern[soundType].fill(false);
    }
    
    // Update UI
    this.gridElement?.querySelectorAll('.seq-step').forEach(step => {
      step.classList.remove('active');
    });

    this.onPatternChange(this.pattern);
  }

  /**
   * Set tempo
   */
  setTempo(bpm) {
    this.tempo = Math.max(40, Math.min(300, bpm));
    if (this.tempoInput) {
      this.tempoInput.value = this.tempo;
    }
  }

  /**
   * Get step duration in seconds
   */
  getStepDuration() {
    // 16th notes: 4 steps per beat
    return 60 / this.tempo / 4;
  }

  /**
   * Toggle play/stop
   */
  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  /**
   * Start playback
   */
  async start() {
    if (this.isPlaying) return;

    // Initialize audio if needed (required for mobile)
    if (!audioEngine.isInitialized) {
      await audioEngine.init();
    }
    await audioEngine.resume();
    
    if (!audioEngine.isInitialized || !audioEngine.context) {
      console.error('Audio context not available');
      return;
    }
    
    this.isPlaying = true;
    this.currentStep = 0;
    this.nextStepTime = audioEngine.currentTime;

    // Update UI
    this.updatePlayButton(true);

    // Start scheduler
    this.scheduler();
  }

  /**
   * Stop playback
   */
  stop() {
    this.isPlaying = false;
    
    if (this.timerID) {
      clearTimeout(this.timerID);
      this.timerID = null;
    }

    // Update UI
    this.updatePlayButton(false);
    this.updateCurrentStepUI();
  }

  /**
   * Update play button UI
   */
  updatePlayButton(playing) {
    if (!this.playBtn) return;
    
    const playIcon = this.playBtn.querySelector('.play-icon');
    const stopIcon = this.playBtn.querySelector('.stop-icon');
    
    if (playing) {
      this.playBtn.classList.add('active');
      if (playIcon) playIcon.style.display = 'none';
      if (stopIcon) stopIcon.style.display = 'block';
    } else {
      this.playBtn.classList.remove('active');
      if (playIcon) playIcon.style.display = 'block';
      if (stopIcon) stopIcon.style.display = 'none';
    }
  }

  /**
   * Main scheduler loop
   */
  scheduler() {
    while (this.nextStepTime < audioEngine.currentTime + this.scheduleAheadTime) {
      this.scheduleStep(this.currentStep, this.nextStepTime);
      this.advanceStep();
    }

    this.timerID = setTimeout(() => this.scheduler(), this.lookahead);
  }

  /**
   * Schedule triggers for a step
   */
  scheduleStep(stepIndex, time) {
    // Trigger sounds for this step
    for (const [soundType, steps] of Object.entries(this.pattern)) {
      if (steps[stepIndex] && this.sounds[soundType]) {
        this.sounds[soundType].trigger(time);
      }
    }

    // Schedule UI update
    const msUntilStep = (time - audioEngine.currentTime) * 1000;
    setTimeout(() => {
      this.currentStep = stepIndex;
      this.updateCurrentStepUI();
      this.onStepChange(stepIndex);
    }, Math.max(0, msUntilStep));
  }

  /**
   * Advance to next step
   */
  advanceStep() {
    this.nextStepTime += this.getStepDuration();
    this.currentStep = (this.currentStep + 1) % this.steps;
  }

  /**
   * Set sounds for sequencer
   */
  setSounds(sounds) {
    this.sounds = sounds;
  }

  /**
   * Get current pattern
   */
  getPattern() {
    return this.pattern;
  }

  /**
   * Set pattern
   */
  setPattern(pattern) {
    for (const [soundType, steps] of Object.entries(pattern)) {
      if (this.pattern[soundType]) {
        this.pattern[soundType] = [...steps];
        steps.forEach((active, i) => this.updateStepUI(soundType, i));
      }
    }
    this.onPatternChange(this.pattern);
  }

  /**
   * Load a preset pattern
   */
  loadPresetPattern(name) {
    const patterns = {
      'basic': {
        'kick': [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
        'snare': [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
        'hihat-closed': [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
        'hihat-open': [false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false],
        'tom': [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
      },
      '808': {
        'kick': [true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false],
        'snare': [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
        'hihat-closed': [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
        'hihat-open': [false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, true],
        'tom': [false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, false]
      },
      'funky': {
        'kick': [true, false, true, false, false, false, true, false, false, true, false, false, false, false, true, false],
        'snare': [false, false, false, false, true, false, false, true, false, false, false, false, true, false, false, false],
        'hihat-closed': [true, false, true, true, true, false, true, true, true, false, true, true, true, false, true, true],
        'hihat-open': [false, true, false, false, false, true, false, false, false, true, false, false, false, true, false, false],
        'tom': [false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, false]
      }
    };

    if (patterns[name]) {
      this.setPattern(patterns[name]);
    }
  }
}
