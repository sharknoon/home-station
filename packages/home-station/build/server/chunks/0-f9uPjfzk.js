import { g as getAppDataPersistency } from './appdata-osNviCV5.js';
import 'node:path';
import 'node:fs/promises';
import 'node:os';
import 'winston';

const appDataPersistency = await getAppDataPersistency();
const load = async ({ locals, request }) => {
  const user = locals.user;
  const url = request.url;
  return { user, url, appDataPersistency };
};

var _layout_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 0;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-DUzMjiWL.js')).default;
const server_id = "src/routes/+layout.server.ts";
const imports = ["_app/immutable/nodes/0.iiw-p3Mb.js","_app/immutable/chunks/scheduler.bQlOXBkt.js","_app/immutable/chunks/index.dknh01mB.js","_app/immutable/chunks/ProgressBar.svelte_svelte_type_style_lang.JlGIzIKZ.js","_app/immutable/chunks/index.5bRYXlS8.js","_app/immutable/chunks/spread.rEx3vLA9.js","_app/immutable/chunks/transitions.bjOOOgyG.js","_app/immutable/chunks/stores.-cQko4Xi.js","_app/immutable/chunks/each.anRlpCm9.js","_app/immutable/chunks/stores.AtuPcNld.js","_app/immutable/chunks/popup.R-M2AyRG.js","_app/immutable/chunks/i18n.Mah0M8rZ.js","_app/immutable/chunks/stores.Xz95ZHQI.js","_app/immutable/chunks/entry.qbHVI6p7.js","_app/immutable/chunks/ProgressRadial.xsBlPM_P.js"];
const stylesheets = ["_app/immutable/assets/0.unflIYMk.css","_app/immutable/assets/ProgressBar.oq5aOWfL.css"];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=0-f9uPjfzk.js.map
