import * as server from '../entries/pages/(sidebar)/settings/users/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(sidebar)/settings/users/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(sidebar)/settings/users/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.LzPPCinV.js","_app/immutable/chunks/scheduler.bQlOXBkt.js","_app/immutable/chunks/each.anRlpCm9.js","_app/immutable/chunks/index.dknh01mB.js","_app/immutable/chunks/i18n.Mah0M8rZ.js","_app/immutable/chunks/index.5bRYXlS8.js"];
export const stylesheets = [];
export const fonts = [];
