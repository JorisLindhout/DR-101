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
    //this.globalToggle = document.getElementById('globalInfo');

    this.isOpen = false;
    //this.learningModeEnabled = false;

    this.bindEvents();
  }

  /**
   * Bind events
   */
  bindEvents() {
    // Close button
    this.closeBtn?.addEventListener('click', () => {
      this.close();
      document.querySelector('.knob-info.active').classList.remove('active');
    });

    // Click outside to close
    /*this.panel?.addEventListener('click', (e) => {
      if (e.target === this.panel) {
        this.close();
      }
    });*/

    // Escape key to close
    /*document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.toggleLearningMode();
      }
    });*/

    // Global info toggle
    /*this.globalToggle?.addEventListener('click', () => {
      this.toggleLearningMode();
    });*/

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
   * Show a glossary entry
   */
  showEntry(key) {
    const entry = getGlossaryEntry(key);
    this.title.textContent = entry.title;
    this.content.innerHTML = entry.content;
    this.open(key);
  }

  /**
   * Open the panel
   */
  open(key) {
    this.isOpen = true;
    document.querySelector(`[data-info="${key}"]`).classList.add('active');
    this.panel?.classList.add('open');
  }

  /**
   * Close the panel
   */
  close() {
    this.isOpen = false;
    this.closeBtn?.classList.remove('active');
    this.panel?.classList.remove('open');
  }

  /**
   * Toggle open/closed
   */
  toggle() {
    if (this.isOpen) {
      this.close();
      this.closeBtn?.classList.remove('active');
    } else {
      this.open();
      this.closeBtn?.classList.add('active');
    }
  }
}
