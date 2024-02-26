import { f as fail, r as redirect } from "../../../chunks/index.js";
import { l as lucia } from "../../../chunks/auth.js";
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
export {
  actions
};
