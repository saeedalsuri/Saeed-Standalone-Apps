import os
import sys
import torch
import torchaudio
import librosa
import numpy as np
import soundfile as sf

# --- Monkeypatch Torchaudio for Windows 11 Compatibility ---
# The installed Torchaudio 2.10.x has a broken mandatory dependency on TorchCodec.
# We bypass this by using librosa for loading and soundfile for saving.

def resilient_load(uri, **kwargs):
    print(f"DEBUG: Resilient loading {uri} via librosa...")
    # librosa.load returns (y, sr). y is (t,) or (c, t)
    y, sr = librosa.load(uri, sr=None, mono=False)
    
    # Convert to torch tensor (expects [channel, time])
    if y.ndim == 1:
        y = y[None, :]
    
    return torch.from_numpy(y).float(), sr

def resilient_save(uri, src, sample_rate, **kwargs):
    print(f"DEBUG: Resilient saving to {uri} via soundfile...")
    # soundfile expects (time, channel)
    y = src.cpu().numpy()
    if y.ndim == 2:
        y = y.T
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(os.path.abspath(uri)), exist_ok=True)
    sf.write(uri, y, sample_rate)

# Apply patches
torchaudio.load = resilient_load
torchaudio.save = resilient_save

print("--- Torchaudio Monkeypatched for Resilience ---")

# --- Run Demucs ---
from demucs.separate import main

if __name__ == "__main__":
    # Remove this script from argv and run demucs main
    sys.argv[0] = "demucs"
    try:
        main()
    except Exception as e:
        print(f"Demucs execution failed: {e}")
        sys.exit(1)
