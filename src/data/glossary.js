/**
 * Educational Glossary
 * Plain-English explanations of audio synthesis concepts
 */

export const glossary = {

  // === OSCILLATORS & WAVEFORMS ===

  oscillator: {
    title: 'Oscillator',
    content: `
      <p><strong>Concept:</strong> An <strong>oscillator</strong> generates a repeating waveform that we hear as a pitched tone.</p>

      <p><strong>What it does:</strong> The oscillator creates the basic tonal building block of a synthesized sound. Its frequency determines the pitch, while its waveform affects the character of the tone.</p>

      <p><strong>What you hear:</strong> Different oscillators and waveforms can produce smooth, mellow, buzzy, or bright sounds.</p>

      <p><strong>Try it:</strong> Change the frequency of a tonal drum and listen to the pitch move up and down.</p>
    `
  },

  waveform: {
    title: 'Waveform',
    content: `
      <p><strong>Concept:</strong> A <strong>waveform</strong> is the shape of an audio signal as it changes over time. Its shape affects the tone's character.</p>

      <p><strong>What it does:</strong> Different waveform shapes contain different combinations of frequencies, called <strong>harmonics</strong>.</p>

      <p><strong>What you hear:</strong> A sine wave sounds smooth and pure, while waveforms with more harmonics sound brighter or more complex.</p>

      <p><strong>Try it:</strong> Compare different waveforms at the same pitch and listen to how the character changes while the note stays at the same frequency.</p>
    `
  },

  noise: {
    title: 'White Noise',
    content: `
      <p><strong>Concept:</strong> <strong>White noise</strong> contains a broad range of frequencies without a single clear pitch. It sounds similar to static or rushing air.</p>

      <p><strong>What it does:</strong> Noise provides the unpitched part of sounds such as snare wires and hi-hats.</p>

      <p><strong>What you hear:</strong> Noise creates the "sizzle," "hiss," and texture of these drums.</p>

      <p><strong>Try it:</strong> Listen to the noise component of a snare or hi-hat, then change its filter settings to hear how removing frequencies changes its character.</p>
    `
  },


  // === AMPLITUDE ENVELOPE ===

  amplitudeEnvelope: {
    title: 'Amplitude Envelope',
    content: `
      <p><strong>Concept:</strong> An <strong>amplitude envelope</strong> controls how the level of a sound changes over time.</p>

      <p><strong>What it does:</strong> DR-101 uses <strong>Attack</strong> and <strong>Decay</strong> to shape the volume of a drum hit.</p>

      <ul>
        <li><strong>Attack</strong> — How quickly the sound reaches its initial level</li>
        <li><strong>Decay</strong> — How quickly the sound fades away</li>
      </ul>

      <p><strong>What you hear:</strong> A short attack makes a drum hit immediately. A shorter decay makes it tighter, while a longer decay lets it ring out.</p>

      <p><strong>Try it:</strong> Set Decay very short and then very long. Listen to how the same drum changes from tight and punchy to longer and more sustained.</p>
    `
  },

  attack: {
    title: 'Attack',
    content: `
      <p><strong>Concept:</strong> <strong>Attack</strong> controls how quickly a sound reaches its initial volume.</p>

      <p><strong>What it does:</strong> It sets the amount of time between the start of the drum hit and its initial level.</p>

      <p><strong>What you hear:</strong> A short attack creates an immediate, punchy hit. A longer attack creates a softer fade-in.</p>

      <p><strong>Try it:</strong> Increase Attack while repeatedly triggering the drum. Listen for the initial punch becoming less immediate.</p>
    `
  },

  decay: {
    title: 'Decay',
    content: `
      <p><strong>Concept:</strong> <strong>Decay</strong> controls how quickly a sound or sound component fades after it begins.</p>

      <p><strong>What it does:</strong> In DR-101, decay can control different parts of a drum sound, including its amplitude, tone, noise, or pitch.</p>

      <p><strong>What you hear:</strong> Short decay creates a tighter, shorter sound. Long decay creates a longer, more sustained or ringing sound.</p>

      <p><strong>Try it:</strong> Compare the shortest and longest decay settings and listen to how much longer the drum or sound component continues.</p>
    `
  },

  amplitude: {
    title: 'Amplitude',
    content: `
      <p><strong>Concept:</strong> <strong>Amplitude</strong> describes the strength of an audio signal.</p>

      <p><strong>What it does:</strong> A higher amplitude produces a stronger signal, while a lower amplitude produces a weaker signal. Volume controls the overall level, while an amplitude envelope controls how that level changes over time.</p>

      <p><strong>What you hear:</strong> Greater amplitude is generally heard as louder; lower amplitude is heard as quieter.</p>

      <p><strong>Try it:</strong> Change Volume and listen to the overall level. Then change Attack or Decay and listen to how the level changes over time.</p>
    `
  },


  // === PITCH ENVELOPE ===

  pitchEnvelope: {
    title: 'Pitch Envelope',
    content: `
      <p><strong>Concept:</strong> A <strong>pitch envelope</strong> changes the pitch of a sound over time.</p>

      <p><strong>What it does:</strong> Start sets the frequency at the beginning of the drum hit. End sets the frequency the sound moves toward. Pitch Decay controls how quickly it moves between them.</p>

      <p><strong>What you hear:</strong> Kicks and toms can start at a higher pitch and quickly drop toward a lower pitch. This downward <strong>pitch sweep</strong> creates much of their characteristic punch and movement.</p>

      <p><strong>Try it:</strong> Set Start high and End low, then shorten Pitch Decay. Listen for the quick downward pitch sweep at the beginning of the drum.</p>
    `
  },

  pitchStart: {
    title: 'Start Frequency',
    content: `
      <p><strong>Concept:</strong> The <strong>start frequency</strong> is the frequency of the oscillator when the drum hit begins.</p>

      <p><strong>What it does:</strong> It sets the starting point of the pitch envelope.</p>

      <p><strong>What you hear:</strong> Higher values produce a higher starting pitch. Lower values produce a lower starting pitch.</p>

      <p><strong>Try it:</strong> Leave End and Pitch Decay unchanged, then move Start up and down. Listen to the pitch at the very beginning of the drum hit.</p>
    `
  },

  pitchEnd: {
    title: 'End Frequency',
    content: `
      <p><strong>Concept:</strong> The <strong>end frequency</strong> is the frequency the oscillator moves toward during the pitch envelope.</p>

      <p><strong>What it does:</strong> It sets the destination of the pitch sweep.</p>

      <p><strong>What you hear:</strong> A lower End value creates a larger downward pitch sweep. Bringing End closer to Start produces a subtler pitch change.</p>

      <p><strong>Try it:</strong> Leave Start and Pitch Decay unchanged, then gradually lower End. Listen to the pitch sweep become more pronounced.</p>
    `
  },

  pitchDecay: {
    title: 'Pitch Decay',
    content: `
      <p><strong>Concept:</strong> <strong>Pitch Decay</strong> controls how quickly the pitch moves from the start frequency to the end frequency.</p>

      <p><strong>What it does:</strong> It sets the amount of time taken by the pitch sweep.</p>

      <p><strong>What you hear:</strong> Short Pitch Decay creates a fast, punchy pitch drop. Longer Pitch Decay makes the pitch sweep slower and more noticeable.</p>

      <p><strong>Try it:</strong> Keep Start and End unchanged while changing only Pitch Decay. Listen to how the timing of the pitch movement changes.</p>
    `
  },

  frequency: {
    title: 'Frequency (Hz)',
    content: `
      <p><strong>Concept:</strong> <strong>Frequency</strong> describes how many times a waveform repeats each second. It is measured in <strong>Hertz (Hz)</strong>.</p>

      <p><strong>What it does:</strong> The frequency of an oscillator determines how quickly it vibrates.</p>

      <p><strong>What you hear:</strong> Higher frequencies are generally heard as higher pitches, while lower frequencies are heard as lower pitches.</p>

      <p><strong>Try it:</strong> Change a tonal drum's frequency while repeatedly triggering it. Listen to the pitch move higher and lower.</p>
    `
  },


  // === FILTERS ===

  lowpassFilter: {
    title: 'Low-Pass Filter (LPF)',
    content: `
      <p><strong>Concept:</strong> A <strong>low-pass filter</strong> allows lower frequencies through while reducing higher frequencies.</p>

      <p><strong>What it does:</strong> The filter removes progressively more high-frequency content as the cutoff is lowered.</p>

      <p><strong>What you hear:</strong> Lower cutoff settings make a sound darker and more muffled. Higher settings allow more high-frequency content through, making the sound brighter.</p>

      <p><strong>Try it:</strong> Sweep the cutoff from low to high and listen to high-frequency content gradually return.</p>
    `
  },

  highpassFilter: {
    title: 'High-Pass Filter (HPF)',
    content: `
      <p><strong>Concept:</strong> A <strong>high-pass filter</strong> allows higher frequencies through while reducing lower frequencies.</p>

      <p><strong>What it does:</strong> The filter removes progressively more low-frequency content as the cutoff is raised.</p>

      <p><strong>What you hear:</strong> Higher cutoff settings make the sound thinner and brighter because more low-frequency content has been removed.</p>

      <p><strong>Try it:</strong> Start with a low cutoff and gradually raise it. Listen to the low-frequency body disappear from the sound.</p>
    `
  },

  bandpassFilter: {
    title: 'Band-Pass Filter (BPF)',
    content: `
      <p><strong>Concept:</strong> A <strong>band-pass filter</strong> allows a range of frequencies through while reducing frequencies above and below that range.</p>

      <p><strong>What it does:</strong> The center frequency determines where the filter is focused, while resonance controls how strongly that area is emphasized.</p>

      <p><strong>What you hear:</strong> Moving the filter changes which part of the sound stands out, allowing you to focus the snare on different frequency regions.</p>

      <p><strong>Try it:</strong> Sweep the center frequency while listening to the snare. Then increase Resonance and repeat the sweep.</p>
    `
  },

  cutoff: {
    title: 'Cutoff Frequency',
    content: `
      <p><strong>Concept:</strong> The <strong>cutoff frequency</strong> determines where a filter begins reducing frequencies.</p>

      <p><strong>What it does:</strong> With a low-pass filter, frequencies above the cutoff are reduced. With a high-pass filter, frequencies below the cutoff are reduced.</p>

      <p><strong>What you hear:</strong> Changing the cutoff can make a sound darker, brighter, thinner, or more focused depending on the type of filter.</p>

      <p><strong>Try it:</strong> Move the cutoff slowly while repeatedly triggering the drum. Listen to different parts of the frequency spectrum become more or less prominent.</p>
    `
  },

  resonance: {
    title: 'Resonance',
    content: `
      <p><strong>Concept:</strong> <strong>Resonance</strong> emphasizes frequencies around a filter's cutoff point.</p>

      <p><strong>What it does:</strong> It controls how strongly the filter emphasizes that frequency region.</p>

      <p><strong>What you hear:</strong> Low resonance produces a smoother sound. Higher resonance creates a sharper, more focused or ringing character.</p>

      <p><strong>Try it:</strong> Turn Resonance up and sweep the cutoff. Listen for the emphasized frequency moving through the sound.</p>
    `
  },


  // === GENERAL CONCEPTS ===

  general: {
    title: 'Synthesis Basics',
    content: `
      <p><strong>Concept:</strong> <strong>Audio synthesis</strong> is the process of creating sounds from electronic signals.</p>

      <p><strong>What it does:</strong> Synthesized drums are built by combining a few basic building blocks:</p>

      <ol>
        <li><strong>Source</strong> — An oscillator creates a pitched tone; noise creates an unpitched sound.</li>
        <li><strong>Shape</strong> — Filters change which frequencies are present.</li>
        <li><strong>Envelope</strong> — Controls how a sound or one of its properties changes over time.</li>
      </ol>

      <p><strong>What you hear:</strong> Changing these elements changes different qualities of the drum, such as its pitch, length, brightness, punch, and character.</p>

      <p><strong>Try it:</strong> Change one control at a time and listen carefully to what changes. Try describing what you hear using the synthesis terms in the interface.</p>
    `
  },

  distortion: {
    title: 'Distortion / Drive',
    content: `
      <p><strong>Concept:</strong> <strong>Distortion</strong> changes the shape of an audio signal and creates additional <strong>harmonics</strong>.</p>

      <p><strong>What it does:</strong> Drive controls how strongly the signal is pushed into distortion.</p>

      <p><strong>What you hear:</strong> A small amount can add warmth, presence, and punch. More distortion creates a rougher, harsher, or more aggressive sound.</p>

      <p><strong>Try it:</strong> Start with Drive at zero and gradually increase it. Listen for new harmonic content appearing as the signal becomes more distorted.</p>
    `
  },

  mix: {
    title: 'Mix / Blend',
    content: `
      <p><strong>Concept:</strong> <strong>Mix</strong> controls the balance between two sound sources or components.</p>

      <p><strong>What it does:</strong> In the snare, Mix blends the tonal <strong>body</strong> with the noisy <strong>snare wires</strong>.</p>

      <p><strong>What you hear:</strong> More tone produces a fuller, more pitched sound. More noise produces a sharper, noisier snare.</p>

      <p><strong>Try it:</strong> Move Mix slowly from one extreme to the other. Listen to the sound move between mostly tonal and mostly noisy.</p>
    `
  },

  transient: {
    title: 'Transient / Click',
    content: `
      <p><strong>Concept:</strong> A <strong>transient</strong> is a short, rapid burst of sound, usually at the beginning of a drum hit.</p>

      <p><strong>What it does:</strong> A Click or Snap control adds a short burst of higher-frequency content to the beginning of the sound.</p>

      <p><strong>What you hear:</strong> A stronger transient makes a drum sound sharper, punchier, and more defined.</p>

      <p><strong>Try it:</strong> Turn the transient control down, then slowly increase it while listening specifically to the first instant of the drum hit.</p>
    `
  },

  metallic: {
    title: 'Metallic Character',
    content: `
      <p><strong>Concept:</strong> Metallic character comes from additional tonal components that resemble the complex overtones of vibrating metal.</p>

      <p><strong>What it does:</strong> The Metallic control adds more metallic tonal content to the noise-based hi-hat.</p>

      <p><strong>What you hear:</strong> Higher values make the hi-hat more metallic, bell-like, or cymbal-like. Lower values leave more of the noise character.</p>

      <p><strong>Try it:</strong> Increase Metallic slowly and listen for tonal, ringing qualities appearing inside the noise.</p>
    `
  },

  brightness: {
    title: 'Brightness',
    content: `
      <p><strong>Concept:</strong> <strong>Brightness</strong> describes how much high-frequency content a sound contains.</p>

      <p><strong>What it does:</strong> The Brightness control changes the amount of high-frequency content in the sound.</p>

      <p><strong>What you hear:</strong> More brightness produces more sizzle, presence, and air. Less brightness produces a darker, softer sound.</p>

      <p><strong>Try it:</strong> Move Brightness from low to high and listen specifically to the high-frequency "air" of the sound.</p>
    `
  },

  body: {
    title: 'Body',
    content: `
      <p><strong>Concept:</strong> <strong>Body</strong> describes the low-frequency weight and fullness of a sound.</p>

      <p><strong>What it does:</strong> The Body control adds a lower-frequency component beneath the main tonal component of the tom.</p>

      <p><strong>What you hear:</strong> More Body makes the drum feel bigger, deeper, and fuller. Too much can make the sound feel muddy.</p>

      <p><strong>Try it:</strong> Start with Body at zero and gradually increase it. Listen for the low-frequency weight appearing underneath the main tone.</p>
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