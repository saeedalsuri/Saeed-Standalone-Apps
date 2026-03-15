/* 
  Data source for Suno Prompt Maker 
  Based on "Suno AI Prompt Engineering Manual (For App Development)"
*/

// Manual: "Bypass descriptors for popular artists"
export const ARTIST_BYPASS = {
  "Drake": "Melodic trap, moody, deep 808s, reverb-heavy",
  "Billie Eilish": "Minimal pop, whispery female vocals, dark bass, ethereal",
  "Taylor Swift": "Modern country-pop, heartfelt storytelling, female soprano, acoustic guitars",
  "Johnny Cash": "Deep raspy baritone, outlaw country, boom-chicka rhythm",
  "Santana": "Latin Rock, soulful overdriven electric guitar, congas, organ",
  "Queen": "Rock, Operatic, Theatrical, Male Vocals",
  "The Weeknd": "RnB, Dark, Cinematic, male vocals",
  "Metallica": "Thrash metal, aggressive riffs, pounding drums, male vocals",
  "Eminem": "Rapid-fire rap, deep bass beats, aggressive delivery in a minor key",
  "Green Day": "Punk Rock, Aggressive, Youthful",
  "Daft Punk": "Electronic, Dance, Futuristic",
  "Lana Del Rey": "Pop, Sadcore, Cinematic, female vocals",
  "Googoosh": "1970s Iranian Pop, Melancholic, Lush Orchestral production, deep Bass-heavy drama, Female Mezzo-Soprano"
};

export const GENRES = [
  "Indie Pop", "Melodic Techno", "Spaghetti Western", "Baroque Pop", "Delta Blues", 
  "Liquid DnB", "Synthwave", "Chicago House", "Trap", "Hip Hop", "Dubstep", "Rock", 
  "Pop", "Metal", "Country", "Jazz", "Classical", "Folk", "RnB", "Soul", "Funk", "Disco", "Reggae"
];

export const MOODS = [
  "Aggressive", "Anthemic", "Atmospheric", "Bittersweet", "Breezy", "Bright", "Chill", 
  "Cinematic", "Dark", "Dreamy", "Emotional", "Energetic", "Ethereal", "Euphoric", 
  "Funky", "Gloomy", "Groovy", "Happy", "Haunting", "Heavy", "Hopeful", "Hypnotic", 
  "Intense", "Intimate", "Joyful", "Laid-back", "Melancholic", "Mellow", "Minimal", 
  "Moody", "Mysterious", "Nostalgic", "Optimistic", "Peaceful", "Playful", "Powerful", 
  "Psychedelic", "Quirky", "Raw", "Relaxing", "Romantic", "Sad", "Sentimental", 
  "Sexy", "Smooth", "Somber", "Soothing", "Sophisticated", "Soulful", "Spooky", 
  "Suspenseful", "Tense", "Trippy", "Upbeat", "Uplifting", "Warm", "Whimsical"
];

export const INSTRUMENTS = [
  "808 Sub-bass", "Acoustic Guitar", "Banjo", "Bass Guitar", "Cello", "Clarinet", 
  "Distorted Electric Guitar", "Drum Machine", "Drums", "Electric Guitar", "Felt Piano", 
  "Fiddle", "Fingerstyle Guitar", "Flute", "Grand Piano", "Hammond B3 Organ", "Harp", 
  "Harpsichord", "Horn Section", "Mandolin", "Orchestra", "Padding", "Pedal Steel", 
  "Percussion", "Piano", "Saxophone", "Slide Guitar", "String Section", "Synthesizer", 
  "Synthwave Bass", "Tabla", "Trumpet", "Ukulele", "Viola", "Violin", "Vocoder", 
  "Wurlitzer", "Xylophone"
];

export const VOCAL_TYPES = [
  "Male", "Female", "Duet", "Choir", "Instrumental (No Vocals)"
];

export const VOCAL_STYLES = [
  "Anthemic", "Autotuned", "Baritone", "Belted", "Breathy", "Chanted", "Clean", 
  "Deep", "Distorted", "Emotional", "Ethereal", "Falsetto", "Fry Scream", "Gang Vocals", 
  "Gospel", "Growled", "Guttural", "Harmony", "High-pitched", "Husky", "Lounge", 
  "Melismatic", "Operatic", "Pop", "Rap", "Raspy", "Raw", "Reverb-heavy", "Robot", 
  "Screamed", "Shouted", "Smooth", "Soft", "Soulful", "Spoken Word", "Soprano", 
  "Strained", "Tenor", "Whispered"
];

export const PRODUCTION_STYLES = [
  "High Fidelity", "Lo-fi", "Wide Stereo", "Tape Saturation", "Vinyl Crackle", 
  "Clean Mix", "Dry Vocals", "Reverb-soaked", "Wall of Sound", "Close-mic", "Live Recording"
];

export const SONG_STRUCTURES = [
  {
    name: "Standard Pop (Verse-Chorus)",
    structure: "[Intro]\n[Verse 1]\n[Pre-Chorus]\n[Chorus]\n[Verse 2]\n[Pre-Chorus]\n[Chorus]\n[Bridge]\n[Chorus]\n[Outro]\n[Fade Out]"
  },
  {
    name: "EDM / Dance (Build-Drop)",
    structure: "[Intro]\n[Verse 1]\n[Build-Up]\n[Drop]\n[Verse 2]\n[Build-Up]\n[Drop]\n[Bridge]\n[Outro]"
  },
  {
    name: "Rap / Hip-Hop (Hook-Verse)",
    structure: "[Intro]\n[Hook]\n[Verse 1]\n[Hook]\n[Verse 2]\n[Hook]\n[Outro]"
  },
  {
    name: "Rock / Metal (Solo Focus)",
    structure: "[Intro]\n[Verse 1]\n[Chorus]\n[Verse 2]\n[Chorus]\n[Guitar Solo]\n[Bridge]\n[Chorus]\n[Outro]"
  },
  {
    name: "Folk / Ballad (Storytelling)",
    structure: "[Intro]\n[Verse 1]\n[Verse 2]\n[Chorus]\n[Verse 3]\n[Chorus]\n[Outro]"
  }
];
