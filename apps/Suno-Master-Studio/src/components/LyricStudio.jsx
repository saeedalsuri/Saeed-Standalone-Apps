
import React, { useState } from 'react';
import './LyricStudio.css';

function LyricStudio({ externalTemplate, externalStyle }) {
  const [lyricsTemplate, setLyricsTemplate] = useState(externalTemplate || '');
  const [rawLyrics, setRawLyrics] = useState('');
  const [finalLyrics, setFinalLyrics] = useState('');
  const [title, setTitle] = useState('');
  const [vocalGender, setVocalGender] = useState('m');

  // Sync with prop if it changes
  React.useEffect(() => {
    if (externalTemplate) setLyricsTemplate(externalTemplate);
  }, [externalTemplate]);

  const mergeLyrics = () => {
    const userStanzas = rawLyrics.split(/\n\s*\n/).map(s => s.trim()).filter(s => s.length > 0);
    let template = lyricsTemplate;
    
    if (userStanzas.length === 0) {
      setFinalLyrics(lyricsTemplate);
      return;
    }

    // Ordered sequence to ensure proper stanza distribution
    const tags = ['{V1}', '{V2}', '{CHORUS}', '{V3}', '{VPRE}', '{V4}', '{BRIDGE}', '{OUTRO}'];
    let stanzaPtr = 0;
    let usedChorus = null;

    tags.forEach(t => {
      // Use while loop because a tag (like Chorus) might appear multiple times
      while (template.includes(t)) {
        let replacement = "";
        
        if (t === '{CHORUS}' && usedChorus !== null) {
          replacement = usedChorus;
        } else {
          replacement = userStanzas[stanzaPtr++] || `[Missing ${t}]`;
          if (t === '{CHORUS}') usedChorus = replacement;
        }

        // --- SMART TAG HARMONIZATION ---
        // If the replacement starts with a tag [...], and the template has a tag above the placeholder,
        // we remove the template's tag to avoid double-billing Suno.
        const tagIdx = template.indexOf(t);
        const linesBefore = template.substring(0, tagIdx).split('\n');
        
        let templateTagLineIdx = -1;
        // Search back 2 lines for a potential header tag
        for (let i = linesBefore.length - 1; i >= Math.max(0, linesBefore.length - 2); i--) {
          const line = linesBefore[i].trim();
          if (line.startsWith('[') && line.endsWith(']')) {
            templateTagLineIdx = i;
            break;
          }
        }

        if (templateTagLineIdx !== -1 && replacement.trim().startsWith('[')) {
          // Both have tags! Let's harmonize them into one line.
          const templateTagRaw = linesBefore[templateTagLineIdx].trim().slice(1, -1);
          const userTagMatch = replacement.match(/^\[(.*?)\]/);
          const userTagRaw = userTagMatch ? userTagMatch[1] : "";
          
          // Clean the user tag (remove redundant "Verse X" labels)
          const cleanUserTag = userTagRaw.replace(/Verse \d\s*[:-]?\s*/i, "").replace(/Chorus\s*[:-]?\s*/i, "").trim();
          
          // Construct Harmonized Tag
          const harmonizedTag = `[${templateTagRaw}${cleanUserTag ? ' | ' + cleanUserTag : ''}]`;
          
          // Strip the tag from the user's stanza to avoid duplicates
          replacement = replacement.replace(/^\[.*?\]\s*\n?/, "").trim();
          
          // Update the template: remove the old tag line and the placeholder's original line
          const beforeTag = linesBefore.slice(0, templateTagLineIdx).join('\n');
          const afterTag = linesBefore.slice(templateTagLineIdx + 1).join('\n');
          
          // We put the harmonized tag back into the template
          template = (beforeTag ? beforeTag + '\n' : '') + harmonizedTag + '\n' + afterTag + template.substring(tagIdx);
        }
        
        template = template.replace(t, replacement);
      }
    });

    setFinalLyrics(template.trim());
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Add visual feedback
  };

  return (
    <div className="lyric-studio">
      <div className="studio-card">
        <header className="card-header">
          <h2>Lyric Studio</h2>
          <p>Merge your poem into the Suno skeleton.</p>
        </header>

        <div className="form-grid">
          <div className="form-group half">
            <label>Song Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g. Moonlight over Herat"
            />
          </div>
          <div className="form-group half">
            <label>Vocal Gender</label>
            <select value={vocalGender} onChange={(e) => setVocalGender(e.target.value)}>
              <option value="m">Male</option>
              <option value="f">Female</option>
              <option value="duet">Duet (Male/Female)</option>
            </select>
          </div>

          <div className="form-group full">
            <label>1. Structure Template (from Prompt Forge)</label>
            <textarea 
              value={lyricsTemplate} 
              onChange={(e) => setLyricsTemplate(e.target.value)}
              rows={5}
              placeholder="[Intro]... {V1}..."
            />
          </div>

          <div className="form-group full">
            <label>2. Your Raw Poem / Lyrics</label>
            <textarea 
              value={rawLyrics} 
              onChange={(e) => setRawLyrics(e.target.value)}
              rows={6}
              placeholder="Line 1\nLine 2\n\nStanza 2..."
            />
            <button className="merge-btn" onClick={mergeLyrics}>
              Assemble Song Prompt
            </button>
          </div>

          <div className="form-group full">
            <label>3. Final Suno Prompt (Lyrics Box)</label>
            <div className="final-output-wrapper">
              <textarea 
                className="final-output"
                value={finalLyrics} 
                onChange={(e) => setFinalLyrics(e.target.value)}
                rows={12}
                readOnly={!finalLyrics}
              />
              {finalLyrics && (
                <button className="float-copy" onClick={() => copyToClipboard(finalLyrics)}>
                  Copy to Suno
                </button>
              )}
            </div>
            <span className="char-counter">{finalLyrics.length} / 5000 characters</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LyricStudio;
