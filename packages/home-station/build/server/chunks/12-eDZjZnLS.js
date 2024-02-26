import { r as redirect, f as fail } from './index-RcZWwKaW.js';
import { eq } from 'drizzle-orm';
import { d as db$1, u as users, h as hostnames, c as containerEngines } from './db-cvVcOA05.js';
import { l as lucia } from './auth-zDdazaLo.js';
import dns from 'node:dns/promises';
import http from 'node:http';
import { a as testLocalConnection, t as testRemoteConnection } from './containerengines-JQNszNnj.js';
import { generateId } from 'lucia';
import bcrypt from 'bcrypt';
import 'node:path';
import 'drizzle-orm/better-sqlite3';
import 'drizzle-orm/better-sqlite3/migrator';
import 'better-sqlite3';
import 'drizzle-orm/sqlite-core';
import './appdata-osNviCV5.js';
import 'node:fs/promises';
import 'node:os';
import 'winston';
import './prod-ssr-neY5j8Pr.js';
import '@lucia-auth/adapter-drizzle';
import 'dockerode';

async function getPublicIp() {
  return new Promise((resolve, reject) => {
    http.get({ host: "api.ipify.org", port: 80, path: "/" }, (resp) => {
      resp.on("data", (ip) => {
        resolve(String(ip));
      });
      resp.on("error", reject);
    });
  });
}
async function detectHostnames() {
  try {
    return await dns.reverse(await getPublicIp());
  } catch (error) {
    return [];
  }
}
const load = async () => {
  const hasUsers = !!await db$1.query.users.findFirst();
  if (hasUsers) {
    return redirect(303, "/");
  }
  const detectedHostnames = await detectHostnames();
  return { detectedHostnames };
};
const actions = {
  signup: async ({ request, cookies }) => {
    const data = await request.formData();
    const username = data.get("username")?.toString();
    const password = data.get("password")?.toString();
    const language = data.get("language")?.toString();
    const domainsAndHostnames = data.get("hostnames")?.toString()?.split(",") ?? [];
    if (!username || !/[a-zA-Z0-9_]{4,31}/.test(username)) {
      return fail(400, { username, invalid: true });
    }
    if (!password || password.length < 8 || password.length > 255) {
      return fail(400, { password: "password", invalid: true });
    }
    if (!language || !["en", "de"].includes(language)) {
      return fail(400, { language, invalid: true });
    }
    const usernameExists = !!await db$1.query.users.findFirst({
      where: eq(users.username, username.toLowerCase())
    });
    if (usernameExists) {
      return fail(400, { username, exists: true });
    }
    try {
      const hostnameValues = domainsAndHostnames.map((h) => ({ host: h }));
      await db$1.insert(hostnames).values(hostnameValues).onConflictDoNothing();
      const userId = generateId(15);
      const hashedPassword = await bcrypt.hash(password, 10);
      await db$1.insert(users).values({
        id: userId,
        username: username.toLowerCase(),
        hashedPassword,
        language,
        theme: "skeleton"
      });
      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies.set(sessionCookie.name, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes
      });
    } catch (e) {
      return fail(500, {
        message: "An unknown error occurred"
      });
    }
    return redirect(302, "/");
  },
  async connectLocal({ request }) {
    try {
      const data = await request.formData();
      const name = data.get("name")?.toString();
      let socketPath = data.get("socketPath")?.toString();
      if (!name) {
        return fail(400, { type: "local", name, missing: true });
      }
      if (!socketPath)
        socketPath = void 0;
      const engine = await testLocalConnection(socketPath);
      await db$1.insert(containerEngines).values({
        id: 1,
        name,
        type: "local",
        socketPath,
        host: void 0,
        ca: void 0,
        cert: void 0,
        key: void 0
      }).onConflictDoUpdate({
        target: containerEngines.id,
        set: {
          name,
          type: "local",
          socketPath,
          host: void 0,
          ca: void 0,
          cert: void 0,
          key: void 0
        }
      });
      return { type: "local", success: true, hostname: (await engine.info())?.Name };
    } catch (e) {
      return { type: "local", error: String(e) };
    }
  },
  async connectRemote({ request }) {
    try {
      const data = await request.formData();
      const name = data.get("name")?.toString();
      const host = data.get("host")?.toString();
      let ca = await data.get("ca")?.text();
      let cert = await data.get("cert")?.text();
      let key = await data.get("key")?.text();
      if (!name) {
        return fail(400, { type: "remote", name, missing: true });
      }
      if (!host) {
        return fail(400, { type: "remote", host, missing: true });
      }
      if (!ca)
        ca = void 0;
      if (!cert)
        cert = void 0;
      if (!key)
        key = void 0;
      const engine = await testRemoteConnection(host, ca, cert, key);
      await db$1.insert(containerEngines).values({
        id: 1,
        name,
        type: "remote",
        socketPath: void 0,
        host,
        ca,
        cert,
        key
      }).onConflictDoUpdate({
        target: containerEngines.id,
        set: {
          name,
          type: "remote",
          socketPath: void 0,
          host,
          ca,
          cert,
          key
        }
      });
      return { type: "remote", success: true, hostname: (await engine.info())?.Name };
    } catch (e) {
      return { type: "remote", error: String(e) };
    }
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 12;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-5DndqIII.js')).default;
const server_id = "src/routes/setup/+page.server.ts";
const imports = ["_app/immutable/nodes/12.u-2PegFl.js","_app/immutable/chunks/scheduler.bQlOXBkt.js","_app/immutable/chunks/index.dknh01mB.js","_app/immutable/chunks/each.anRlpCm9.js","_app/immutable/chunks/ProgressBar.svelte_svelte_type_style_lang.JlGIzIKZ.js","_app/immutable/chunks/index.5bRYXlS8.js","_app/immutable/chunks/transitions.bjOOOgyG.js","_app/immutable/chunks/spread.rEx3vLA9.js","_app/immutable/chunks/Icon.9NkTZT6r.js","_app/immutable/chunks/plus.qIUUgd4x.js","_app/immutable/chunks/i18n.Mah0M8rZ.js","_app/immutable/chunks/forms.uhvzcuB7.js","_app/immutable/chunks/entry.qbHVI6p7.js","_app/immutable/chunks/stores.Xz95ZHQI.js"];
const stylesheets = ["_app/immutable/assets/ProgressBar.oq5aOWfL.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=12-eDZjZnLS.js.map
