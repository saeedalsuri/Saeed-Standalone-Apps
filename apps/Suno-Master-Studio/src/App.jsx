
import React, { useState } from 'react';
import { SunoLogicCore } from './utils/sunoLogic';
import LyricStudio from './components/LyricStudio';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('forge');
  
  // Shared state between Forge and Studio
  const [genreInput, setGenreInput] = useState('');
  const [isDuet, setIsDuet] = useState(false);
  const [isSoftBlend, setIsSoftBlend] = useState(false);
  const [generatedStyle, setGeneratedStyle] = useState('');
  const [generatedTemplate, setGeneratedTemplate] = useState('');
  const [versionInfo] = useState('V5.6 (Master Studio)');

  const handleGenerate = () => {
    const query = genreInput.toLowerCase().trim();
    if (!query) return;

    const data = SunoLogicCore.generateCreativePrompt(query, isDuet, isSoftBlend);
    setGeneratedStyle(data.style);
    setGeneratedTemplate(data.structure);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="studio-app">
      {/* SIDEBAR NAVIGATION */}
      <aside className="sidebar">
        <div className="logo">
          <div className="icon">S</div>
          <span>SUNO MASTER</span>
        </div>
        <nav>
          <button 
            className={activeTab === 'forge' ? 'nav-item active' : 'nav-item'} 
            onClick={() => setActiveTab('forge')}
          >
            <span className="dot"></span> Prompt Forge
          </button>
          <button 
            className={activeTab === 'studio' ? 'nav-item active' : 'nav-item'} 
            onClick={() => setActiveTab('studio')}
          >
            <span className="dot"></span> Lyric Studio
          </button>
        </nav>
        <div className="footer-info">
          <p>{versionInfo}</p>
          <p>Logic Core V5.6 Native</p>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="content">
        
        {activeTab === 'forge' && (
          <div className="forge-view">
            <header className="page-header">
              <h1>Prompt Forge</h1>
              <p>Generate high-fidelity style anchors and song structures.</p>
            </header>

            <div className="glass-panel">
              <div className="input-group">
                <label>Genre or Musical Description</label>
                <div className="search-bar">
                  <input 
                    type="text" 
                    placeholder="e.g. 1970s Googoosh style, Lebanese Dabke-Pop, Saudi Ballad..." 
                    value={genreInput}
                    onChange={(e) => setGenreInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  />
                  <button className="generate-btn" onClick={handleGenerate}>Forge Style</button>
                </div>
                <div className="options-row">
                   <label className="toggle">
                      <input type="checkbox" checked={isDuet} onChange={(e) => setIsDuet(e.target.checked)} />
                      <span className="slider"></span>
                      <span className="label">Duet Mode</span>
                   </label>
                   <label className="toggle">
                      <input type="checkbox" checked={isSoftBlend} onChange={(e) => setIsSoftBlend(e.target.checked)} />
                      <span className="slider"></span>
                      <span className="label">Soft Blend (Smooth Fusion)</span>
                   </label>
                </div>
              </div>

              {generatedStyle && (
                <div className="results-grid">
                  <div className="result-card">
                    <div className="card-top">
                      <label>1. STYLE ANCHOR <span className={generatedStyle.length > 120 ? "char-count warning" : "char-count"}>({generatedStyle.length} chars)</span></label>
                      <button className="copy-icon-btn" onClick={() => copyToClipboard(generatedStyle)}>Copy</button>
                    </div>
                    <textarea value={generatedStyle} readOnly rows={4} />
                  </div>

                  <div className="result-card">
                    <div className="card-top">
                      <label>2. STRUCTURE SKELETON</label>
                      <button className="copy-icon-btn" onClick={() => copyToClipboard(generatedTemplate)}>Copy</button>
                    </div>
                    <textarea value={generatedTemplate} readOnly rows={8} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'studio' && (
          <LyricStudio 
            externalTemplate={generatedTemplate} 
            externalStyle={generatedStyle} 
          />
        )}
      </main>
    </div>
  );
}

export default App;
