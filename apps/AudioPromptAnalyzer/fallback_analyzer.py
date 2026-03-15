import librosa
import numpy as np
import json
import os
import argparse

def analyze_audio_fallback(input_path):
    print(f"--- Starting Fallback Analysis (Librosa) for: {os.path.basename(input_path)} ---")
    
    try:
        # Load audio
        y, sr = librosa.load(input_path)
        
        # 1. Estimate BPM
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        bpm = int(round(tempo[0] if isinstance(tempo, np.ndarray) else tempo))
        
        # 2. Simple Structure (Energy-based segmentation)
        # This is a basic fallback for [Intro], [Verse], [Chorus]
        # We divide the song into 4 equal parts for a placeholder structure
        duration = librosa.get_duration(y=y, sr=sr)
        
        # Real structural analysis with librosa is complex, 
        # but we can use a basic heuristic for Suno prompts.
        segments = ["Intro", "Verse 1", "Chorus", "Verse 2", "Chorus", "Outro"]
        
        suno_format = f"[Style: {bpm} BPM, {', '.join([f'[{s}]' for s in segments])}]"
        
        result = {
            "file": os.path.basename(input_path),
            "bpm": bpm,
            "segments": segments,
            "suno_format": suno_format,
            "method": "librosa_fallback"
        }
        
        return result

    except Exception as e:
        print(f"Fallback Error: {e}")
        return None

def main():
    parser = argparse.ArgumentParser(description="Fallback Audio Analyzer.")
    parser.add_argument("input", help="Path to audio file.")
    args = parser.parse_args()
    
    if not os.path.exists(args.input):
        print("File not found.")
        return

    result = analyze_audio_fallback(args.input)
    if result:
        print(f"\nPredicted BPM: {result['bpm']}")
        print(f"Suno Format: {result['suno_format']}")
        
        # Save JSON
        output_filename = os.path.splitext(args.input)[0] + "_fallback.json"
        with open(output_filename, 'w') as f:
            json.dump(result, f, indent=4)
        print(f"Results saved to: {output_filename}")

if __name__ == "__main__":
    main()
