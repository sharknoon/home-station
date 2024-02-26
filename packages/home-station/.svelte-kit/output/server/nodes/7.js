import * as server from '../entries/pages/(sidebar)/settings/domains-and-hostnames/_page.server.ts.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(sidebar)/settings/domains-and-hostnames/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(sidebar)/settings/domains-and-hostnames/+page.server.ts";
export const imports = ["_app/immutable/nodes/7.HQHxBqzX.js","_app/immutable/chunks/scheduler.bQlOXBkt.js","_app/immutable/chunks/each.anRlpCm9.js","_app/immutable/chunks/index.dknh01mB.js"];
export const stylesheets = [];
export const fonts = [];
