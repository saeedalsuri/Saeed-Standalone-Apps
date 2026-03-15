import { ARTIST_BYPASS } from '../data/options.js';

// GENRE KNOWLEDGE BASE (V5.6 Update)
const GENRE_KNOWLEDGE = {
  "ghazal": {
    moods: ["Intimate", "Soulful", "Romantic", "Melancholic", "Poetic", "Breezy", "Indie-Fusion"],
    instruments: ["Harmonium", "Tabla", "Sarangi", "Acoustic Guitar", "Violin", "London Rain FX", "Matka (Clay Pot)", "Funky Electric Bass"],
    leadInstruments: ["Sarangi", "Harmonium", "Violin", "Acoustic Guitar", "Clean Electric Guitar", "Piano"],
    vocals: ["Velvety Vocals", "Urdu Poetry Delivery", "Emotive Vocal Performance", "Soft & Breathy", "Male and Female Duet"],
    bpmRange: [60, 102],
    structureType: "ghazal"
  },
  "qawwali": {
    moods: ["Spiritual", "High-Energy", "Trance-inducing", "Devotional", "Ecstatic", "Raw", "Punjabi"],
    instruments: ["Aggressive Harmonium", "Fast Tabla", "Rhythmic Handclaps", "Dholak", "Indian Banjo (Bulbul Tarang)"],
    leadInstruments: ["Harmonium", "Vocal Improvisation", "Tabla", "Indian Banjo"],
    vocals: ["Ensemble Chorus", "Sufi Chanting", "Powerful Lead Vocals", "Antiphonal Call-and-Response", "Group Shout"],
    bpmRange: [105, 165],
    structureType: "qawwali"
  },
  "dabke": {
    moods: ["Celebratory", "High-Energy", "Danceable", "Festive", "Powerful", "Urban Beirut", "Mijwiz-heavy"],
    instruments: ["Mijwiz (Reed Flute)", "Zurna (Shawm)", "Davul (Deep Drum)", "Electric Oud", "Synth Bass", "Darbuka", "Synth Strings", "Zaghrouta FX"],
    leadInstruments: ["Mijwiz (Reed Flute)", "Zurna", "Electric Oud", "Nay", "Arghul (Reed)", "Rababa", "Accordion"],
    vocals: ["Powerful Vocals", "Group Chants", "Zaghrouta (Ululation)", "High-Energy Delivery", "Melismatic"],
    bpmRange: [115, 130],
    structureType: "dance"
  },
  "khaleeji": {
    moods: ["Rhythmic", "Polished", "Romantic", "Warm", "Groovy", "Khabbaiti (6/8)", "Dosari", "Gulf Pop", "Samri"],
    instruments: ["Oud", "Qanoon", "Ney Flute", "Middle Eastern Strings", "Frame Drum (Daf)", "Rhythmic Handclaps", "Accordion", "Synth Keyboard", "Electric Oud", "808 Sub-bass"],
    leadInstruments: ["Oud", "Violin", "Qanoon", "Ney Flute", "Accordion", "Synthesizer", "Mizmar", "Rababa", "Electric Guitar", "Cello"],
    vocals: ["Saudi Dialect Delivery", "Warm Vocals", "Melismatic Style", "Emotive Performance", "Bedouin Accent", "Group Clapping"],
    bpmRange: [80, 112],
    structureType: "pop"
  },
  "maghreb": {
    moods: ["Funky", "Urban", "Celebratory", "Hypnotic", "Gnawa-Fusion", "Rai Pop"],
    instruments: ["Electric Oud", "Bendir", "Darbuka", "Taarija", "Accordion", "808 Bass", "Guembri (Bass)", "Iron Castanets (Qraqeb)", "Synth Lead", "Mizmar"],
    leadInstruments: ["Electric Oud", "Accordion", "Ghaita (Oboe)", "Loutar", "Guembri", "Synthesizer"],
    vocals: ["Autotuned Oran Vocals", "Rai Hook", "Group Chanting", "Rap Flow", "Cheb Style"],
    bpmRange: [105, 145],
    structureType: "dance"
  },
  "latin": {
    moods: ["Passionate", "Fiery", "Groovy", "Summer", "Danceable", "Psychedelic"],
    instruments: ["Nylon String Guitar", "Congas", "Timbales", "Hammond B3 Organ", "Brass Section", "Guiro", "Hand Claps", "Singing Electric Guitar (Sustain)"],
    leadInstruments: ["Overdriven Electric Guitar (Santana Style)", "Nylon String Guitar", "Trumpet", "Hammond B3 Organ"],
    vocals: ["Passionate Vocals", "Group Chorus", "Staccato Delivery", "Soulful Male"],
    bpmRange: [110, 128],
    structureType: "standard"
  },
  "drill": {
    moods: ["Dark", "Aggressive", "Cinematic", "Urban", "Gritty"],
    instruments: ["Stuttering Hi-Hats", "Aggressive 808 Slides", "Dark Cinematic Strings", "Bell Melody", "Deep Kick"],
    leadInstruments: ["Filtered Synth", "Dark Piano", "Distorted 808"],
    vocals: ["Aggressive Flow", "Autotuned Ad-libs", "Fast Paced"],
    bpmRange: [135, 145],
    structureType: "electronic"
  },
  "afrobeat": {
    moods: ["Groovy", "Chill", "Summer", "Infectious", "Danceable", "Mid-African", "Polyrhythmic"],
    instruments: ["Slap Bass", "High-Life Guitar", "Shaker", "Talking Drum", "Log Drum", "Brass Section", "Kalimba", "Balafon"],
    leadInstruments: ["Saxophone", "High-Life Guitar", "Synth Solo", "Brass Section", "Kalimba"],
    vocals: ["Relaxed Delivery", "Catchy Chorus", "Multi-layered Harmony", "Chanting"],
    bpmRange: [100, 118],
    structureType: "pop"
  },
  "ottoman": {
    moods: ["Majestic", "Classical", "Melancholic", "Grand", "Traditional"],
    instruments: ["Acoustic Qanoon", "Ney Flute", "Oud", "Tanbur (Lute)", "Kemençe (Violin)", "Bendir", "Kudum"],
    leadInstruments: ["Qanoon", "Ney", "Tanbur", "Kemençe", "Oud"],
    vocals: ["Classical Choire", "Melismatic Solo", "Muwashah Style"],
    bpmRange: [70, 90],
    structureType: "ghazal"
  },
  "techno": {
    moods: ["Hypnotic", "Dark", "Industrial", "Driving", "Futuristic", "Cyberpunk", "Neon"],
    instruments: ["909 Kick", "Acid Bass", "Modular Synths", "Hi-Hats", "Arpeggiators", "Glitch Textures"],
    leadInstruments: ["Acid 303 Line", "Modular Synth", "Sawtooth Lead", "Distorted Bass"],
    vocals: ["Minimalist Chants", "Spoken Word", "Processed Vocals", "No Vocals", "Robotic"],
    bpmRange: [124, 140],
    structureType: "electronic"
  },
  "rock": {
    moods: ["Aggressive", "Anthemic", "Gritty", "Powerful", "Rebellious", "Stadium"],
    instruments: ["Distorted Electric Guitar", "Bass Guitar", "Drum Kit", "Overdrive", "Crash Cymbals"],
    leadInstruments: ["Electric Guitar", "Distorted Guitar", "Bass Guitar"],
    vocals: ["Gritty Vocals", "Power Ballad Style", "Screamed Accents", "Raw Emotion"],
    bpmRange: [110, 150],
    structureType: "standard"
  },
  "synthwave": {
    moods: ["Nostalgic", "Neon", "Cinematic", "Retro-Future", "Dreamy"],
    instruments: ["Analog Synths", "Drum Machine", "Arpeggiators", "Gated Reverb Snare", "DX7 Keys"],
    leadInstruments: ["Analog Synth", "Keytar", "Saxophone", "Electric Guitar"],
    vocals: ["Processed Vocals", "Robotic", "Reverb-heavy", "Dreamy Delivery"],
    bpmRange: [100, 120],
    structureType: "electronic"
  },
  "orchestral": {
    moods: ["Heroic", "Triumphant", "Majestic", "Military", "Epic", "Patriotic", "Cinematic"],
    instruments: ["Marching Snare", "Heavy Bass Drum", "Marching Toms", "Timpani", "Brass Section", "Tuba", "French Horn", "Woodwinds", "Violin Section"],
    leadInstruments: ["Trumpet", "French Horn", "Flute", "Piccolo", "Brass Section", "Solo Violin", "Cello"],
    vocals: ["Choir Ensemble", "Group Chant", "Strong Vocal Projection", "No Vocals (Instrumental)"],
    bpmRange: [108, 120],
    structureType: "march"
  },
  "country": {
    moods: ["Storytelling", "Heartfelt", "Sincere", "Acoustic", "Nostalgic"],
    instruments: ["Acoustic Guitar", "Pedal Steel", "Fiddle", "Banjo", "Brush Drums", "Upright Bass"],
    leadInstruments: ["Fiddle", "Pedal Steel", "Harmonica", "Acoustic Guitar"],
    vocals: ["Twangy Vocals", "Deep Baritone", "Storyteller Style"],
    bpmRange: [70, 110],
    structureType: "standard"
  },
  "turkish": {
    moods: ["Tragic", "Romantic", "Melancholic", "Longing", "Modern Arabesque", "Neo-Tarab"],
    instruments: ["Bowed String Section", "Emotional Accordion", "G-Clarinet", "Rhythmic Darbuka", "Violin Section", "Piano"],
    leadInstruments: ["Haunting Ney Flute", "Plucked Acoustic Oud", "G-Clarinet", "Emotional Accordion", "Electric Oud"],
    vocals: ["Emotive male vocals", "Heavy melisma", "Charismatic delivery", "Male and Female Duet"],
    bpmRange: [68, 85],
    structureType: "ghazal"
  },
  "farsi": {
    moods: ["Poetic", "Melancholic", "Sophisticated", "Romantic", "Modern Iranian Pop", "1970s Retro Drama", "Cinematic Exile", "Tehran Cosmopolitan", "Pastoral Folk", "Dastgah Classical", "Psychedelic Fusion"],
    instruments: ["Tar", "Setar", "Santur", "Kamancheh", "Piano", "Violin Section", "Tombak", "Cello", "Deep Melodic Electric Bass", "Solo Flute", "Farfisa Organ", "Fuzzy Electric Guitar", "Dotar", "Dayereh"],
    leadInstruments: ["Tar", "Setar", "Santur", "Kamancheh", "Violin", "Piano", "Cello", "Deep Melodic Electric Bass", "Farfisa Organ", "Dotar"],
    vocals: ["Classical Persian Vocals", "Tahrir (Vocal ornamentation)", "Soft Pop Dual Vocals", "Deep Emotive Female Mezzo", "Poetic Delivery", "Vintage Rasp", "Breathy Delivery", "Avaz-style Vocals"],
    bpmRange: [75, 115],
    structureType: "ghazal"
  },
  "afghan": {
    moods: ["Folk", "Nostalgic", "Rhythmic", "Traditional Kabul Style", "Happy", "Pashtun Folk", "Kabuli Classical", "Northern Folk", "Herati Style"],
    instruments: ["Afghan Rubab", "Harmonium", "Zerbaghali (Goblet Drum)", "Tabla", "Dambura", "Ghaychak (Bowed Fiddle)", "Tula (Wooden Flute)", "Dutar"],
    leadInstruments: ["Afghan Rubab", "Harmonium", "Dambura", "Ghaychak"],
    vocals: ["High-pitched vocals", "Passionate delivery", "Male and Female Duet"],
    bpmRange: [85, 145],
    structureType: "standard"
  },
  "pashto": {
    moods: ["Tribal", "High-Energy", "Attan Rhythm", "Folk", "Celebratory"],
    instruments: ["Pashto Rubab", "Dhol", "Harmonium", "High-pitched Flute", "Mangai (Pitcher)"],
    leadInstruments: ["Pashto Rubab", "High-pitched Flute", "Harmonium"],
    vocals: ["High-pitched female vocal", "Powerful male vocals", "Group Chants"],
    bpmRange: [95, 140],
    structureType: "dance"
  },
  "bollywood": {
    moods: ["Filmi", "Item Number", "Romantic Playback", "Sufi-Fusion", "Grand Orchestral", "Nostalgic 90s", "Desi Hip-Hop"],
    instruments: ["Cinematic Strings", "Dhol", "Tabla", "Synthesizer", "Harmonium", "Shehnai (Wedding Oboe)", "Electric Guitar", "Sarangi", "Bansuri (Flute)"],
    leadInstruments: ["Bansuri", "Sarangi", "Electric Guitar", "Synthesizer", "Violin Section"],
    vocals: ["Playback Singer (High Fidelity)", "Melismatic", "Shruti-bending", "High-Pitched Female", "Deep Male Baritone"],
    bpmRange: [90, 135],
    structureType: "standard"
  },
  "lebanese": {
    moods: ["Beirut Nightlife", "Romantic", "Sentimental", "High-Energy", "Nostalgic 90s", "Celebratory", "East-meets-West Fusion", "Clear Melodic"],
    instruments: ["Mijwiz (Reed Flute)", "Accordion", "Lush Synth-Strings", "Electronic Drums", "Darbuka Accents", "Vintage Synth-Strings", "Mijwiz-style synth"],
    leadInstruments: ["Accordion", "Mijwiz", "Synth-Strings"],
    vocals: ["Lebanese Dialect (Beirut Sound)", "Softer Pronunciation", "Clear Emotive Vocals", "Superstar Pop Style", "Romantic Persona"],
    bpmRange: [110, 125],
    structureType: "dance"
  }
};

