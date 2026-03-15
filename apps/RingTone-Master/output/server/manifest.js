export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","svelte.svg","tauri.svg","vite.svg"]),
	mimeTypes: {".png":"image/png",".svg":"image/svg+xml"},
	_: {
		client: {start:"_app/immutable/entry/start.DHSOxFH8.js",app:"_app/immutable/entry/app.Ed75suZG.js",imports:["_app/immutable/entry/start.DHSOxFH8.js","_app/immutable/chunks/oorgmmMV.js","_app/immutable/chunks/CX3LiWbn.js","_app/immutable/chunks/CFVha20_.js","_app/immutable/entry/app.Ed75suZG.js","_app/immutable/chunks/CX3LiWbn.js","_app/immutable/chunks/Cv7mNPUk.js","_app/immutable/chunks/Bm-k3S0r.js","_app/immutable/chunks/CFVha20_.js","_app/immutable/chunks/Ctj3wXNc.js","_app/immutable/chunks/9HN4Ob6z.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
