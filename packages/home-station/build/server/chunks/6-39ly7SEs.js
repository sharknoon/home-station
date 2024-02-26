import { d as db$1 } from './db-cvVcOA05.js';
import { t as testRemoteConnection, a as testLocalConnection } from './containerengines-JQNszNnj.js';
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
import 'dockerode';

const load = async () => {
  const containerEngines = await db$1.query.containerEngines.findMany();
  for (const engine of containerEngines) {
    try {
      let docker;
      if (engine.host) {
        docker = await testRemoteConnection(
          engine.host,
          engine.ca ?? void 0,
          engine.cert ?? void 0,
          engine.key ?? void 0
        );
      } else {
        docker = await testLocalConnection(engine.socketPath ?? void 0);
      }
      const info = await docker.info();
      const volumes = await docker.listVolumes();
      const stacks = (await docker.listContainers({ all: true })).filter((container) => container.Labels?.["com.docker.compose.project"]).map((container) => container.Labels?.["com.docker.compose.project"]).filter((value, index, self) => self.indexOf(value) === index);
      engine.up = true;
      engine.numberOfCPUs = info?.NCPU ?? 0;
      engine.totalMemory = info?.MemTotal ?? 0;
      engine.numberOfStacks = stacks?.length ?? 0;
      engine.numberOfContainers = info?.Containers ?? 0;
      engine.numberOfImages = info?.Images ?? 0;
      engine.numberOfVolumes = volumes?.Volumes?.length ?? 0;
    } catch {
      engine.up = false;
    }
  }
  return { containerEngines };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 6;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-k-0WounH.js')).default;
const server_id = "src/routes/(sidebar)/settings/container-engines/+page.server.ts";
const imports = ["_app/immutable/nodes/6.7oR_MEWe.js","_app/immutable/chunks/scheduler.bQlOXBkt.js","_app/immutable/chunks/index.dknh01mB.js","_app/immutable/chunks/each.anRlpCm9.js","_app/immutable/chunks/spread.rEx3vLA9.js","_app/immutable/chunks/Icon.9NkTZT6r.js","_app/immutable/chunks/i18n.Mah0M8rZ.js","_app/immutable/chunks/index.5bRYXlS8.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=6-39ly7SEs.js.map
