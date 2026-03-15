

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const universal = {
  "ssr": false
};
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.3Qtxq5fL.js","_app/immutable/chunks/Bm-k3S0r.js","_app/immutable/chunks/CX3LiWbn.js","_app/immutable/chunks/9HN4Ob6z.js"];
export const stylesheets = [];
export const fonts = [];
