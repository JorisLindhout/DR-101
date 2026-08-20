# DR-101 Drum Synthesizer

An interactive web-based drum synthesizer designed to teach audio synthesis concepts through hands-on sound design. Inspired by classic Roland drum machines (TR-808, TR-909).

![DR-101 Screenshot](screenshot.png)

## Features

### Drum Sounds (All Synthesized)
- **Kick** — Sine oscillator + pitch envelope + amplitude decay + optional distortion
- **Snare** — Noise + tone oscillator + bandpass filter + adjustable snap
- **Closed Hi-Hat** — Noise + high-pass filter + very short decay + metallic overtones
- **Open Hi-Hat** — Noise + high-pass filter + longer decay + brightness control
- **Tom** — Sine/triangle oscillator + pitch envelope + body sub-oscillator

### Interactive Learning
- **Info buttons** on every parameter explaining synthesis concepts
- **Learning Mode** toggle for guided exploration
- **Real-time waveform visualization** 
- **Envelope visualization** showing attack/decay shapes
- **Progressive disclosure** — start simple, explore deeper

### Sound Design
- **Canvas-based rotary knobs** with smooth pointer event handling
- **Factory presets** for each drum type (808 Classic, 909 Punchy, etc.)
- **User preset saving** with localStorage persistence
- **Real-time parameter changes** with instant audio feedback

### 16-Step Sequencer
- Pattern programming for all 5 drum sounds
- Adjustable tempo (40-300 BPM)
- Visual step indicator during playback
- Pattern persistence across sessions

### Mobile-First Design
- Touch-optimized knob and slider controls
- Responsive layout for phones and tablets
- PWA support — installable as a home screen app
- Works offline after first load

## How to Run Locally

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/dr-101.git
cd dr-101

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

## Technologies Used

| Technology | Purpose |
|------------|---------|
| **Web Audio API** | All sound synthesis (oscillators, filters, envelopes) |
| **Canvas API** | Custom knob rendering and visualizations |
| **Pointer Events API** | Unified mouse/touch control handling |
| **Vanilla JavaScript** | ES6 modules, no framework dependencies |
| **CSS Custom Properties** | Theming and design tokens |
| **Service Worker** | Offline functionality and caching |
| **Vite** | Fast development server and build tooling |

## Project Structure

```
dr-101/
├── index.html              # Main HTML entry
├── vite.config.js          # Vite configuration
├── public/
│   ├── manifest.json       # PWA manifest
│   ├── sw.js               # Service worker
│   └── icons/              # App icons
└── src/
    ├── main.js             # Application entry point
    ├── style.css           # All styles
    ├── audio/
    │   ├── AudioEngine.js  # Web Audio context management
    │   ├── Kick.js         # Kick drum synthesis
    │   ├── Snare.js        # Snare drum synthesis
    │   ├── HiHat.js        # Hi-hat synthesis (closed/open)
    │   └── Tom.js          # Tom drum synthesis
    ├── ui/
    │   ├── Knob.js         # Canvas rotary knob component
    │   ├── Slider.js       # Horizontal slider component
    │   ├── Visualizer.js   # Waveform/envelope display
    │   └── InfoPanel.js    # Educational slide-up panel
    ├── sequencer/
    │   └── Sequencer.js    # 16-step drum sequencer
    └── data/
        ├── glossary.js     # Educational content
        └── presets.js      # Factory presets
```

## Learning Objectives

This project teaches fundamental audio synthesis concepts:

### 1. Oscillators & Waveforms
- Sine, triangle, square, sawtooth waves
- How waveform shape affects timbre

### 2. Amplitude Envelopes
- Attack, Decay, Sustain, Release (ADSR)
- Why drums use fast attack and variable decay

### 3. Pitch Envelopes
- Frequency modulation over time
- Creating the "thump" in kicks and toms

### 4. Filters
- Low-pass, high-pass, band-pass filters
- Cutoff frequency and resonance (Q)

### 5. Noise
- White noise generation
- Shaping noise into hi-hats and snares

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Trigger current sound |
| `1` | Select Kick |
| `2` | Select Snare |
| `3` | Select Closed Hi-Hat |
| `4` | Select Open Hi-Hat |
| `5` | Select Tom |
| `Esc` | Close info panel |

## Browser Support

- Chrome/Edge 80+
- Firefox 75+
- Safari 14+
- Mobile browsers with Web Audio API support

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- Inspired by Roland TR-808 and TR-909 drum machines
- Web Audio API documentation and community
- Classic drum machine synthesizer designs

---

Made with oscillators, filters, and envelopes.
