/**
 * Horizontal Slider Component
 * Touch and mouse friendly with pointer events
 */

export class Slider {
  constructor(options = {}) {
    this.id = options.id || `slider-${Math.random().toString(36).substr(2, 9)}`;
    this.label = options.label || 'Slider';
    this.min = options.min ?? 0;
    this.max = options.max ?? 1;
    this.value = options.value ?? this.min;
    this.step = options.step ?? (this.max - this.min) / 100;
    this.unit = options.unit || '';
    this.decimals = options.decimals ?? (this.step < 0.01 ? 3 : this.step < 0.1 ? 2 : 1);
    this.onChange = options.onChange || (() => {});
    this.onInfoClick = options.onInfoClick || (() => {});
    this.infoKey = options.infoKey || null;

    this.isDragging = false;
    this.element = null;
    this.track = null;
    this.fill = null;
    this.thumb = null;
    this.valueDisplay = null;

    this.create();
  }

  /**
   * Create the DOM structure
   */
  create() {
    this.element = document.createElement('div');
    this.element.className = 'slider-container';
    this.element.innerHTML = `
      <div class="slider-header">
        <span class="slider-label">${this.label}</span>
        <span class="slider-value">${this.formatValue()}</span>
        ${this.infoKey ? `<button class="slider-info" data-info="${this.infoKey}" aria-label="Learn about ${this.label}">?</button>` : ''}
      </div>
      <div class="slider-track">
        <div class="slider-fill"></div>
        <div class="slider-thumb" tabindex="0"></div>
      </div>
    `;

    this.track = this.element.querySelector('.slider-track');
    this.fill = this.element.querySelector('.slider-fill');
    this.thumb = this.element.querySelector('.slider-thumb');
    this.valueDisplay = this.element.querySelector('.slider-value');

    this.bindEvents();
    this.updateUI();

    return this.element;
  }

  /**
   * Bind pointer events
   */
  bindEvents() {
    // Pointer events on thumb
    this.thumb.addEventListener('pointerdown', this.handlePointerDown.bind(this));
    document.addEventListener('pointermove', this.handlePointerMove.bind(this));
    document.addEventListener('pointerup', this.handlePointerUp.bind(this));
    document.addEventListener('pointercancel', this.handlePointerUp.bind(this));

    // Click on track to jump
    this.track.addEventListener('pointerdown', this.handleTrackClick.bind(this));

    // Double-click to reset
    this.thumb.addEventListener('dblclick', () => {
      this.setValue((this.min + this.max) / 2);
    });

    // Info button
    const infoBtn = this.element.querySelector('.slider-info');
    if (infoBtn) {
      infoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.onInfoClick(this.infoKey);
      });
    }

    // Keyboard support
    this.thumb.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
        e.preventDefault();
        this.setValue(this.value + this.step);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
        e.preventDefault();
        this.setValue(this.value - this.step);
      }
    });
  }

  handlePointerDown(e) {
    e.preventDefault();
    e.stopPropagation();
    this.isDragging = true;
    this.thumb.setPointerCapture(e.pointerId);
  }

  handlePointerMove(e) {
    if (!this.isDragging) return;
    this.updateValueFromPointer(e.clientX);
  }

  handlePointerUp() {
    this.isDragging = false;
  }

  handleTrackClick(e) {
    if (e.target === this.thumb) return;
    this.updateValueFromPointer(e.clientX);
  }

  /**
   * Update value based on pointer X position
   */
  updateValueFromPointer(clientX) {
    const rect = this.track.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newValue = this.min + percent * (this.max - this.min);
    this.setValue(newValue);
  }

  /**
   * Set the slider value
   */
  setValue(newValue) {
    const oldValue = this.value;
    // Snap to step
    const steps = Math.round((newValue - this.min) / this.step);
    this.value = Math.max(this.min, Math.min(this.max, this.min + steps * this.step));
    
    if (this.value !== oldValue) {
      this.updateUI();
      this.onChange(this.value);
    }
  }

  /**
   * Get normalized value (0-1)
   */
  getNormalized() {
    return (this.value - this.min) / (this.max - this.min);
  }

  /**
   * Format value for display
   */
  formatValue() {
    let displayValue = this.value.toFixed(this.decimals);
    if (this.unit) {
      displayValue += this.unit;
    }
    return displayValue;
  }

  /**
   * Update UI based on current value
   */
  updateUI() {
    const percent = this.getNormalized() * 100;
    this.fill.style.width = `${percent}%`;
    this.thumb.style.left = `${percent}%`;
    this.valueDisplay.textContent = this.formatValue();
  }

  /**
   * Get the DOM element
   */
  getElement() {
    return this.element;
  }

  /**
   * Destroy the component
   */
  destroy() {
    document.removeEventListener('pointermove', this.handlePointerMove);
    document.removeEventListener('pointerup', this.handlePointerUp);
    document.removeEventListener('pointercancel', this.handlePointerUp);
    this.element.remove();
  }
}
