import { d as db$1, u as users } from './db-cvVcOA05.js';
import { eq } from 'drizzle-orm';
import { f as fail } from './index-RcZWwKaW.js';
import { g as get_store_value } from './utils2-5dgI7ZmJ.js';
import { i as i18n } from './i18n-R5fiHbV9.js';
import bcrypt from 'bcrypt';

const themes = [
  { name: "skeleton", icon: "💀" },
  { name: "wintry", icon: "🌨️" },
  { name: "modern", icon: "🤖" },
  { name: "rocket", icon: "🚀" },
  { name: "seafoam", icon: "🧜‍♀️" },
  { name: "vintage", icon: "📺" },
  { name: "sahara", icon: "🏜️" },
  { name: "hamlindigo", icon: "👔" },
  { name: "gold-nouveau", icon: "💫" },
  { name: "crimson", icon: "⭕" }
];

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
    await db$1.update(users).set({ language }).where(eq(users.id, locals.user.id));
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
    await db$1.update(users).set({ hashedPassword }).where(eq(users.id, locals.user.id));
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
    await db$1.update(users).set({ theme }).where(eq(users.id, locals.user.id));
    locals.user.theme = theme;
    return { success: true, theme };
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions
});

const index = 4;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-ZKdye9iz.js')).default;
const server_id = "src/routes/(sidebar)/account/+page.server.ts";
const imports = ["_app/immutable/nodes/4.P1iGPAr_.js","_app/immutable/chunks/scheduler.bQlOXBkt.js","_app/immutable/chunks/index.dknh01mB.js","_app/immutable/chunks/each.anRlpCm9.js","_app/immutable/chunks/ProgressBar.svelte_svelte_type_style_lang.JlGIzIKZ.js","_app/immutable/chunks/index.5bRYXlS8.js","_app/immutable/chunks/spread.rEx3vLA9.js","_app/immutable/chunks/i18n.Mah0M8rZ.js","_app/immutable/chunks/Icon.9NkTZT6r.js","_app/immutable/chunks/forms.uhvzcuB7.js","_app/immutable/chunks/entry.qbHVI6p7.js"];
const stylesheets = ["_app/immutable/assets/ProgressBar.oq5aOWfL.css"];
const fonts = [];

var _4 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  component: component,
  fonts: fonts,
  imports: imports,
  index: index,
  server: _page_server_ts,
  server_id: server_id,
  stylesheets: stylesheets
});

export { _4 as _, themes as t };
//# sourceMappingURL=4-wm3Nw8I7.js.map
