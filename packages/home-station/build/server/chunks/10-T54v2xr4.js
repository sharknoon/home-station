import { d as db$1 } from './db-cvVcOA05.js';
import 'node:path';
import 'drizzle-orm/better-sqlite3';
import 'drizzle-orm/better-sqlite3/migrator';
import 'better-sqlite3';
import 'drizzle-orm/sqlite-core';
import 'drizzle-orm';
import './appdata-osNviCV5.js';
import 'node:fs/promises';
import 'node:os';
import 'winston';

const load = async () => {
  const users = await db$1.query.users.findMany();
  return { users };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 10;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Do5nyX9n.js')).default;
const server_id = "src/routes/(sidebar)/settings/users/+page.server.ts";
const imports = ["_app/immutable/nodes/10.LzPPCinV.js","_app/immutable/chunks/scheduler.bQlOXBkt.js","_app/immutable/chunks/each.anRlpCm9.js","_app/immutable/chunks/index.dknh01mB.js","_app/immutable/chunks/i18n.Mah0M8rZ.js","_app/immutable/chunks/index.5bRYXlS8.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=10-T54v2xr4.js.map
