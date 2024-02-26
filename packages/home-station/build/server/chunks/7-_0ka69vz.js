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
  const domainsAndHostnames = await db$1.query.hostnames.findMany();
  return { domainsAndHostnames };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 7;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-PmqxJQ5f.js')).default;
const server_id = "src/routes/(sidebar)/settings/domains-and-hostnames/+page.server.ts";
const imports = ["_app/immutable/nodes/7.HQHxBqzX.js","_app/immutable/chunks/scheduler.bQlOXBkt.js","_app/immutable/chunks/each.anRlpCm9.js","_app/immutable/chunks/index.dknh01mB.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=7-_0ka69vz.js.map