const DEFAULT_TRAITS = {
  moods: ["Cinematic", "Polished", "Atmospheric"],
  instruments: ["Piano", "Synths", "Drum Machine", "Strings"],
  leadInstruments: ["Piano", "Cello", "Violin", "Synth"],
  vocals: ["Clean Vocals"],
  bpmRange: [90, 120],
  structureType: "standard"
};

const InstrumentAdherence = {
    forceHeroInstrument: (instr) => `${instr}-led melodic theme, prominent ${instr}`,
    generateSoloTag: (instr, desc = "Technical solo") => `[Extended ${instr} Solo | ${desc}]`,
    rhythmAnchor: (tag) => `${tag} . . ! !! . !`
};

const AfghanIdentity = {
    forceRubab: () => "prominent Afghan Rubab, plucked mulberry wood lute, percussive strings",
    percussionLogic: (style) => style.includes("classical") || style.includes("kabuli") ? "Afghan Tablah pair" : "Zerbaghali goblet drum"
};

const LebaneseIdentity = {
    getAnchor: (input) => {
        const lower = input.toLowerCase();
        if (lower.includes("dabke")) return "Lebanese Dabke-Pop, Mijwiz lead, driving electronic beat, energetic clapping";
        if (lower.includes("ballad") || lower.includes("romantic")) return "Lebanese Pop Ballad, lush synth-strings, melodic accordion, sentimental";
        if (lower.includes("90s") || lower.includes("vintage")) return "90s Lebanese Superstar style, vintage production, catchy pop hooks";
        if (lower.includes("dialect") || lower.includes("beirut")) return "Lebanese dialect, Beirut articulation, clear emotive vocals";
        return "Lebanese Pop, Levantine musical profile, Bayati and Rast Maqams mixed with Western harmonies";
    },
    tashkeelHack: " [Pro-Hack: Use Tashkeel (diacritics) on Arabic text to lock in Beirut vowels]"
};

