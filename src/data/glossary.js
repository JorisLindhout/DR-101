/**
 * Educational Glossary
 * Plain-English explanations of audio synthesis concepts
 */

export const glossary = {
  // === OSCILLATORS & WAVEFORMS ===
  oscillator: {
    title: 'Oscillator',
    content: `
      <p>An <strong>oscillator</strong> is the heart of any synthesizer. It generates a repeating waveform that we hear as a tone.</p>
      <p>Think of it like a vibrating guitar string — it moves back and forth at a specific rate (frequency), creating sound waves.</p>
      <p>Different <strong>waveforms</strong> have different characters:</p>
      <ul>
        <li><strong>Sine</strong> — Pure, smooth, fundamental tone (like a tuning fork)</li>
        <li><strong>Triangle</strong> — Slightly brighter than sine, still mellow</li>
        <li><strong>Square</strong> — Hollow, buzzy (like old video games)</li>
        <li><strong>Sawtooth</strong> — Bright, rich in harmonics (classic synth lead sound)</li>
      </ul>
    `
  },

  waveform: {
    title: 'Waveform',
    content: `
      <p>A <strong>waveform</strong> is the shape of a sound wave over time. The shape determines the tone's character.</p>
      <p>Imagine drawing a line that shows how air pressure changes: that line's shape is the waveform.</p>
      <p>In drum synthesis, we often use <strong>sine waves</strong> for the deep "thump" of kicks and toms because they're smooth and pure.</p>
    `
  },

  noise: {
    title: 'White Noise',
    content: `
      <p><strong>White noise</strong> contains all frequencies at equal intensity — like static on a TV or the sound of rain.</p>
      <p>It's essential for drum synthesis because it creates the "sizzle" of hi-hats and the "crack" of snare wires.</p>
      <p>By filtering noise (removing some frequencies), we can shape it into hi-hats, cymbals, and snare textures.</p>
    `
  },

  // === AMPLITUDE ENVELOPE ===
  amplitudeEnvelope: {
    title: 'Amplitude Envelope (ADSR)',
    content: `
      <p>The <strong>amplitude envelope</strong> shapes how loud a sound is over time — its "volume shape."</p>
      <p>Most synths use <strong>ADSR</strong>:</p>
      <ul>
        <li><strong>Attack</strong> — How fast the sound reaches full volume</li>
        <li><strong>Decay</strong> — How fast it drops to the sustain level</li>
        <li><strong>Sustain</strong> — The volume while a note is held</li>
        <li><strong>Release</strong> — How fast it fades after the note ends</li>
      </ul>
      <p>For drums, we mainly use <strong>Attack</strong> and <strong>Decay</strong> since drum hits don't sustain.</p>
    `
  },

  attack: {
    title: 'Attack',
    content: `
      <p><strong>Attack</strong> controls how quickly a sound reaches its maximum volume.</p>
      <p><strong>Fast attack</strong> (short time) = punchy, immediate hit — perfect for drums!</p>
      <p><strong>Slow attack</strong> (long time) = gradual fade-in — like strings swelling.</p>
      <p>Most drums use very short attacks (1-5 milliseconds) to sound percussive.</p>
    `
  },

  decay: {
    title: 'Decay',
    content: `
      <p><strong>Decay</strong> controls how quickly a sound fades after the initial attack.</p>
      <p><strong>Short decay</strong> = tight, punchy sound (closed hi-hat, tight kick)</p>
      <p><strong>Long decay</strong> = sustained, ringing sound (open hi-hat, boomy kick)</p>
      <p>This is one of the most important parameters for shaping drum character!</p>
    `
  },

  amplitude: {
    title: 'Amplitude (Volume)',
    content: `
      <p><strong>Amplitude</strong> is just a technical word for loudness or volume.</p>
      <p>Higher amplitude = louder sound. Lower amplitude = quieter sound.</p>
      <p>In synthesis, we often measure it from 0 (silent) to 1 (maximum).</p>
    `
  },

  // === PITCH ENVELOPE ===
  pitchEnvelope: {
    title: 'Pitch Envelope',
    content: `
      <p>A <strong>pitch envelope</strong> changes the frequency (pitch) of a sound over time.</p>
      <p>This is the secret sauce for realistic kick and tom drums! They start at a higher pitch and quickly drop to a lower pitch.</p>
      <p>That downward pitch "sweep" in the first few milliseconds is what gives kicks their characteristic "thump."</p>
    `
  },

  pitchDecay: {
    title: 'Pitch Decay',
    content: `
      <p><strong>Pitch decay</strong> controls how quickly the pitch drops from the start frequency to the end frequency.</p>
      <p><strong>Fast pitch decay</strong> = snappy, tight (modern electronic kicks)</p>
      <p><strong>Slow pitch decay</strong> = more "swoopy," vintage feel (TR-808 style)</p>
    `
  },

  frequency: {
    title: 'Frequency (Hz)',
    content: `
      <p><strong>Frequency</strong> is how many times per second a waveform repeats, measured in <strong>Hertz (Hz)</strong>.</p>
      <p>Higher frequency = higher pitch. Lower frequency = lower pitch.</p>
      <p>Human hearing ranges from about 20 Hz (very low bass) to 20,000 Hz (very high treble).</p>
      <p>A kick drum's fundamental is typically 40-80 Hz. Hi-hats are mostly 8,000+ Hz.</p>
    `
  },

  // === FILTERS ===
  lowpassFilter: {
    title: 'Low-Pass Filter (LPF)',
    content: `
      <p>A <strong>low-pass filter</strong> lets low frequencies through and cuts high frequencies.</p>
      <p>Think of it as a "darkness" control — lower cutoff = darker, more muffled sound.</p>
      <p>It's called "low-pass" because low frequencies pass through while highs are blocked.</p>
    `
  },

  highpassFilter: {
    title: 'High-Pass Filter (HPF)',
    content: `
      <p>A <strong>high-pass filter</strong> lets high frequencies through and cuts low frequencies.</p>
      <p>This is essential for hi-hats and cymbals — we filter out the bass to leave only the bright, shimmery highs.</p>
      <p>Higher cutoff = thinner, brighter sound with less low-end.</p>
    `
  },

  bandpassFilter: {
    title: 'Band-Pass Filter (BPF)',
    content: `
      <p>A <strong>band-pass filter</strong> lets through only a specific range of frequencies, cutting both below and above.</p>
      <p>It's like combining a low-pass and high-pass filter. Great for shaping the "body" of snares.</p>
      <p>The <strong>center frequency</strong> determines where the band is focused.</p>
    `
  },

  cutoff: {
    title: 'Cutoff Frequency',
    content: `
      <p><strong>Cutoff frequency</strong> is where a filter starts to reduce frequencies.</p>
      <p>For a low-pass filter: frequencies above the cutoff get quieter.</p>
      <p>For a high-pass filter: frequencies below the cutoff get quieter.</p>
      <p>Moving the cutoff dramatically changes the sound's brightness or darkness.</p>
    `
  },

  resonance: {
    title: 'Resonance (Q)',
    content: `
      <p><strong>Resonance</strong> (also called Q) boosts frequencies right at the cutoff point.</p>
      <p>Low resonance = smooth, gentle filtering.</p>
      <p>High resonance = emphasized peak, more "vocal" or "wah-like" character.</p>
      <p>Very high resonance can make filters "ring" or even self-oscillate!</p>
    `
  },

  // === GENERAL CONCEPTS ===
  general: {
    title: 'Synthesis Basics',
    content: `
      <p><strong>Audio synthesis</strong> is creating sounds from scratch using electronic signals.</p>
      <p>The basic recipe for any synthesized drum:</p>
      <ol>
        <li><strong>Source</strong> — Oscillator (tone) or noise</li>
        <li><strong>Shape</strong> — Filter to sculpt the frequencies</li>
        <li><strong>Envelope</strong> — Control how it changes over time</li>
      </ol>
      <p>By tweaking these elements, you can create any drum sound imaginable!</p>
    `
  },

  distortion: {
    title: 'Distortion / Drive',
    content: `
      <p><strong>Distortion</strong> adds harmonic overtones by "clipping" the waveform.</p>
      <p>A little distortion adds warmth and presence. A lot creates aggressive, crunchy sounds.</p>
      <p>It's great for making kicks punchier or giving snares more bite.</p>
    `
  },

  mix: {
    title: 'Mix / Blend',
    content: `
      <p><strong>Mix</strong> controls the balance between two sound sources.</p>
      <p>For snares: mix between the tonal "body" and the noisy "wires."</p>
      <p>Finding the right mix is key to getting the character you want.</p>
    `
  },

  transient: {
    title: 'Transient / Click',
    content: `
      <p>A <strong>transient</strong> is the very first moment of a sound — the initial "click" or "snap."</p>
      <p>Strong transients make drums sound punchy and defined.</p>
      <p>This parameter adds a short burst of higher frequencies at the start for more attack.</p>
    `
  },

  metallic: {
    title: 'Metallic Character',
    content: `
      <p><strong>Metallic</strong> adds high-frequency tonal content that simulates the ring of metal.</p>
      <p>Real cymbals have complex overtones from vibrating metal. This parameter emulates that character.</p>
      <p>Higher values = more bell-like, cymbal quality. Lower = more pure noise.</p>
    `
  },

  brightness: {
    title: 'Brightness',
    content: `
      <p><strong>Brightness</strong> controls the overall high-frequency content.</p>
      <p>Brighter = more sizzle, presence, and air.</p>
      <p>Darker = warmer, more subdued, sits back in the mix.</p>
    `
  },

  body: {
    title: 'Body (Sub-Oscillator)',
    content: `
      <p><strong>Body</strong> adds a lower octave (sub-oscillator) beneath the main tone.</p>
      <p>This fills out the low end, making toms and kicks feel bigger and fuller.</p>
      <p>Too much can make things muddy; find the sweet spot!</p>
    `
  }
};

/**
 * Get glossary entry by key
 */
export function getGlossaryEntry(key) {
  return glossary[key] || {
    title: 'Parameter Info',
    content: '<p>Information not available for this parameter.</p>'
  };
}
