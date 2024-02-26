import { s as subscribe } from "../../../../../chunks/utils2.js";
import { c as create_ssr_component, e as escape, h as each } from "../../../../../chunks/ssr.js";
import { a as i18n } from "../../../../../chunks/i18n.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $i18n, $$unsubscribe_i18n;
  $$unsubscribe_i18n = subscribe(i18n, (value) => $i18n = value);
  let { data } = $$props;
  const languageNames = new Intl.DisplayNames([$i18n.language], { type: "language" });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$unsubscribe_i18n();
  return `<h2 class="h2 mb-4">${escape($i18n.t("settings.users.users"))}</h2> <div class="table-container"><table class="table table-hover [&_td]:!align-middle"><thead><tr><th>${escape($i18n.t("settings.users.username"))}</th> <th>${escape($i18n.t("settings.users.language"))}</th> <th></th></tr></thead> <tbody>${each(data.users, (user) => {
    return `<tr><td>${escape(user.username)}</td> <td>${escape(languageNames.of(user.language))}</td> </tr>`;
  })}</tbody></table></div>`;
});
export {
  Page as default
};