const PersianIdentity = {
    getAnchor: (input) => {
        const lower = input.toLowerCase();
        if (lower.includes("googoosh") || lower.includes("hejrat") || lower.includes("1970s") || lower.includes("varoujan")) {
            return "1970s Iranian Pop, Googoosh style, Varoujan-inspired orchestration, 82 BPM. Features a deep melodic electric bassline and dramatic cinematic strings.";
        }
        if (lower.includes("classical") || lower.includes("dastgah") || lower.includes("avaz")) {
            return "Persian Traditional Classical, Dastgah system, soulful and spiritual. Features prominent Tar, Santur, and Kamancheh.";
        }
        if (lower.includes("folk") || lower.includes("pastoral")) {
            return "Local Iranian Folk music, pastoral atmosphere. Features Dotar and earthy percussion.";
        }
        return "Modern Iranian Pop, Tehran cosmopolitan style, melodic and atmospheric.";
    },
    natureMetaphor: " Poetic Persian lyrics, metaphors of nature, sea, and forest.",
    vocalTrick: (input) => {
        const lower = input.toLowerCase();
        if (lower.includes("classical") || lower.includes("avaz")) return "Authentic Avaz vocals, Classical Tahrir ornamentation.";
        if (lower.includes("googoosh") || lower.includes("1970s")) return "Emotive female vocals with a slight vintage rasp, breathy and intimate.";
        return "Authentic Farsi articulation, Tahrir technique, clear melodic delivery.";
    }
};

