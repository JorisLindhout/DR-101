/**
 * DR-101 Drum Synthesizer
 * Main Application Entry Point
 */

import './style.css';
import { audioEngine, Kick, Snare, HiHat, Tom } from './audio/index.js';
import { Knob, Visualizer, InfoPanel } from './ui/index.js';
import { Sequencer } from './sequencer/Sequencer.js';
import { getPresetsForSound } from './data/presets.js';

class DR101App {
  constructor() {
    // State
    this.currentSound = 'kick';
    this.isInitialized = false;
    
    // Sound instances
    this.sounds = {
      'kick': new Kick(),
      'snare': new Snare(),
      'hihat-closed': new HiHat('closed'),
      'hihat-open': new HiHat('open'),
      'tom': new Tom()
    };

    // UI references
    this.controlsSection = document.getElementById('controlsSection');
    this.playButton = document.getElementById('playButton');
    this.presetSelect = document.getElementById('presetSelect');
    this.savePresetBtn = document.getElementById('savePreset');
    this.soundTabs = document.querySelectorAll('.sound-tab');
    this.toast = document.getElementById('toast');

    // UI Components
    this.knobs = [];
    this.visualizer = null;
    this.infoPanel = null;
    this.sequencer = null;

    this.init();
  }

  /**
   * Initialize the application
   */
  async init() {
    // Set up visualizer
    const waveformCanvas = document.getElementById('waveformCanvas');
    const envelopeCanvas = document.getElementById('envelopeCanvas');
    this.visualizer = new Visualizer(waveformCanvas, envelopeCanvas);

    // Set up info panel
    this.infoPanel = new InfoPanel();

    // Set up sequencer
    this.sequencer = new Sequencer({
      tempo: 120,
      onStepChange: (step) => {
        // Visual feedback could go here
      },
      onPatternChange: (pattern) => {
        this.saveToStorage();
      }
    });
    this.sequencer.setSounds(this.sounds);

    // Bind events
    this.bindEvents();

    // Build initial UI
    this.buildControls();
    this.populatePresets();

    // Load saved state
    this.loadFromStorage();

    // Initialize audio on first interaction
    this.setupAudioInit();
  }

  /**
   * Initialize audio context (must be called from user gesture on mobile)
   */
  async initAudio() {
    try {
      if (!this.isInitialized) {
        await audioEngine.init();
        this.isInitialized = true;
        this.showToast('Audio enabled!');
        console.log('Audio initialized');
      }
      if (audioEngine.context?.state === 'suspended') {
        await audioEngine.context.resume();
        console.log('Audio resumed from suspended');
      }
      return true;
    } catch (e) {
      console.error('Audio init failed:', e);
      this.showToast('Audio error: ' + e.message);
      return false;
    }
  }

