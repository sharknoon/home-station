import { r as redirect, f as fail } from './index-RcZWwKaW.js';
import { d as db$1, u as users } from './db-cvVcOA05.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { l as lucia } from './auth-zDdazaLo.js';
import 'node:path';
import 'drizzle-orm/better-sqlite3';
import 'drizzle-orm/better-sqlite3/migrator';
import 'better-sqlite3';
import 'drizzle-orm/sqlite-core';
import './appdata-osNviCV5.js';
import 'node:fs/promises';
import 'node:os';
import 'winston';
import 'lucia';
import './prod-ssr-neY5j8Pr.js';
import '@lucia-auth/adapter-drizzle';

const load = async ({ locals }) => {
  if (locals.user)
    return redirect(302, "/");
  return {};
};
const actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const username = formData.get("username")?.toString();
    const password = formData.get("password")?.toString();
    if (!username || username.length < 4 || username.length > 31) {
      return fail(400, { incorrect: true });
    }
    if (!password || password.length < 6 || password.length > 255) {
      return fail(400, { incorrect: true });
    }
    const existingUser = await db$1.query.users.findFirst({
      where: eq(users.username, username.toLowerCase())
    });
    const validPassword = await bcrypt.compare(
      password,
      existingUser?.hashedPassword ?? "$2b$10$BObGWttlK4uY36m7fb99YuYoulhSIsFeZ/EUiGqbwzDiTShGYTYue"
    );
    if (!validPassword || !existingUser) {
      return fail(400, { incorrect: true });
    }
    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes
    });
    return redirect(302, "/");
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 11;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-JpzEh1Nm.js')).default;
const server_id = "src/routes/login/+page.server.ts";
const imports = ["_app/immutable/nodes/11.5vtEHQwO.js","_app/immutable/chunks/scheduler.bQlOXBkt.js","_app/immutable/chunks/index.dknh01mB.js","_app/immutable/chunks/forms.uhvzcuB7.js","_app/immutable/chunks/entry.qbHVI6p7.js","_app/immutable/chunks/index.5bRYXlS8.js","_app/immutable/chunks/i18n.Mah0M8rZ.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=11-BRzVmp8j.js.map
