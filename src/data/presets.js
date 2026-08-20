/**
 * Sound Presets
 * Factory presets demonstrating different synthesis settings
 */

export const presets = {
  kick: [
    {
      name: '808 Classic',
      params: {
        startFreq: 150,
        endFreq: 45,
        pitchDecay: 0.065,
        attack: 0.003,
        decay: 0.5,
        volume: 0.85,
        drive: 10,
        click: 0.15
      }
    },
    {
      name: '909 Punchy',
      params: {
        startFreq: 200,
        endFreq: 55,
        pitchDecay: 0.035,
        attack: 0.002,
        decay: 0.25,
        volume: 0.8,
        drive: 25,
        click: 0.4
      }
    },
    {
      name: 'Deep Sub',
      params: {
        startFreq: 100,
        endFreq: 35,
        pitchDecay: 0.08,
        attack: 0.005,
        decay: 0.7,
        volume: 0.9,
        drive: 5,
        click: 0.1
      }
    },
    {
      name: 'Tight & Clicky',
      params: {
        startFreq: 180,
        endFreq: 60,
        pitchDecay: 0.025,
        attack: 0.001,
        decay: 0.15,
        volume: 0.75,
        drive: 35,
        click: 0.6
      }
    },
    {
      name: 'Boom Box',
      params: {
        startFreq: 120,
        endFreq: 40,
        pitchDecay: 0.1,
        attack: 0.008,
        decay: 0.8,
        volume: 0.85,
        drive: 15,
        click: 0.2
      }
    }
  ],

  snare: [
    {
      name: '808 Snare',
      params: {
        toneFreq: 180,
        toneMix: 0.6,
        toneDecay: 0.12,
        noiseDecay: 0.18,
        filterFreq: 2500,
        filterQ: 1.0,
        attack: 0.001,
        volume: 0.7,
        snap: 0.4
      }
    },
    {
      name: '909 Crack',
      params: {
        toneFreq: 220,
        toneMix: 0.45,
        toneDecay: 0.08,
        noiseDecay: 0.12,
        filterFreq: 4000,
        filterQ: 1.5,
        attack: 0.001,
        volume: 0.75,
        snap: 0.65
      }
    },
    {
      name: 'Fat Clap',
      params: {
        toneFreq: 160,
        toneMix: 0.3,
        toneDecay: 0.06,
        noiseDecay: 0.2,
        filterFreq: 3500,
        filterQ: 0.8,
        attack: 0.002,
        volume: 0.7,
        snap: 0.55
      }
    },
    {
      name: 'Tight Snap',
      params: {
        toneFreq: 240,
        toneMix: 0.5,
        toneDecay: 0.05,
        noiseDecay: 0.08,
        filterFreq: 5000,
        filterQ: 1.2,
        attack: 0.001,
        volume: 0.7,
        snap: 0.8
      }
    },
    {
      name: 'Lo-Fi',
      params: {
        toneFreq: 150,
        toneMix: 0.7,
        toneDecay: 0.15,
        noiseDecay: 0.25,
        filterFreq: 1800,
        filterQ: 0.7,
        attack: 0.003,
        volume: 0.65,
        snap: 0.2
      }
    }
  ],

  'hihat-closed': [
    {
      name: 'Classic CH',
      params: {
        filterFreq: 8000,
        filterQ: 1.0,
        attack: 0.001,
        decay: 0.06,
        volume: 0.55,
        metallic: 0.25,
        brightness: 0.5
      }
    },
    {
      name: 'Tight',
      params: {
        filterFreq: 9000,
        filterQ: 1.2,
        attack: 0.001,
        decay: 0.03,
        volume: 0.5,
        metallic: 0.15,
        brightness: 0.6
      }
    },
    {
      name: 'Sizzle',
      params: {
        filterFreq: 7000,
        filterQ: 0.8,
        attack: 0.001,
        decay: 0.1,
        volume: 0.5,
        metallic: 0.4,
        brightness: 0.7
      }
    },
    {
      name: 'Dark',
      params: {
        filterFreq: 5000,
        filterQ: 0.9,
        attack: 0.002,
        decay: 0.08,
        volume: 0.55,
        metallic: 0.2,
        brightness: 0.3
      }
    },
    {
      name: 'Crispy',
      params: {
        filterFreq: 10000,
        filterQ: 1.5,
        attack: 0.001,
        decay: 0.04,
        volume: 0.45,
        metallic: 0.35,
        brightness: 0.9
      }
    }
  ],

  'hihat-open': [
    {
      name: 'Classic OH',
      params: {
        filterFreq: 6000,
        filterQ: 0.9,
        attack: 0.001,
        decay: 0.35,
        volume: 0.45,
        metallic: 0.35,
        brightness: 0.5
      }
    },
    {
      name: 'Washy',
      params: {
        filterFreq: 5000,
        filterQ: 0.7,
        attack: 0.002,
        decay: 0.6,
        volume: 0.4,
        metallic: 0.4,
        brightness: 0.45
      }
    },
    {
      name: 'Bright Ring',
      params: {
        filterFreq: 7500,
        filterQ: 1.2,
        attack: 0.001,
        decay: 0.45,
        volume: 0.45,
        metallic: 0.5,
        brightness: 0.75
      }
    },
    {
      name: 'Short Open',
      params: {
        filterFreq: 6500,
        filterQ: 1.0,
        attack: 0.001,
        decay: 0.2,
        volume: 0.5,
        metallic: 0.3,
        brightness: 0.55
      }
    },
    {
      name: 'Trashy',
      params: {
        filterFreq: 4500,
        filterQ: 1.4,
        attack: 0.001,
        decay: 0.5,
        volume: 0.5,
        metallic: 0.55,
        brightness: 0.4
      }
    }
  ],

  tom: [
    {
      name: 'High Tom',
      params: {
        startFreq: 280,
        endFreq: 140,
        pitchDecay: 0.06,
        attack: 0.003,
        decay: 0.2,
        volume: 0.7,
        body: 0.4,
        filterFreq: 3000
      }
    },
    {
      name: 'Mid Tom',
      params: {
        startFreq: 200,
        endFreq: 100,
        pitchDecay: 0.08,
        attack: 0.004,
        decay: 0.28,
        volume: 0.75,
        body: 0.5,
        filterFreq: 2500
      }
    },
    {
      name: 'Floor Tom',
      params: {
        startFreq: 140,
        endFreq: 65,
        pitchDecay: 0.1,
        attack: 0.005,
        decay: 0.4,
        volume: 0.8,
        body: 0.65,
        filterFreq: 2000
      }
    },
    {
      name: '808 Tom',
      params: {
        startFreq: 180,
        endFreq: 80,
        pitchDecay: 0.12,
        attack: 0.003,
        decay: 0.5,
        volume: 0.75,
        body: 0.55,
        filterFreq: 1800
      }
    },
    {
      name: 'Tight Rack',
      params: {
        startFreq: 250,
        endFreq: 120,
        pitchDecay: 0.04,
        attack: 0.002,
        decay: 0.15,
        volume: 0.7,
        body: 0.35,
        filterFreq: 3500
      }
    }
  ]
};

/**
 * Get presets for a specific sound type
 */
export function getPresetsForSound(soundType) {
  return presets[soundType] || [];
}

/**
 * Get all preset names
 */
export function getAllPresetNames() {
  const result = {};
  for (const [sound, soundPresets] of Object.entries(presets)) {
    result[sound] = soundPresets.map(p => p.name);
  }
  return result;
}