  /**
   * Set up audio initialization on first user interaction
   */
  setupAudioInit() {
    // Pre-warm audio on any interaction
    const warmAudio = () => this.initAudio();
    document.addEventListener('touchstart', warmAudio, { once: true });
    document.addEventListener('mousedown', warmAudio, { once: true });
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Sound tab selection
    this.soundTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.selectSound(tab.dataset.sound);
      });
    });

    // Play button
    this.playButton?.addEventListener('click', () => {
      this.triggerCurrentSound();
    });

    // Preset selection
    this.presetSelect?.addEventListener('change', (e) => {
      if (e.target.value) {
        this.loadPreset(e.target.value);
      }
    });

    // Save preset button
    this.savePresetBtn?.addEventListener('click', () => {
      this.saveUserPreset();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Space to trigger sound (if not in input)
      if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        this.triggerCurrentSound();
      }

      // Number keys for sound selection
      const soundKeys = { '1': 'kick', '2': 'snare', '3': 'hihat-closed', '4': 'hihat-open', '5': 'tom' };
      if (soundKeys[e.key]) {
        this.selectSound(soundKeys[e.key]);
      }
    });
  }

  /**
   * Select a sound type
   */
  selectSound(soundType) {
    if (this.currentSound === soundType) return;
    
    this.currentSound = soundType;

    // Update tabs
    this.soundTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.sound === soundType);
    });

    // Rebuild controls
    this.buildControls();
    this.populatePresets();
  }

  /**
   * Build controls for current sound
   */
  buildControls() {
    if (!this.controlsSection) return;

    // Clear existing
    this.knobs.forEach(knob => knob.destroy?.());
    this.knobs = [];
    this.controlsSection.innerHTML = '';

    // Get param definitions for current sound
    const sound = this.sounds[this.currentSound];
    let paramDefs;

    if (this.currentSound === 'kick') {
      paramDefs = Kick.getParamDefinitions();
    } else if (this.currentSound === 'snare') {
      paramDefs = Snare.getParamDefinitions();
    } else if (this.currentSound.startsWith('hihat')) {
      const type = this.currentSound === 'hihat-open' ? 'open' : 'closed';
      paramDefs = HiHat.getParamDefinitions(type);
    } else if (this.currentSound === 'tom') {
      paramDefs = Tom.getParamDefinitions();
    }

    if (!paramDefs) return;

    // Create control groups
    paramDefs.forEach(group => {
      const groupEl = document.createElement('div');
      groupEl.className = 'control-group';
      
      const header = document.createElement('div');
      header.className = 'control-group-header';
      header.innerHTML = `
        <span class="control-group-title">${group.groupLabel}</span>
        <button class="control-group-info" data-info="${group.groupInfo}" aria-label="Learn about ${group.groupLabel}">?</button>
      `;
      groupEl.appendChild(header);

      const row = document.createElement('div');
      row.className = 'control-row';

      group.params.forEach(param => {
        const knob = new Knob({
          id: `knob-${param.key}`,
          label: param.label,
          min: param.min,
          max: param.max,
          value: sound.params[param.key],
          unit: param.unit,
          infoKey: param.info,
          size: 64,
          onChange: (value) => {
            sound.params[param.key] = value;
            this.saveToStorage();
          },
          onInfoClick: (key) => {
            this.infoPanel?.showEntry(key);
          }
        });

        this.knobs.push(knob);
        row.appendChild(knob.getElement());
      });

      groupEl.appendChild(row);
      this.controlsSection.appendChild(groupEl);
    });
  }

  /**
   * Populate preset dropdown
   */
  populatePresets() {
    if (!this.presetSelect) return;

    const presets = getPresetsForSound(this.currentSound);
    const userPresets = this.getUserPresets();

    this.presetSelect.innerHTML = '<option value="">-- Presets --</option>';

    // Factory presets
    if (presets.length > 0) {
      const factoryGroup = document.createElement('optgroup');
      factoryGroup.label = 'Factory';
      presets.forEach((preset, i) => {
        const opt = document.createElement('option');
        opt.value = `factory:${i}`;
        opt.textContent = preset.name;
        factoryGroup.appendChild(opt);
      });
      this.presetSelect.appendChild(factoryGroup);
    }

    // User presets
    const soundUserPresets = userPresets[this.currentSound] || [];
    if (soundUserPresets.length > 0) {
      const userGroup = document.createElement('optgroup');
      userGroup.label = 'My Presets';
      soundUserPresets.forEach((preset, i) => {
        const opt = document.createElement('option');
        opt.value = `user:${i}`;
        opt.textContent = preset.name;
        userGroup.appendChild(opt);
      });
      this.presetSelect.appendChild(userGroup);
    }
  }

  /**
   * Load a preset
   */
  loadPreset(presetId) {
    const [type, index] = presetId.split(':');
    let preset;

    if (type === 'factory') {
      const presets = getPresetsForSound(this.currentSound);
      preset = presets[parseInt(index)];
    } else if (type === 'user') {
      const userPresets = this.getUserPresets();
      preset = userPresets[this.currentSound]?.[parseInt(index)];
    }

    if (preset?.params) {
      const sound = this.sounds[this.currentSound];
      Object.assign(sound.params, preset.params);
      this.buildControls();
      this.showToast(`Loaded: ${preset.name}`);
      this.saveToStorage();
    }

    // Reset select
    this.presetSelect.value = '';
  }

  /**
   * Save user preset
   */
  saveUserPreset() {
    const name = prompt('Enter preset name:');
    if (!name) return;

    const sound = this.sounds[this.currentSound];
    const userPresets = this.getUserPresets();

    if (!userPresets[this.currentSound]) {
      userPresets[this.currentSound] = [];
    }

    userPresets[this.currentSound].push({
      name,
      params: { ...sound.params }
    });

    localStorage.setItem('dr101-user-presets', JSON.stringify(userPresets));
    this.populatePresets();
    this.showToast(`Saved: ${name}`);
  }

  /**
   * Get user presets from localStorage
   */
  getUserPresets() {
    try {
      return JSON.parse(localStorage.getItem('dr101-user-presets') || '{}');
    } catch {
      return {};
    }
  }

  /**
   * Trigger the current sound
   */
  async triggerCurrentSound() {
    // Must init audio in direct response to user gesture (mobile requirement)
    const audioReady = await this.initAudio();
    
    if (!audioReady || !audioEngine.isInitialized) {
      console.error('Audio not initialized');
      this.showToast('Tap again to enable audio');
      return;
    }

    // Check audio context state
    const ctx = audioEngine.context;
    if (ctx.state !== 'running') {
      this.showToast(`Audio state: ${ctx.state}`);
      await ctx.resume();
    }

    // Debug: Play a simple test beep first
    const ctx = audioEngine.context;
    const testOsc = ctx.createOscillator();
    const testGain = ctx.createGain();
    testOsc.frequency.value = 440;
    testGain.gain.value = 0.3;
    testOsc.connect(testGain);
    testGain.connect(ctx.destination); // Direct to output, bypass masterGain
    testOsc.start();
    testOsc.stop(ctx.currentTime + 0.1);
    console.log('Test beep played, context state:', ctx.state);

    const sound = this.sounds[this.currentSound];
    sound.trigger();
    console.log('Sound triggered:', this.currentSound);

    // Trigger visualization
    const attack = sound.params.attack || 0.005;
    const decay = sound.params.decay || sound.params.noiseDecay || 0.3;
    this.visualizer?.triggerForSound(attack, decay);

    // Visual feedback on play button - pulse animation
    if (this.playButton) {
      this.playButton.style.transform = 'scale(0.9)';
      this.playButton.style.boxShadow = '0 0 30px rgba(74, 124, 89, 0.8)';
      setTimeout(() => {
        this.playButton.style.transform = '';
        this.playButton.style.boxShadow = '';
      }, 150);
    }
  }

  /**
   * Save state to localStorage
   */
  saveToStorage() {
    const state = {
      currentSound: this.currentSound,
      soundParams: {},
      sequencerPattern: this.sequencer?.getPattern(),
      tempo: this.sequencer?.tempo
    };

    for (const [key, sound] of Object.entries(this.sounds)) {
      state.soundParams[key] = { ...sound.params };
    }

    localStorage.setItem('dr101-state', JSON.stringify(state));
  }

  /**
   * Load state from localStorage
   */
  loadFromStorage() {
    try {
      const state = JSON.parse(localStorage.getItem('dr101-state') || '{}');

      // Restore sound params
      if (state.soundParams) {
        for (const [key, params] of Object.entries(state.soundParams)) {
          if (this.sounds[key]) {
            Object.assign(this.sounds[key].params, params);
          }
        }
      }

      // Restore current sound
      if (state.currentSound) {
        this.selectSound(state.currentSound);
      }

      // Restore sequencer
      if (state.sequencerPattern && this.sequencer) {
        this.sequencer.setPattern(state.sequencerPattern);
      }
      if (state.tempo && this.sequencer) {
        this.sequencer.setTempo(state.tempo);
      }
    } catch (e) {
      console.warn('Failed to load state:', e);
    }
  }

  /**
   * Show toast notification
   */
  showToast(message) {
    if (!this.toast) return;
    
    this.toast.textContent = message;
    this.toast.classList.add('show');
    
    setTimeout(() => {
      this.toast.classList.remove('show');
    }, 2000);
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new DR101App());
} else {
  new DR101App();
}

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service worker registration failed, but app still works
    });
  });
}
