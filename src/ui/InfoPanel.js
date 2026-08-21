/**
 * InfoPanel Component
 * Slide-up educational panel for synthesis concepts
 */

import { getGlossaryEntry } from '../data/glossary.js';

export class InfoPanel {
  constructor() {
    this.panel = document.getElementById('infoPanel');
    this.title = document.getElementById('infoPanelTitle');
    this.content = document.getElementById('infoPanelContent');
    this.closeBtn = document.getElementById('infoPanelClose');
    this.globalToggle = document.getElementById('globalInfo');

    this.isOpen = false;
    this.learningModeEnabled = false;

    this.bindEvents();
  }

  /**
   * Bind events
   */
  bindEvents() {
    // Close button
    this.closeBtn?.addEventListener('click', () => this.toggleLearningMode());

    // Click outside to close
    /*this.panel?.addEventListener('click', (e) => {
      if (e.target === this.panel) {
        this.close();
      }
    });*/

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.toggleLearningMode();
      }
    });

    // Global info toggle
    this.globalToggle?.addEventListener('click', () => {
      this.toggleLearningMode();
    });

    // Listen for info button clicks (delegated)
    document.addEventListener('click', (e) => {
      const infoBtn = e.target.closest('[data-info]');
      if (infoBtn) {
        const key = infoBtn.dataset.info;
        this.showEntry(key);
      }
    });
  }

  /**
   * Toggle learning mode (highlights all info buttons)
   */
  toggleLearningMode() {
    this.learningModeEnabled = !this.learningModeEnabled;
    document.body.classList.toggle('learning-mode', this.learningModeEnabled);
    this.globalToggle?.classList.toggle('active', this.learningModeEnabled);

    if (this.learningModeEnabled) {
      this.showWelcome();
    } else {
      this.close();
    }
  }

  /**
   * Show welcome message
   */
  showWelcome() {
    this.title.textContent = 'Learning Mode';
    this.content.innerHTML = `
      <p>Welcome to <strong>Learning Mode</strong>!</p>
      <p>Click on any <span class="info-icon-inline">?</span> icon next to a parameter to learn about audio synthesis concepts.</p>
      <p>Each drum sound uses different techniques:</p>
      <ul style="margin: 12px 0; padding-left: 20px; color: var(--text-secondary); line-height: 1.8;">
        <li><strong>Kick</strong> — Oscillator + pitch envelope</li>
        <li><strong>Snare</strong> — Noise + tone + bandpass filter</li>
        <li><strong>Hi-Hat</strong> — Noise + high-pass filter</li>
        <li><strong>Tom</strong> — Oscillator + pitch envelope + body</li>
      </ul>
      <p>Experiment with the parameters and hear how each one affects the sound!</p>
    `;
    this.open();
  }

  /**
   * Show a glossary entry
   */
  showEntry(key) {
    const entry = getGlossaryEntry(key);
    this.title.textContent = entry.title;
    this.content.innerHTML = entry.content;
    this.open();
  }

  /**
   * Open the panel
   */
  open() {
    this.isOpen = true;
    this.panel?.classList.add('open');
  }

  /**
   * Close the panel
   */
  close() {
    this.isOpen = false;
    this.panel?.classList.remove('open');
  }

  /**
   * Toggle open/closed
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
}
