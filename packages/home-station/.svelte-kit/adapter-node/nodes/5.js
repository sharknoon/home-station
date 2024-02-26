import * as server from '../entries/pages/(sidebar)/discover/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(sidebar)/discover/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(sidebar)/discover/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.pqW4A2J9.js","_app/immutable/chunks/scheduler.bQlOXBkt.js","_app/immutable/chunks/index.dknh01mB.js","_app/immutable/chunks/each.anRlpCm9.js","_app/immutable/chunks/forms.uhvzcuB7.js","_app/immutable/chunks/entry.qbHVI6p7.js","_app/immutable/chunks/index.5bRYXlS8.js","_app/immutable/chunks/popup.R-M2AyRG.js","_app/immutable/chunks/stores.-cQko4Xi.js","_app/immutable/chunks/ProgressBar.svelte_svelte_type_style_lang.JlGIzIKZ.js","_app/immutable/chunks/ProgressRadial.xsBlPM_P.js","_app/immutable/chunks/spread.rEx3vLA9.js","_app/immutable/chunks/Icon.9NkTZT6r.js","_app/immutable/chunks/plus.qIUUgd4x.js","_app/immutable/chunks/i18n.Mah0M8rZ.js"];
export const stylesheets = ["_app/immutable/assets/ProgressBar.oq5aOWfL.css"];
export const fonts = [];
