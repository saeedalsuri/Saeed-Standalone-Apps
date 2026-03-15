import { ARTIST_BYPASS } from '../data/options';

// GENRE KNOWLEDGE BASE
// Extracted from user templates and general musical knowledge to enable "Creative" generation.
const GENRE_KNOWLEDGE = {
  "ghazal": {
    moods: ["Intimate", "Soulful", "Romantic", "Melancholic", "Poetic"],
    instruments: ["Harmonium", "Tabla", "Sarangi", "Acoustic Guitar", "Violin"],
    vocals: ["Male Vocal", "Female Vocal", "Velvety Baritone", "Urdu Poetry Delivery"],
    bpmRange: [60, 90],
    structureType: "ghazal"
  },
  "qawwali": {
    moods: ["Spiritual", "High-Energy", "Trance-inducing", "Devotional", "Ecstatic"],
    instruments: ["Aggressive Harmonium", "Fast Tabla", "Rhythmic Handclaps", "Dholak"],
    vocals: ["Ensemble Chorus", "Sufi Chanting", "Powerful Male Lead", "Antiphonal Call-and-Response"],
    bpmRange: [100, 130],
    structureType: "qawwali"
  },
  "dabke": {
    moods: ["Celebratory", "High-Energy", "Danceable", "Festive", "Powerful"],
    instruments: ["Mijwiz", "Tabl", "Electric Oud", "Synth Bass", "Darbuka"],
    vocals: ["Powerful Male Vocals", "Group Chants", "Zaghrouta (Ululation)"],
    bpmRange: [115, 130],
    structureType: "dance"
  },
  "khaleeji": {
    moods: ["Rhythmic", "Polished", "Romantic", "Warm", "Groovy"],
    instruments: ["Oud", "Violin Section", "Tar (Frame Drum)", "Mirwas", "Synth Pads"],
    vocals: ["Saudi Dialect", "Khaleeji Male Vocals", "Smooth Baritone"],
    bpmRange: [80, 110],
    structureType: "pop"
  },
  "techno": {
    moods: ["Hypnotic", "Dark", "Industrial", "Driving", "Futuristic"],
    instruments: ["909 Kick", "Acid Bass", "Modular Synths", "Hi-Hats"],
    vocals: ["Minimalist Chants", "Spoken Word", "Processed Vocals", "No Vocals"],
    bpmRange: [125, 140],
    structureType: "electronic"
  },
  "rock": {
    moods: ["Aggressive", "Anthemic", "Gritty", "Powerful", "Rebellious"],
    instruments: ["Distorted Electric Guitar", "Bass Guitar", "Drum Kit", "Overdrive"],
    vocals: ["Gritty Male Vocals", "Power Ballad Style", "Screamed Accents"],
    bpmRange: [110, 150],
    structureType: "standard"
  },
  "synthwave": {
    moods: ["Nostalgic", "Neon", "Cinematic", "Retro-Future", "Dreamy"],
    instruments: ["Analog Synths", "Drum Machine", "Arpeggiators", "Gated Reverb Snare"],
    vocals: ["Processed Male Vocals", "Robotic", "Reverb-heavy"],
    bpmRange: [100, 120],
    structureType: "electronic"
  }
};

const DEFAULT_TRAITS = {
  moods: ["Cinematic", "Polished", "Atmospheric"],
  instruments: ["Piano", "Synths", "Drum Machine", "Strings"],
  vocals: ["Clean Vocals"],
  bpmRange: [90, 120],
  structureType: "standard"
};

// HELPER: Random Picker
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickMultiple = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).join(", ");
};