const UKGhazalIdentity = {
    getAnchor: () => "Authentic UK Studio Ghazal, Traditional Urdu Poetic Soul, 78 BPM. Features a deep emotive Sarangi melody and soft resonant Harmonium. Steady heartbeat Tabla rhythm with high-fidelity British-Asian studio production. Pristine UK vocal mix.",
    vibe: "Intimate and soulful atmospheric textures, subtle London rain field recordings, clean professional acoustic production. Sophisticated and melodic."
};

const OrchestraLogic = {
    hollywood: "Hollywood cinematic orchestra, lush string section, swept violins, 4k production",
    bollywood: "Bollywood playback orchestra, melodic strings, dramatic ney flute, rhythmic dholak foundation",
    lush: "Lush strings only, slow attack, high sustain, ethereal orchestral pads"
};

const SoftBlendLogic = {
    bridgeKeywords: ["Atmospheric", "Lush", "Spacious", "Minimalist", "Soft pads", "Warm saturation"],
    negativeWeights: ["No Distorted", "No Heavy", "No Aggressive", "No Electronic Lead", "Spacious", "Minimalist"],
    getGlobalSuffix: () => " Spacious, airy mix, high clarity, gentle and smooth.",
    applySafety: (style) => {
        let safeStyle = style;
        const exclusions = ["Distorted", "Heavy", "Aggressive", "Electronic Lead", "Hard", "Fast-paced"];
        exclusions.forEach(word => { safeStyle = safeStyle.replace(new RegExp(`\\b${word}\\b`, 'gi'), ""); });
        return safeStyle;
    }
};

