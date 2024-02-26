import { t as tasks, e as executeTask } from './tasks-4ACMqUQQ.js';
import { g as get_store_value } from './utils2-5dgI7ZmJ.js';
import { f as fail } from './index-RcZWwKaW.js';
import './index2-I838xfq7.js';
import 'cron';
import './marketplaces-Hf_qDRv9.js';
import 'node:fs/promises';
import 'isomorphic-git';
import 'isomorphic-git/http/node/index.js';
import 'node:path';
import 'js-yaml';
import './db-cvVcOA05.js';
import 'drizzle-orm/better-sqlite3';
import 'drizzle-orm/better-sqlite3/migrator';
import 'better-sqlite3';
import 'drizzle-orm/sqlite-core';
import 'drizzle-orm';
import './appdata-osNviCV5.js';
import 'node:os';
import 'winston';
import 'i18next';
import 'i18next-browser-languagedetector';
import 'cronstrue/locales/en.js';
import 'cronstrue/locales/de.js';
import './auth-zDdazaLo.js';
import 'lucia';
import './prod-ssr-neY5j8Pr.js';
import '@lucia-auth/adapter-drizzle';

const load = async () => {
  return {
    tasks: tasks.map((task) => {
      const stats = get_store_value(task.stats);
      return {
        id: task.id,
        schedule: task.schedule,
        stats: {
          progress: stats.progress,
          running: stats.running,
          lastExecution: stats.lastExecution,
          lastDuration: stats.lastDuration,
          nextExecution: stats.nextExecution
        }
      };
    })
  };
};
const actions = {
  async runTask({ request }) {
    const formData = await request.formData();
    const id = formData.get("id");
    if (!id) {
      return fail(400, { error: "No task ID provided" });
    }
    const task = tasks.find((task2) => task2.id === id);
    if (!task) {
      return fail(404, { error: `Task with ID "${id}" not found` });
    }
    executeTask(task);
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 9;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Dz5quyLx.js')).default;
const server_id = "src/routes/(sidebar)/settings/tasks/+page.server.ts";
const imports = ["_app/immutable/nodes/9.EMrgxRoi.js","_app/immutable/chunks/scheduler.bQlOXBkt.js","_app/immutable/chunks/index.dknh01mB.js","_app/immutable/chunks/each.anRlpCm9.js","_app/immutable/chunks/i18n.Mah0M8rZ.js","_app/immutable/chunks/index.5bRYXlS8.js","_app/immutable/chunks/spread.rEx3vLA9.js","_app/immutable/chunks/Icon.9NkTZT6r.js","_app/immutable/chunks/forms.uhvzcuB7.js","_app/immutable/chunks/entry.qbHVI6p7.js","_app/immutable/chunks/ProgressBar.svelte_svelte_type_style_lang.JlGIzIKZ.js","_app/immutable/chunks/ProgressRadial.xsBlPM_P.js"];
const stylesheets = ["_app/immutable/assets/ProgressBar.oq5aOWfL.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=9-dKH6bMrP.js.map