export const SunoLogicCore = {
  // 1. Artist-to-Descriptor Database
  getArtistDescriptor: (artistName) => {
    const normalizedName = artistName.toLowerCase();
    const match = Object.keys(ARTIST_BYPASS).find(key => key.toLowerCase() === normalizedName);
    if (match) return ARTIST_BYPASS[match];
    
    // Quick fallback for common ones not in main list
    if (normalizedName.includes("santana")) return "Latin Rock, soulful overdriven electric guitar, congas";
    if (normalizedName.includes("hans zimmer")) return "Epic Orchestral, Cinematic, Big Drums, Suspense";
    
    return null;
  },

  // 2. Attribute Detector
  detectAttributes: (inputString) => {
    const lowerInput = inputString.toLowerCase();
    let detectedGenreKey = null;

    // Find longest matching genre key (e.g. prioritize "synthwave" over "synth")
    for (const key of Object.keys(GENRE_KNOWLEDGE)) {
      if (lowerInput.includes(key)) {
        detectedGenreKey = key;
        break; 
      }
    }
    
    // Fallbacks if no exact key
    if (!detectedGenreKey) {
        if (lowerInput.includes("saudi") || lowerInput.includes("kuwait")) detectedGenreKey = "khaleeji";
        if (lowerInput.includes("sufi")) detectedGenreKey = "qawwali";
        if (lowerInput.includes("lebanese") || lowerInput.includes("syrian")) detectedGenreKey = "dabke";
        if (lowerInput.includes("metal")) detectedGenreKey = "rock";
        if (lowerInput.includes("cyberpunk")) detectedGenreKey = "synthwave";
    }

    return {
      key: detectedGenreKey,
      knowledge: detectedGenreKey ? GENRE_KNOWLEDGE[detectedGenreKey] : DEFAULT_TRAITS,
      originalInput: inputString
    };
  },

  // 3. Metric Modulation (Kept from before)
  calculateModulation: (baseBpm, tuplet) => {
    if (!baseBpm || !tuplet) return { bpm: 0, description: '' };
    const modulated = Math.round((baseBpm / tuplet) * 4);
    return {
      bpm: modulated,
      description: `Metric Modulation: Derived from ${baseBpm} BPM by a ${tuplet}:4 modulation.`
    };
  },

  // 4. Creative Prompt Generator (The Core Logic)
  generateCreativePrompt: (userInput) => {
    const { key, knowledge, originalInput } = SunoLogicCore.detectAttributes(userInput);

    // Bpm Generation
    const bpm = Math.floor(Math.random() * (knowledge.bpmRange[1] - knowledge.bpmRange[0] + 1)) + knowledge.bpmRange[0];
    
    // Attribute Selection (Creative Mix)
    const selectedMood = pickRandom(knowledge.moods);
    const selectedInstruments = pickMultiple(knowledge.instruments, 3);
    const selectedVocals = pickRandom(knowledge.vocals);

    // Construct Style String (Golden Formula)
    // [Goal]: "Intimate Urdu Ghazal-Qawwali Hybrid, Nusrat Style. 66 BPM, 4/4 time. Features soulful male tenor vocals... High-fidelity acoustic production."
    
    // Check for Artist Override in input
    let artistDesc = SunoLogicCore.getArtistDescriptor(userInput);
    let baseGenre = artistDesc ? artistDesc : `${originalInput}`; 

    const styleParts = [
      `${baseGenre}`,                                      // Base Genre / Artist
      `${selectedMood}`,                                   // Mood
      `${bpm} BPM`,                                        // Tempo
      `Features ${selectedVocals}`,                        // Vocals
      `${selectedInstruments}`,                            // Instruments
      "High Fidelity, Clean Mix, 2026 Production"          // Production Standards
    ];

    const finalStyle = styleParts.join(", ");

    // Generate Structure
    const structure = SunoLogicCore.generateLyricsSkeleton(knowledge.structureType, selectedInstruments, selectedVocals);
    
    // Name Generation
    const name = `${originalInput} (${key ? key.charAt(0).toUpperCase() + key.slice(1) : 'Custom'} Style) (${bpm} BPM)`;

    return {
      name: name,
      bpm: bpm.toString(),
      style: finalStyle,
      structure: structure
    };
  },

  // 5. Smart Structure Generator
  generateLyricsSkeleton: (type, mainInstrument = "Instrumental", vocalType = "Vocals") => {
    // Basic Meta-Tags for all
    const intro = `[Intro] [Atmospheric build-up, ${mainInstrument.split(',')[0]} solo]`;
    const outro = `[Outro] [Fade out with ${mainInstrument.split(',')[0]} melody]`;

    if (type === "ghazal") {
      return `${intro}\n\n[Verse 1]\n{V1}\n\n[Instrumental Response] [Melodic Sarangi response riff]\n[Verse 2]\n{V2}\n\n[Chorus] [The Matla: Melodic peak, vocal melisma]\n{CHORUS}\n\n[Instrumental Solo] [Technical Harmonium solo]\n\n[Verse 3]\n{V3}\n\n[Breakdown] [Stripped back: intimate solo vocal]\n[Verse 4]\n{V4}\n\n[Chorus] [Full melodic intensity, vocal improvisation]\n{CHORUS}\n\n[Bridge Solo] [Dramatic build-up]\n[Bridge]\n{BRIDGE}\n\n${outro}\n[End]`;
    }

    if (type === "qawwali") {
      return `${intro}\n\n[Verse 1]\n{V1}\n\n[Instrumental Response] [Fast Tabla rolls]\n[Verse 2]\n{V2}\n\n[Chorus] [Uplifting Matla: Rhythmic hand-clapping, explosive ensemble]\n{CHORUS}\n\n[Instrumental Solo] [Technical Harmonium solo with rapid-fire Tabla]\n\n[Verse 3]\n{V3}\n\n[Breakdown] [Low register solo vocal, building back to trance]\n[Verse 4]\n{V4}\n\n[Chorus] [Maximum trance intensity, full ensemble return]\n{CHORUS}\n\n[Bridge Solo] [Aggressive Antiphonal duel]\n[Bridge]\n{BRIDGE}\n\n${outro}\n[End]`;
    }

    if (type === "electronic" || type === "dance") {
       return `${intro}\n\n[Verse 1]\n{V1}\n\n[Build-Up] [Rising tension]\n[Verse 2]\n{V2}\n\n[Chorus] [The Drop: High energy, heavy bass]\n{CHORUS}\n\n[Instrumental Solo] [Synth/Instrument Lead Solo]\n\n[Verse 3]\n{V3}\n\n[Breakdown] [Stripped back beat, focus on rhythm]\n[Verse 4]\n{V4}\n\n[Chorus] [Full energy peak, maximum volume]\n{CHORUS}\n\n[Bridge Solo] [Atmospheric breakdown before final drop]\n[Bridge]\n{BRIDGE}\n\n${outro}\n[End]`;
    }

    // Standard Pop/Rock
    return `${intro}\n\n[Verse 1]\n{V1}\n\n[Pre-Chorus]\n[Verse 2]\n{V2}\n\n[Chorus] [Anthemic, Catchy Hook]\n{CHORUS}\n\n[Instrumental Solo] [Melodic ${mainInstrument.split(',')[0]} Solo]\n\n[Verse 3]\n{V3}\n\n[Breakdown] [Soft vocals, minimal instrumentation]\n[Verse 4]\n{V4}\n\n[Chorus] [Grand Finale, layered harmonies]\n{CHORUS}\n\n[Bridge Solo] [Building tension]\n[Bridge]\n{BRIDGE}\n\n${outro}\n[End]`;
  },
  
  // 6. Filter (Kept from before)
  filterPrompt: (prompt) => {
    let cleanPrompt = prompt.toLowerCase();
    if (cleanPrompt.includes("no drums")) cleanPrompt = cleanPrompt.replace("no drums", "acoustic focus, percussion-free");
    if (cleanPrompt.includes("no vocals")) return "[Instrumental]"; 
    const noise = ["4k", "masterpiece", "award-winning", "trending on artstation"];
    noise.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        cleanPrompt = cleanPrompt.replace(regex, "");
    });
    return cleanPrompt.trim();
  }
};
