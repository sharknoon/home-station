import { d as db, u as users } from "../../../../chunks/db.js";
import { eq } from "drizzle-orm";
import { f as fail } from "../../../../chunks/index.js";
import { g as get_store_value } from "../../../../chunks/utils2.js";
import { a as i18n } from "../../../../chunks/i18n.js";
import bcrypt from "bcrypt";
import { t as themes } from "../../../../chunks/theme.js";
const actions = {
  updateAccount: async ({ request, locals }) => {
    if (!locals.user)
      return fail(401, { success: false, error: "Unauthorized" });
    const data = await request.formData();
    const language = data.get("language")?.toString();
    if (!language)
      return fail(400, { success: false, language, error: "Language is required" });
    const supportedLanguages = get_store_value(i18n).options.supportedLngs || [];
    if (!supportedLanguages.includes(language)) {
      return fail(400, {
        error: `Unsupported language '${language}', supported languages: ${supportedLanguages}`
      });
    }
    await db.update(users).set({ language }).where(eq(users.id, locals.user.id));
    locals.user.language = language;
    return { success: true, language };
  },
  updatePassword: async ({ request, locals }) => {
    if (!locals.user)
      return fail(401, { success: false, error: "Unauthorized" });
    const data = await request.formData();
    const password = data.get("password")?.toString();
    if (!password || password.length < 8 || password.length > 255) {
      return fail(400, {
        success: false,
        password: "password",
        error: "Password is invalid"
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.update(users).set({ hashedPassword }).where(eq(users.id, locals.user.id));
    return { success: true, password: "password" };
  },
  updateTheme: async ({ request, locals }) => {
    if (!locals.user)
      return fail(401, { success: false, error: "Unauthorized" });
    const data = await request.formData();
    const theme = data.get("theme")?.toString();
    if (!theme)
      return fail(400, { success: false, theme, error: "Theme is required" });
    if (!themes.map((t) => t.name).includes(theme)) {
      return fail(400, {
        error: `Unsupported theme '${theme}', supported themes: ${themes}`
      });
    }
    await db.update(users).set({ theme }).where(eq(users.id, locals.user.id));
    locals.user.theme = theme;
    return { success: true, theme };
  }
};
export {
  actions
};
