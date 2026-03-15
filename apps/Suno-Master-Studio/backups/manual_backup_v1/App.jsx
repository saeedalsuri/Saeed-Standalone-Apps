import { useState } from 'react'
import { SunoLogicCore } from './utils/sunoLogic'
import './App.css'

function App() {
  const [genreInput, setGenreInput] = useState('')
  const [jsonOutput, setJsonOutput] = useState('')

  const handleGenerate = () => {
    const query = genreInput.toLowerCase().trim();
    if (!query) return;

    // Use the ENHANCED SunoLogicCore to generate a creative prompt
    // This no longer relies on static templates for "exact matches"
    // Instead, it uses the knowledge base to construct a unique prompt every time.
    
    // 1. Detect Attributes & Generate
    const resultObject = SunoLogicCore.generateCreativePrompt(query);

    // 2. Final Filtering (Simulated "Nurse" pass from original logic)
    resultObject.style = SunoLogicCore.filterPrompt(resultObject.style);

    // Output format: Array containing the single generated object
    setJsonOutput(JSON.stringify([resultObject], null, 2));
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonOutput);
  }

  return (
    <div className="generator-container">
      <div className="glass-panel">
        <h1 className="app-title">Suno Creative Prompt Engine</h1>
        <p style={{textAlign: 'center', color: '#8b949e', fontSize: '0.9rem'}}>
          V4.5 Logic Core Active. Enter any genre to generate a unique, structurally accurate prompt.
        </p>
        
        {/* Field 1: Input */}
        <div className="input-section">
          <label>Song Genre / Description</label>
          <div className="input-wrapper">
            <input 
              type="text" 
              className="genre-input"
              placeholder="e.g. Melancholic Saudi Ballad, High-Energy Cyberpunk..."
              value={genreInput}
              onChange={(e) => setGenreInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button className="generate-btn" onClick={handleGenerate}>
              Creative Generate
            </button>
          </div>
        </div>

        {/* Field 2: Output */}
        <div className="output-section">
          <div className="output-header">
            <label>Generated JSON Payload</label>
            {jsonOutput && (
              <button className="copy-btn" onClick={copyToClipboard}>
                Copy Output
              </button>
            )}
          </div>
          <textarea 
            className="json-output"
            value={jsonOutput}
            readOnly
            placeholder="Creative JSON output based on V4.5 logic will appear here..."
          />
        </div>
      </div>
    </div>
  )
}

export default App
