import * as server from '../entries/pages/(sidebar)/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(sidebar)/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(sidebar)/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.JYjOPWo3.js","_app/immutable/chunks/scheduler.bQlOXBkt.js","_app/immutable/chunks/index.dknh01mB.js"];
export const stylesheets = [];
export const fonts = [];
