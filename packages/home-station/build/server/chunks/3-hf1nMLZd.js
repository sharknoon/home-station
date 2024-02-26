import { f as fail, r as redirect } from './index-RcZWwKaW.js';
import { l as lucia } from './auth-zDdazaLo.js';
import 'lucia';
import './db-cvVcOA05.js';
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
import './prod-ssr-neY5j8Pr.js';
import '@lucia-auth/adapter-drizzle';

const actions = {
  logout: async ({ locals, cookies }) => {
    if (!locals.session) {
      return fail(401);
    }
    await lucia.invalidateSession(locals.session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes
    });
    redirect(302, "/login");
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions
});

const index = 3;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-o9voXRKr.js')).default;
const server_id = "src/routes/(sidebar)/+page.server.ts";
const imports = ["_app/immutable/nodes/3.JYjOPWo3.js","_app/immutable/chunks/scheduler.bQlOXBkt.js","_app/immutable/chunks/index.dknh01mB.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=3-hf1nMLZd.js.map
