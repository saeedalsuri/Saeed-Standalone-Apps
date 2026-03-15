<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { invoke } from '@tauri-apps/api/core';
  import { open } from '@tauri-apps/plugin-dialog';
  import '../app.css';

  let selectedFile = $state<string | null>(null);
  let fileName = $state('');
  let audioBuffer = $state<AudioBuffer | null>(null);
  let startTime = $state(0);
  let endTime = $state(30);
  let duration = $state(0);
  let isPlaying = $state(false);
  let isProcessing = $state(false);
  let lastExportedPath = $state<string | null>(null);
  let exportName = $state('');
  
  let audioContext: AudioContext;
  let sourceNode: AudioBufferSourceNode | null = null;
  let gainNode: GainNode;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  onMount(() => {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
  });

  async function handlePickFile() {
    const selected = await open({
      multiple: false,
      filters: [{
        name: 'Audio',
        extensions: ['mp3', 'wav', 'aac', 'm4a']
      }]
    });

    if (selected && typeof selected === 'string') {
      selectedFile = selected;
      fileName = selected.split(/[\\/]/).pop() || '';
      await loadAudio(selected);
    }
  }

  async function loadAudio(path: string) {
    const fileBytes = await invoke<number[]>('read_audio_file', { path });
    const arrayBuffer = new Uint8Array(fileBytes).buffer;
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    duration = audioBuffer.duration;
    endTime = Math.min(30, duration);
    startTime = 0;
    
    await tick();
    drawWaveform();
  }

  function drawWaveform() {
    if (!audioBuffer || !canvas) return;
    ctx = canvas.getContext('2d')!;
    const width = canvas.width;
    const height = canvas.height;
    const data = audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / width);
    const amp = height / 2;

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;

    for (let i = 0; i < width; i++) {
        let min = 1.0;
        let max = -1.0;
        for (let j = 0; j < step; j++) {
            const datum = data[(i * step) + j];
            if (datum < min) min = datum;
            if (datum > max) max = datum;
        }
        ctx.moveTo(i, (1 + min) * amp);
        ctx.lineTo(i, (1 + max) * amp);
    }
    ctx.stroke();
  }

  function togglePreview() {
    if (isPlaying) stopPreview();
    else startPreview();
  }

  function startPreview() {
    if (!audioBuffer) return;
    stopPreview();
    sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = audioBuffer;
    
    // Enable seamless looping for the selected range
    sourceNode.loop = true;
    sourceNode.loopStart = startTime;
    sourceNode.loopEnd = endTime;
    
    sourceNode.connect(gainNode);
    // Start playback at the specified offset
    sourceNode.start(0, startTime);
    isPlaying = true;
  }

  function stopPreview() {
    if (sourceNode) {
        sourceNode.stop();
        sourceNode = null;
    }
    isPlaying = false;
  }

  function handleReset() {
    stopPreview();
    selectedFile = null;
    fileName = '';
    audioBuffer = null;
    startTime = 0;
    endTime = 30;
    duration = 0;
    lastExportedPath = null;
    exportName = '';
  }

  async function handleExport() {
    if (!selectedFile || !audioBuffer || isProcessing) return;
    
    try {
        isProcessing = true;
        // 1. Prepare for real-time capture
        const streamDest = audioContext.createMediaStreamDestination();
        const recorder = new MediaRecorder(streamDest.stream, {
            mimeType: 'audio/webm;codecs=opus',
            audioBitsPerSecond: 48000 // Very low bitrate for small size
        });

        const chunks: Blob[] = [];
        recorder.ondataavailable = (e) => chunks.push(e.data);

        // 2. Play the segment into the recorder
        const exportSource = audioContext.createBufferSource();
        exportSource.buffer = audioBuffer;
        exportSource.connect(streamDest);
        
        return new Promise<void>((resolve) => {
            recorder.onstop = async () => {
                const blob = new Blob(chunks, { type: 'audio/ogg' });
                const arrayBuffer = await blob.arrayBuffer();
                const bytes = Array.from(new Uint8Array(arrayBuffer));

                const savedPath = await invoke<string>('export_ringtone', {
                    audioData: bytes,
                    customName: exportName
                });
                
                lastExportedPath = savedPath;

                // Auto-send to phone
                try {
                    const result = await invoke<string>('send_to_phone', { path: savedPath });
                    alert(`Premium Loop Created!\nSaved to Desktop and ${result}`);
                } catch (phoneError) {
                    alert(`Premium Loop Created!\nSaved to Desktop: ${savedPath}\n(Note: Connect phone for auto-transfer)`);
                }
                isProcessing = false;
                resolve();
            };

            recorder.start();
            exportSource.start(0, startTime, endTime - startTime);
            
            // Stop recorder exactly when audio finishes
            setTimeout(() => {
                recorder.stop();
                exportSource.stop();
            }, (endTime - startTime) * 1000 + 100); // 100ms cushion
        });

    } catch (e) {
        alert("Export failed: " + e);
    }
  }

  async function handleSendToPhone() {
    if (!lastExportedPath) return;
    try {
        const result = await invoke<string>('send_to_phone', { path: lastExportedPath });
        alert(result);
    } catch (e) {
        alert(e);
    }
  }

  $effect(() => {
    if (canvas && audioBuffer) {
        drawWaveform();
    }
  });
