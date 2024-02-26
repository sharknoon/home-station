import { d as db$1, m as marketplaceApps, c as containerEngines, a as apps } from './db-cvVcOA05.js';
import { f as fail } from './index-RcZWwKaW.js';
import { d as deleteMarketplace, g as getMarketplaceAppPath } from './marketplaces-Hf_qDRv9.js';
import { and, eq } from 'drizzle-orm';
import DockerodeCompose from 'dockerode-compose';
import { g as getEngine } from './containerengines-JQNszNnj.js';
import { join } from 'node:path';
import 'drizzle-orm/better-sqlite3';
import 'drizzle-orm/better-sqlite3/migrator';
import 'better-sqlite3';
import 'drizzle-orm/sqlite-core';
import './appdata-osNviCV5.js';
import 'node:fs/promises';
import 'node:os';
import 'winston';
import 'isomorphic-git';
import 'isomorphic-git/http/node/index.js';
import 'js-yaml';
import 'i18next';
import 'i18next-browser-languagedetector';
import 'cronstrue/locales/en.js';
import 'cronstrue/locales/de.js';
import 'dockerode';

const load = async () => {
  const marketplaceApps2 = await db$1.query.marketplaceApps.findMany({
    with: { marketplace: { columns: { id: true, gitRemoteUrl: true } } }
  });
  const marketplaces = await db$1.query.marketplaces.findMany({
    columns: { gitPassword: false }
  });
  const containerEngines2 = await db$1.query.containerEngines.findMany({
    columns: { id: true, name: true, type: true }
  });
  return { marketplaceApps: marketplaceApps2, marketplaces, containerEngines: containerEngines2 };
};
const actions = {
  deleteRepository: async ({ request }) => {
    const data = await request.formData();
    const id = data.get("id")?.toString();
    if (!id) {
      return fail(400, { id, invalid: true });
    }
    await deleteMarketplace(id);
  },
  installApp: async ({ request }) => {
    const data = await request.formData();
    const appId = data.get("appId")?.toString() ?? "";
    const marketplaceId = data.get("marketplaceId")?.toString() ?? "";
    const containerEngineId = parseInt(data.get("containerEngineId")?.toString() ?? "");
    if (!appId) {
      return fail(400, { appId, invalid: true });
    }
    if (!marketplaceId) {
      return fail(400, { marketplaceId, invalid: true });
    }
    if (!containerEngineId) {
      return fail(400, { containerEngineId, invalid: true });
    }
    const marketplaceApp = await db$1.query.marketplaceApps.findFirst({
      where: and(
        eq(marketplaceApps.appId, appId),
        eq(marketplaceApps.marketplaceId, marketplaceId)
      )
    });
    if (!marketplaceApp) {
      return fail(400, { appId, notFound: true });
    }
    const containerEngine = await db$1.query.containerEngines.findFirst({
      where: eq(containerEngines.id, containerEngineId)
    });
    if (!containerEngine) {
      return fail(400, { containerEngineId, notFound: true });
    }
    await db$1.insert(apps).values({
      appId: marketplaceApp.appId,
      marketplaceId: marketplaceApp.marketplaceId,
      containerEngineId: containerEngine.id,
      installedAt: Date.now()
    }).onConflictDoNothing();
    const dockerode = await getEngine(containerEngine);
    new DockerodeCompose(
      dockerode,
      join(getMarketplaceAppPath(marketplaceApp), "compose.yml"),
      `${marketplaceApp.marketplaceId}_${marketplaceApp.appId}`
    );
    console.debug(appId, marketplaceId, containerEngineId);
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 5;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-6SeBHkE_.js')).default;
const server_id = "src/routes/(sidebar)/discover/+page.server.ts";
const imports = ["_app/immutable/nodes/5.pqW4A2J9.js","_app/immutable/chunks/scheduler.bQlOXBkt.js","_app/immutable/chunks/index.dknh01mB.js","_app/immutable/chunks/each.anRlpCm9.js","_app/immutable/chunks/forms.uhvzcuB7.js","_app/immutable/chunks/entry.qbHVI6p7.js","_app/immutable/chunks/index.5bRYXlS8.js","_app/immutable/chunks/popup.R-M2AyRG.js","_app/immutable/chunks/stores.-cQko4Xi.js","_app/immutable/chunks/ProgressBar.svelte_svelte_type_style_lang.JlGIzIKZ.js","_app/immutable/chunks/ProgressRadial.xsBlPM_P.js","_app/immutable/chunks/spread.rEx3vLA9.js","_app/immutable/chunks/Icon.9NkTZT6r.js","_app/immutable/chunks/plus.qIUUgd4x.js","_app/immutable/chunks/i18n.Mah0M8rZ.js"];
const stylesheets = ["_app/immutable/assets/ProgressBar.oq5aOWfL.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=5-qqBqjTIT.js.map
