const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","fonts/Inter.woff2","logo.png","wallpapers/background.jpg"]),
	mimeTypes: {".png":"image/png",".woff2":"font/woff2",".jpg":"image/jpeg"},
	_: {
		client: {"start":"_app/immutable/entry/start.zj_oNWA-.js","app":"_app/immutable/entry/app.HgvTvCfo.js","imports":["_app/immutable/entry/start.zj_oNWA-.js","_app/immutable/chunks/entry.qbHVI6p7.js","_app/immutable/chunks/scheduler.bQlOXBkt.js","_app/immutable/chunks/index.5bRYXlS8.js","_app/immutable/entry/app.HgvTvCfo.js","_app/immutable/chunks/scheduler.bQlOXBkt.js","_app/immutable/chunks/index.dknh01mB.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./chunks/0-f9uPjfzk.js')),
			__memo(() => import('./chunks/1-SsRWDLQU.js')),
			__memo(() => import('./chunks/2-nRCIc20W.js')),
			__memo(() => import('./chunks/3-hf1nMLZd.js')),
			__memo(() => import('./chunks/4-wm3Nw8I7.js').then(function (n) { return n._; })),
			__memo(() => import('./chunks/5-qqBqjTIT.js')),
			__memo(() => import('./chunks/6-39ly7SEs.js')),
			__memo(() => import('./chunks/7-_0ka69vz.js')),
			__memo(() => import('./chunks/8-JagQkZXg.js')),
			__memo(() => import('./chunks/9-dKH6bMrP.js')),
			__memo(() => import('./chunks/10-T54v2xr4.js')),
			__memo(() => import('./chunks/11-BRzVmp8j.js')),
			__memo(() => import('./chunks/12-eDZjZnLS.js'))
		],
		routes: [
			{
				id: "/(sidebar)",
				pattern: /^\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/(sidebar)/account",
				pattern: /^\/account\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/(sidebar)/discover",
				pattern: /^\/discover\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/events",
				pattern: /^\/events\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-UBucDjKn.js'))
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/(sidebar)/settings/container-engines",
				pattern: /^\/settings\/container-engines\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/(sidebar)/settings/domains-and-hostnames",
				pattern: /^\/settings\/domains-and-hostnames\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/(sidebar)/settings/logs",
				pattern: /^\/settings\/logs\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/(sidebar)/settings/tasks",
				pattern: /^\/settings\/tasks\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/(sidebar)/settings/users",
				pattern: /^\/settings\/users\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/setup",
				pattern: /^\/setup\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/[...path]",
				pattern: /^(?:\/(.*))?\/?$/,
				params: [{"name":"path","optional":false,"rest":true,"chained":true}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-y1vIUgcw.js'))
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
