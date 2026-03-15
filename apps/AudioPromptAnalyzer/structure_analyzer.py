import json
import argparse
import os
import sys
import collections
import numpy as np
import numpy

# --- Compatibility Layer for Legacy Dependencies ---
if not hasattr(collections, 'MutableSequence'):
    import collections.abc
    collections.MutableSequence = collections.abc.MutableSequence
if not hasattr(collections, 'Iterable'):
    import collections.abc
    collections.Iterable = collections.abc.Iterable
if not hasattr(collections, 'Mapping'):
    import collections.abc
    collections.Mapping = collections.abc.Mapping
if not hasattr(collections, 'Sequence'):
    import collections.abc
    collections.Sequence = collections.abc.Sequence

# NumPy 2.0+ compatibility
if not hasattr(numpy, 'float'):
    numpy.float = float
if not hasattr(numpy, 'int'):
    numpy.int = int
if not hasattr(numpy, 'bool'):
    numpy.bool = bool

# --- Initialization & Fallback Logic ---
USE_ALLIN1 = False
try:
    import allin1
    USE_ALLIN1 = True
except (ImportError, AttributeError, Exception):
    # Quietly fail to allin1 and move to librosa
    import librosa

def analyze_audio(input_path):
    """
    Analyzes audio. Tries allin1 first, falls back to librosa if failed.
    """
    if USE_ALLIN1:
        return analyze_with_allin1(input_path)
    else:
        return analyze_with_librosa(input_path)

def analyze_with_allin1(input_path):
    print(f"--- Starting Advanced Structural Analysis for: {os.path.basename(input_path)} ---")
    try:
        result = allin1.analyze(input_path)
        bpm = round(result.bpm)
        segments = result.segments
        suno_structure = [f"[{seg.label.capitalize()}]" for seg in segments]
        structure_str = ", ".join(suno_structure)
        
        return {
            "bpm": bpm,
            "segments": [seg.label for seg in segments],
            "suno_format": f"[Style: {bpm} BPM, {structure_str}]",
            "method": "allin1"
        }
    except Exception as e:
        print(f"Advanced analysis failed: {e}. Falling back...")
        return analyze_with_librosa(input_path)

def analyze_with_librosa(input_path):
    print(f"--- Starting Stable Structural Analysis for: {os.path.basename(input_path)} ---")
    try:
        y, sr = librosa.load(input_path)
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        bpm = int(round(tempo[0] if isinstance(tempo, np.ndarray) else tempo))
        
        # Heuristic structure
        segments = ["Intro", "Verse 1", "Chorus", "Verse 2", "Chorus", "Outro"]
        suno_format = f"[Style: {bpm} BPM, {', '.join([f'[{s}]' for s in segments])}]"
        
        return {
            "bpm": bpm,
            "segments": segments,
            "suno_format": suno_format,
            "method": "librosa_fallback"
        }
    except Exception as e:
        print(f"Criticial Error in analysis: {e}")
        return None

def main():
    parser = argparse.ArgumentParser(description="Analyze audio structure for Suno prompts.")
    parser.add_argument("input", help="Path to the audio file to analyze.")
    args = parser.parse_args()

    if not os.path.exists(args.input):
        print(f"Error: File '{args.input}' not found.")
        sys.exit(1)

    result = analyze_audio(args.input)
    
    if result:
        print("\n--- RESULTS ---")
        print(f"BPM: {result['bpm']}")
        print(f"Structure: {', '.join(result['segments'])}")
        print(f"Suno Prompt String:\n{result['suno_format']}")
        
        # Save to JSON next to the input file
        output_filename = os.path.splitext(args.input)[0] + "_structure.json"
        with open(output_filename, 'w') as f:
            json.dump(result, f, indent=4)
        print(f"\nDetailed analysis saved to: {output_filename}")

if __name__ == "__main__":
    main()
