import * as server from '../entries/pages/setup/_page.server.ts.js';

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/setup/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/setup/+page.server.ts";
export const imports = ["_app/immutable/nodes/12.u-2PegFl.js","_app/immutable/chunks/scheduler.bQlOXBkt.js","_app/immutable/chunks/index.dknh01mB.js","_app/immutable/chunks/each.anRlpCm9.js","_app/immutable/chunks/ProgressBar.svelte_svelte_type_style_lang.JlGIzIKZ.js","_app/immutable/chunks/index.5bRYXlS8.js","_app/immutable/chunks/transitions.bjOOOgyG.js","_app/immutable/chunks/spread.rEx3vLA9.js","_app/immutable/chunks/Icon.9NkTZT6r.js","_app/immutable/chunks/plus.qIUUgd4x.js","_app/immutable/chunks/i18n.Mah0M8rZ.js","_app/immutable/chunks/forms.uhvzcuB7.js","_app/immutable/chunks/entry.qbHVI6p7.js","_app/immutable/chunks/stores.Xz95ZHQI.js"];
export const stylesheets = ["_app/immutable/assets/ProgressBar.oq5aOWfL.css"];
export const fonts = [];
