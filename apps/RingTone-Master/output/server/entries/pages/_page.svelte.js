import "clsx";
import "@tauri-apps/api/core";
import "@tauri-apps/plugin-dialog";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<main class="glass-card"><div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 0.5rem;"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M5 7l7-5 7 5M5 17l7 5 7-5"></path></svg> <h1>ToneCraft Pro</h1></div> <p>Standalone Android Ringtone Designer</p> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="dropzone"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1rem; color: var(--accent-color);"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg> <div>Choose your track</div> <small style="display: block; margin-top: 1rem; color: var(--text-secondary);">Optimized for Android OGG, MP3, WAV</small></div>`);
    }
    $$renderer2.push(`<!--]--></main>`);
  });
}
export {
  _page as default
};