</script>

<main class="glass-card">
    <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 0.5rem;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M5 7l7-5 7 5M5 17l7 5 7-5"/></svg>
        <h1>ToneCraft Pro</h1>
    </div>
  <p>Standalone Android Ringtone Designer</p>

  {#if !selectedFile}
    <div class="dropzone" onclick={handlePickFile}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1rem; color: var(--accent-color);">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
      <div>Choose your track</div>
      <small style="display: block; margin-top: 1rem; color: var(--text-secondary);">Optimized for Android OGG, MP3, WAV</small>
    </div>
  {:else}
    <div class="editor-view">
      <div style="background: rgba(255,255,255,0.03); padding: 10px 20px; border-radius: 12px; margin-bottom: 2rem; border: 1px solid var(--glass-border);">
        <span style="color: var(--accent-color); font-weight: 600;">ACTIVE:</span> {fileName}
      </div>
      
      <div class="waveform-container">
        <canvas bind:this={canvas} width="720" height="100"></canvas>
        <div class="selection-overlay" style="left: {(startTime/duration)*100}%; width: {((endTime-startTime)/duration)*100}%"></div>
      </div>

      <div style="margin-bottom: 2rem;">
        <label for="ringtone-name" style="display: block; color: var(--accent-color); font-weight: 700; font-size: 0.8rem; margin-bottom: 0.5rem; text-align: left;">RINGTONE NAME</label>
        <input 
          id="ringtone-name" 
          type="text" 
          placeholder="Enter a name for your ringtone..." 
          bind:value={exportName} 
          class="name-input"
        />
      </div>

      <div class="slider-container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; color: var(--text-secondary); font-size: 0.9rem;">
          <div class="input-group">
            <label for="start-time">START</label>
            <input id="start-time" type="number" step="0.1" min="0" max={endTime} bind:value={startTime} oninput={() => stopPreview()} class="time-input" />
          </div>
          <div class="badge">LENGTH: {(endTime - startTime).toFixed(1)}s</div>
          <div class="input-group">
            <label for="end-time">END</label>
            <input id="end-time" type="number" step="0.1" min={startTime} max={duration} bind:value={endTime} oninput={() => stopPreview()} class="time-input" />
          </div>
        </div>
        <input type="range" min="0" max={duration} step="0.1" bind:value={startTime} oninput={() => stopPreview()} />
        <input type="range" min="0" max={duration} step="0.1" bind:value={endTime} oninput={() => stopPreview()} style="margin-top: 15px;" />
      </div>

      <div style="display: flex; justify-content: center; gap: 20px; margin-top: 2.5rem;">
        <button class="button-secondary" onclick={togglePreview}>
          {#if isPlaying}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          {:else}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          {/if}
          {isPlaying ? 'Stop' : 'Preview'}
        </button>
        
        <button class="button-primary" onclick={handleExport} disabled={isProcessing}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          {isProcessing ? 'Optimizing...' : 'Craft Ringtone'}
        </button>
      </div>

      <button class="button-secondary" style="margin-top: 2.5rem; width: auto;" onclick={handleReset}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        New Ringtone
      </button>
    </div>
  {/if}
</main>

<style>
  .badge {
      background: rgba(255,255,255,0.05);
      padding: 4px 12px;
      border-radius: 99px;
      border: 1px solid var(--glass-border);
  }
  .input-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
  }
  .input-group label {
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--accent-color);
  }
  .time-input {
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--glass-border);
      border-radius: 8px;
      color: white;
      padding: 4px 8px;
      width: 60px;
      text-align: center;
      font-family: inherit;
      font-size: 0.9rem;
  }
  .time-input:focus {
      outline: none;
      border-color: var(--accent-color);
      box-shadow: 0 0 10px var(--accent-glow);
  }
  .name-input {
      width: 100%;
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      padding: 12px 16px;
      color: white;
      font-size: 1rem;
      outline: none;
      transition: all 0.3s ease;
  }
  .name-input:focus {
      border-color: var(--accent-color);
      background: rgba(255,255,255,0.08);
      box-shadow: 0 0 15px var(--accent-glow);
  }
  .waveform-container {
      position: relative;
      overflow: hidden;
  }
  canvas {
      width: 100%;
      height: 100px;
      display: block;
  }
  .selection-overlay {
      position: absolute;
      top: 0;
      height: 100%;
      background: rgba(56, 189, 248, 0.2);
      border-left: 2px solid var(--accent-color);
      border-right: 2px solid var(--accent-color);
      pointer-events: none;
  }
  .button-secondary {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      padding: 12px 24px;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
  }
  .button-secondary:hover {
      background: rgba(255,255,255,0.1);
      border-color: var(--accent-color);
  }
  .button-accent {
      background: var(--accent-color);
      border: 1px solid var(--accent-color);
      border-radius: 12px;
      padding: 12px 24px;
      color: #000;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
  }
  .button-accent:hover {
      background: #7dd3fc;
      transform: translateY(-2px);
      box-shadow: 0 5px 20px var(--accent-glow);
  }
</style>
