import { r as redirect, f as fail } from "../../../chunks/index.js";
import { eq } from "drizzle-orm";
import { d as db, u as users, h as hostnames, c as containerEngines } from "../../../chunks/db.js";
import { l as lucia } from "../../../chunks/auth.js";
import dns from "node:dns/promises";
import http from "node:http";
import { a as testLocalConnection, t as testRemoteConnection } from "../../../chunks/containerengines.js";
import { generateId } from "lucia";
import bcrypt from "bcrypt";
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
  const hasUsers = !!await db.query.users.findFirst();
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
    const usernameExists = !!await db.query.users.findFirst({
      where: eq(users.username, username.toLowerCase())
    });
    if (usernameExists) {
      return fail(400, { username, exists: true });
    }
    try {
      const hostnameValues = domainsAndHostnames.map((h) => ({ host: h }));
      await db.insert(hostnames).values(hostnameValues).onConflictDoNothing();
      const userId = generateId(15);
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.insert(users).values({
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
      await db.insert(containerEngines).values({
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
      await db.insert(containerEngines).values({
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
export {
  actions,
  load
};
