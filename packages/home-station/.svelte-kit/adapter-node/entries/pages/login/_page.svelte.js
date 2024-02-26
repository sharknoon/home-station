import { s as subscribe } from "../../../chunks/utils2.js";
import { c as create_ssr_component, e as escape, b as add_attribute } from "../../../chunks/ssr.js";
import "devalue";
import "../../../chunks/client.js";
import { a as i18n } from "../../../chunks/i18n.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $i18n, $$unsubscribe_i18n;
  $$unsubscribe_i18n = subscribe(i18n, (value) => $i18n = value);
  let { form } = $$props;
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  $$unsubscribe_i18n();
  return `<div class="h-full flex flex-col gap-12 justify-center items-center p-12"><h1 class="h1"><span class="bg-gradient-to-br from-primary-500 to-secondary-500 bg-clip-text text-transparent box-decoration-clone font-bold">${escape($i18n.t("brand.title"))}</span></h1> <div class="card p-4"><h3 class="h3 text-center mb-2">${escape($i18n.t("login.login-to-continue"))}</h3> <form method="post" class="space-y-4"><label class="label"><span>${escape($i18n.t("login.username"))}</span> <input class="input" type="text" name="username"${add_attribute("placeholder", $i18n.t("login.username"), 0)}></label> <label class="label"><span>${escape($i18n.t("login.password"))}</span> <input class="input" type="password" name="password"${add_attribute("placeholder", $i18n.t("login.password"), 0)}></label> ${form?.incorrect ? `<p class="text-error-500-400-token text-sm">${escape($i18n.t("login.incorrect-username-or-password"))}</p>` : ``} <button type="submit" class="btn variant-filled-primary">${escape($i18n.t("login.login"))}</button></form></div></div>`;
});
export {
  Page as default
};