const JUNK_TOKENS = ["good", "nice", "beautiful", "amazing", "cool", "best", "perfect", "masterpiece", "trending", "stunning", "great"];

const LogicHierarchy = {
    sanitize: (text) => {
        let clean = text.toLowerCase();
        JUNK_TOKENS.forEach(token => { clean = clean.replace(new RegExp(`\\b${token}\\b`, 'gi'), ""); });
        clean = clean.replace(/\bghostly\b/g, "spacious reverb with slow attack");
        clean = clean.replace(/\bneon\b/g, "warm analog synth pads");
        clean = clean.replace(/\becho\b/g, "clean delay tail");
        return clean.trim();
    },
    assembleDNA: (data) => {
        const { genre, era, instruments, vocals, mood, mix } = data;
        return `${genre}, ${era}, ${instruments}, ${vocals}, ${mood}, ${mix}`.replace(/,\s*,/g, ",").trim();
    }
};

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickMultiple = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).join(", ");
};

export const SunoLogicCore = {
  getArtistDescriptor: (artistName) => {
    const normalizedName = artistName.toLowerCase();
    const match = Object.keys(ARTIST_BYPASS).find(key => key.toLowerCase() === normalizedName);
    if (match) return ARTIST_BYPASS[match];
    if (normalizedName.includes("hans zimmer")) return "Epic Orchestral, Cinematic, Big Drums, Suspense";
    if (normalizedName.includes("nusrat")) return "Powerful Qawwali, Harmonium, Tabla, Sufi Chant";
    return null;
  },

  detectAttributes: (inputString) => {
    const lowerInput = inputString.toLowerCase();
    let detectedGenreKey = null;

    for (const key of Object.keys(GENRE_KNOWLEDGE)) {
      if (lowerInput.includes(key)) {
        detectedGenreKey = key;
        break; 
      }
    }
    
    if (!detectedGenreKey) {
        if (lowerInput.includes("afghan") || lowerInput.includes("kabul")) detectedGenreKey = "afghan";
        else if (lowerInput.includes("pashto") || lowerInput.includes("attan")) detectedGenreKey = "pashto";
        else if (lowerInput.includes("turkish")) detectedGenreKey = "turkish";
        else if (lowerInput.includes("persian") || lowerInput.includes("iranian")) detectedGenreKey = "farsi";
        else if (lowerInput.includes("sufi") || lowerInput.includes("qawwali")) detectedGenreKey = "qawwali";
        else if (lowerInput.includes("khaleeji")) detectedGenreKey = "khaleeji";
        else if (lowerInput.includes("lebanese")) detectedGenreKey = "lebanese";
        else if (lowerInput.includes("dabke")) detectedGenreKey = "dabke";
        else if (lowerInput.includes("maghreb")) detectedGenreKey = "maghreb";
        else if (lowerInput.includes("bollywood")) detectedGenreKey = "bollywood";
        else if (lowerInput.includes("trap") || lowerInput.includes("drill")) detectedGenreKey = "drill";
        else if (lowerInput.includes("synthwave")) detectedGenreKey = "synthwave";
        else if (lowerInput.includes("rock")) detectedGenreKey = "rock";
        else if (lowerInput.includes("marching")) detectedGenreKey = "orchestral";
        else if (lowerInput.includes("latin") || lowerInput.includes("santana")) detectedGenreKey = "latin";
    }

    return {
      key: detectedGenreKey,
      knowledge: detectedGenreKey ? GENRE_KNOWLEDGE[detectedGenreKey] : DEFAULT_TRAITS,
      originalInput: inputString
    };
  },

  calculateModulation: (baseBpm, tuplet) => {
    if (!baseBpm || !tuplet) return { bpm: 0, description: '' };
    const modulated = Math.round((baseBpm / tuplet) * 4);
    return { bpm: modulated, description: `(Tempo ${modulated} BPM. Metric Modulation: derived from ${baseBpm} BPM by ${tuplet}:4 Modulation.)` };
  },

  generateCreativePrompt: (userInput, isDuet = false, isSoftBlend = false) => {
    const { key, knowledge, originalInput } = SunoLogicCore.detectAttributes(userInput);
    const lowerInput = userInput.toLowerCase();

    if (isSoftBlend || lowerInput.includes("soft blend")) {
        if (key === "ghazal" || lowerInput.includes("ghazal")) {
            return {
                name: "Ethereal Urdu Ghazal [Soft Blend]",
                bpm: "72",
                style: "Traditional Urdu Ghazal, Ethereal Ambient. Harmonium and minimal Tabla. Soft synthetic pads. Warm acoustic production. Intimate male vocals. Gentle and smooth.",
                structure: "[Intro] [Solo Harmonium in wide reverb]\n\n[Verse 1]\n{V1}\n\n[Chorus] [Subtle warm pads]\n{CHORUS}\n\n[Outro] [Harmonium fade]\n[End]"
            };
        }
        if (key === "farsi" || lowerInput.includes("persian")) {
            return {
                name: "Persian Silk Chillout [Soft Blend]",
                bpm: "85",
                style: "Sophisticated Persian Pop, Soft Chillout. Santur arpeggios, gentle downtempo beat. Elegant strings. Soft brethy female vocals. Polished and smooth.",
                structure: "[Intro] [Santur and soft brushes]\n\n[Verse 1]\n{V1}\n\n[Chorus] [Smooth string swell]\n{CHORUS}\n\n[Outro] [Fading Santur]\n[End]"
            };
        }
    }

    const bpmMatch = userInput.match(/(\d+)\s*bpm/i);
    const bpm = bpmMatch ? parseInt(bpmMatch[1]) : Math.floor(Math.random() * (knowledge.bpmRange[1] - knowledge.bpmRange[0] + 1)) + knowledge.bpmRange[0];
    
    const selectedMood = pickRandom(knowledge.moods);
    const leadInstr = pickRandom(knowledge.leadInstruments || knowledge.instruments);
    const instrList = pickMultiple(knowledge.instruments, 3);
    const vocals = pickRandom(knowledge.vocals);

    const artistDesc = SunoLogicCore.getArtistDescriptor(userInput);
    const cleanIn = LogicHierarchy.sanitize(originalInput.replace(/^(a|an)\s+/i, ""));
    const spine = artistDesc ? artistDesc : cleanIn;

    let era = "2026 production";
    if (lowerInput.includes("70s")) era = "1970s analog";
    else if (lowerInput.includes("90s")) era = "90s superstar";

    let vocalDesc = isDuet ? "Male and Female Duet, [Stacked Harmonies]" : `Features ${vocals}, [Clear Articulation]`;
    let activeGenre = spine;
    let lang = "";

    if (key === "turkish") { activeGenre = `Turkish ${activeGenre}`; lang = " Turkish lyrics."; }
    if (key === "khaleeji") { activeGenre = `Oriental Arabesque, ${activeGenre}`; lang = " Arabic lyrics, [Melismatic]."; }
    if (key === "lebanese") { activeGenre = `Oriental, ${LebaneseIdentity.getAnchor(cleanIn)}`; lang = ` Lebanese dialect.${LebaneseIdentity.tashkeelHack}`; }
    if (key === "farsi") { activeGenre = PersianIdentity.getAnchor(cleanIn); lang = ` Farsi lyrics.${PersianIdentity.natureMetaphor}`; }
    if (lowerInput.includes("uk ghazal") || (lowerInput.includes("london") && lowerInput.includes("ghazal"))) {
        const ukStyle = UKGhazalIdentity.getAnchor();
        return {
            name: `${cleanIn} (UK Studio Ghazal) (${bpm} BPM)`,
            bpm: "78",
            style: LogicHierarchy.sanitize(ukStyle),
            structure: `[Intro | Soft London rain textures | Soulful Sarangi Taksim | Melodic Harmonium drone | [Energy: Low]]\n\n[Verse 1 | Intimate & Soulful]\n{V1}\n\n[Pre-Chorus | Subtle Harmonic Swells]\n{VPRE}\n\n[Verse 2 | Building Emotional Depth]\n{V2}\n\n[Chorus | The Matla | Pristine High-Fidelity Vocals | Heartbeat Tabla | Energy: Medium-High]\n{CHORUS}\n\n[Instrumental Solo | Technical Sarangi and Tabla conversation | UK Studio Clarity]\n${InstrumentAdherence.rhythmAnchor("!")}\n\n[Verse 3 | Emotional Peak]\n{V3}\n\n[Breakdown | Minimalist Harmonium | Focus on Poetic Diction]\n{V4}\n\n[Bridge | Atmospheric Cello & Sarangi Rise]\n{BRIDGE}\n\n[Chorus | Balanced Grandeur | Full Acoustic Ensemble | [Soulful Climax]]\n{CHORUS}\n\n[Outro | Fading Sarangi melody | Gentle rain sounds fade out]\n[End]`
        };
    }

    let style = LogicHierarchy.assembleDNA({
        genre: activeGenre,
        era: era,
        instruments: `${InstrumentAdherence.forceHeroInstrument(leadInstr)}, ${instrList}`,
        vocals: vocalDesc,
        mood: `${selectedMood} energy, [Add Tension]`,
        mix: "Spacious mix, high fidelity, [Reverb Tail]"
    });

    if (lang) style += ` ${lang}`;
    if (isSoftBlend) style = SoftBlendLogic.applySafety(style) + SoftBlendLogic.getGlobalSuffix();
    style = LogicHierarchy.sanitize(style);

    return {
      name: `${cleanIn} (${key || 'Custom'})${isSoftBlend ? ' [Soft Blend]' : ''} (${bpm} BPM)`,
      bpm: bpm.toString(),
      style: style,
      structure: SunoLogicCore.generateLyricsSkeleton(knowledge.structureType, leadInstr, vocals, isDuet)
    };
  },

  generateLyricsSkeleton: (type, leadInstr = "Instrument", vocalType = "Vocals", isDuet = false) => {
    const intro = `[Intro | Atmospheric build-up | ${leadInstr} solo | [Energy: Low]]`;
    const outro = `[Outro | Fade out | ${leadInstr} melody | [Energy: Low]]`;
    const chorus = isDuet ? "[Chorus | Duet Harmony | [Explosive] | Energy: High]" : `[Chorus | ${vocalType} | Anthemic | Energy: High]`;

    if (type === "ghazal" || type === "ottoman") {
      return `${intro}\n\n[Verse 1 | ${isDuet ? "Male" : "Intimate"}]\n{V1}\n\n[Verse 2 | ${isDuet ? "Female" : "Building"}]\n{V2}\n\n${chorus}\n{CHORUS}\n\n[Instrumental Solo | [Add Tension] | ${leadInstr} | Extended]\n${InstrumentAdherence.rhythmAnchor("!")}\n\n[Verse 3 | Emotional Peak]\n{V3}\n\n${chorus}\n{CHORUS}\n\n${outro}\n[End]`;
    }

    return `${intro}\n\n[Verse 1]\n{V1}\n\n[Pre-Chorus | [Add Tension]]\n{VPRE}\n\n${chorus}\n{CHORUS}\n\n[Instrumental Solo | ${leadInstr}]\n${InstrumentAdherence.rhythmAnchor("!!")}\n\n[Verse 2 | Energy: Medium]\n{V2}\n\n${chorus}\n{CHORUS}\n\n${outro}\n[End]`;
  },

  filterPrompt: (prompt) => {
    let clean = prompt.toLowerCase().trim();
    if (clean.includes("no vocals")) return "[Instrumental]";
    return clean;
  }
};
