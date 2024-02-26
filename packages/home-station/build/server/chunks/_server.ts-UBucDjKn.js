import { t as tasks } from './tasks-4ACMqUQQ.js';
import './index2-I838xfq7.js';
import './utils2-5dgI7ZmJ.js';
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

const controllers = /* @__PURE__ */ new Set();
{
  for (const task of tasks) {
    task.stats.subscribe((stats) => {
      const result = `event: updateStats
data: ${JSON.stringify({ id: task.id, stats })}

`;
      controllers.forEach((controller) => controller.enqueue(result));
    });
  }
}
const GET = async () => {
  let controller;
  return new Response(
    new ReadableStream({
      start: (c) => {
        controller = c;
        controllers.add(controller);
      },
      cancel: () => {
        controllers.delete(controller);
      }
    }),
    {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive"
      }
    }
  );
};

export { GET };
//# sourceMappingURL=_server.ts-UBucDjKn.js.map
