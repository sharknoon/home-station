import { r as redirect, f as fail } from "../../../chunks/index.js";
import { d as db, u as users } from "../../../chunks/db.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { l as lucia } from "../../../chunks/auth.js";
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
    const existingUser = await db.query.users.findFirst({
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
export {
  actions,
  load
};
