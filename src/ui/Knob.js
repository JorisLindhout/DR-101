/**
 * Canvas-based Rotary Knob Component
 * Touch and mouse friendly with pointer events
 */

export class Knob {
  constructor(options = {}) {
    this.id = options.id || `knob-${Math.random().toString(36).substr(2, 9)}`;
    this.label = options.label || 'Knob';
    this.min = options.min ?? 0;
    this.max = options.max ?? 1;
    this.value = options.value ?? this.min;
    this.step = options.step ?? (this.max - this.min) / 100;
    this.unit = options.unit || '';
    this.decimals = options.decimals ?? (this.step < 0.01 ? 3 : this.step < 0.1 ? 2 : 1);
    this.onChange = options.onChange || (() => {});
    this.onInfoClick = options.onInfoClick || (() => {});
    this.infoKey = options.infoKey || null;
    this.size = options.size || 64;

    this.isDragging = false;
    this.startY = 0;
    this.startValue = 0;

    this.element = null;
    this.canvas = null;
    this.ctx = null;
    this.valueDisplay = null;

    this.create();
  }

  /**
   * Create the DOM structure
   */
  create() {
    this.element = document.createElement('div');
    this.element.className = 'knob-container';
    this.element.innerHTML = `
      <div class="knob-wrapper">
        <canvas class="knob-canvas" width="${this.size * 2}" height="${this.size * 2}"></canvas>
        ${this.infoKey ? `<button class="knob-info" data-info="${this.infoKey}" aria-label="Learn about ${this.label}">?</button>` : ''}
      </div>
      <span class="knob-label">${this.label}</span>
      <span class="knob-value">${this.formatValue()}</span>
    `;

    this.canvas = this.element.querySelector('.knob-canvas');
    this.canvas.style.width = `${this.size}px`;
    this.canvas.style.height = `${this.size}px`;
    this.ctx = this.canvas.getContext('2d');
    this.valueDisplay = this.element.querySelector('.knob-value');

    this.bindEvents();
    this.draw();

    return this.element;
  }

  /**
   * Bind pointer events for drag interaction
   */
  bindEvents() {
    // Pointer events for unified mouse/touch handling
    this.canvas.addEventListener('pointerdown', this.handlePointerDown.bind(this));
    document.addEventListener('pointermove', this.handlePointerMove.bind(this));
    document.addEventListener('pointerup', this.handlePointerUp.bind(this));
    document.addEventListener('pointercancel', this.handlePointerUp.bind(this));

    // Double-click to reset
    this.canvas.addEventListener('dblclick', () => {
      this.setValue((this.min + this.max) / 2);
    });

    // Info button
    const infoBtn = this.element.querySelector('.knob-info');
    if (infoBtn) {
      infoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.onInfoClick(this.infoKey);
      });
    }

    // Keyboard support
    this.canvas.tabIndex = 0;
    this.canvas.addEventListener('keydown', (e) => {
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
    this.isDragging = true;
    this.startY = e.clientY;
    this.startValue = this.value;
    this.canvas.setPointerCapture(e.pointerId);
    this.canvas.style.cursor = 'grabbing';
  }

  handlePointerMove(e) {
    if (!this.isDragging) return;
    
    const deltaY = this.startY - e.clientY;
    const range = this.max - this.min;
    const sensitivity = 150; // pixels for full range
    const delta = (deltaY / sensitivity) * range;
    
    this.setValue(this.startValue + delta);
  }

  handlePointerUp(e) {
    if (this.isDragging) {
      this.isDragging = false;
      this.canvas.style.cursor = 'grab';
    }
  }

  /**
   * Set the knob value
   */
  setValue(newValue) {
    const oldValue = this.value;
    this.value = Math.max(this.min, Math.min(this.max, newValue));
    
    if (this.value !== oldValue) {
      this.draw();
      this.updateValueDisplay();
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
   * Update value display
   */
  updateValueDisplay() {
    if (this.valueDisplay) {
      this.valueDisplay.textContent = this.formatValue();
    }
  }

  /**
   * Draw the knob on canvas
   */
  draw() {
    const ctx = this.ctx;
    const size = this.size * 2; // Canvas is 2x for retina
    const center = size / 2;
    const radius = size * 0.38;
    const lineWidth = size * 0.06;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Get CSS variables
    const styles = getComputedStyle(document.documentElement);
    const bgColor = styles.getPropertyValue('--bg-tertiary').trim() || '#252525';
    const accentColor = styles.getPropertyValue('--accent').trim() || '#4a7c59';
    const accentDim = styles.getPropertyValue('--accent-dim').trim() || '#3a5c45';
    const textColor = styles.getPropertyValue('--text-primary').trim() || '#e8e8e8';

    // Knob rotation: 135° to 405° (270° range)
    const startAngle = (135 * Math.PI) / 180;
    const endAngle = (405 * Math.PI) / 180;
    const angleRange = endAngle - startAngle;
    const currentAngle = startAngle + this.getNormalized() * angleRange;

    // Draw track (background arc)
    ctx.beginPath();
    ctx.arc(center, center, radius, startAngle, endAngle);
    ctx.strokeStyle = bgColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw value arc
    ctx.beginPath();
    ctx.arc(center, center, radius, startAngle, currentAngle);
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw knob body
    const knobRadius = radius - lineWidth;
    const gradient = ctx.createRadialGradient(
      center - knobRadius * 0.3,
      center - knobRadius * 0.3,
      0,
      center,
      center,
      knobRadius
    );
    gradient.addColorStop(0, '#404040');
    gradient.addColorStop(1, '#1a1a1a');

    ctx.beginPath();
    ctx.arc(center, center, knobRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw knob border
    ctx.beginPath();
    ctx.arc(center, center, knobRadius, 0, Math.PI * 2);
    ctx.strokeStyle = accentDim;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw indicator line
    const indicatorLength = knobRadius * 0.6;
    const indicatorStart = knobRadius * 0.2;
    const indicatorX1 = center + Math.cos(currentAngle) * indicatorStart;
    const indicatorY1 = center + Math.sin(currentAngle) * indicatorStart;
    const indicatorX2 = center + Math.cos(currentAngle) * indicatorLength;
    const indicatorY2 = center + Math.sin(currentAngle) * indicatorLength;

    ctx.beginPath();
    ctx.moveTo(indicatorX1, indicatorY1);
    ctx.lineTo(indicatorX2, indicatorY2);
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
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
