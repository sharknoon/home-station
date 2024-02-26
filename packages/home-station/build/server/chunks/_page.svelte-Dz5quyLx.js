import { s as subscribe } from './utils2-5dgI7ZmJ.js';
import { c as create_ssr_component, e as escape, g as each, b as add_attribute, v as validate_component } from './ssr-7I8bkXxs.js';
import { intlFormatDistance } from 'date-fns';
import { i as i18n } from './i18n-R5fiHbV9.js';
import { I as Icon$1 } from './Icon-Z8qjZ-ni.js';
import cronstrue from 'cronstrue';
import './client-_MkdHwD5.js';
import './ProgressBar.svelte_svelte_type_style_lang-sRcjXr2g.js';
import { P as ProgressRadial } from './ProgressRadial-turoKK2D.js';
import 'i18next';
import 'i18next-browser-languagedetector';
import './index2-I838xfq7.js';
import 'cronstrue/locales/en.js';
import 'cronstrue/locales/de.js';
import './exports-mq_1S73-.js';

const Play = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [["polygon", { "points": "5 3 19 12 5 21 5 3" }]];
  return `${validate_component(Icon$1, "Icon").$$render($$result, Object.assign({}, { name: "play" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Play$1 = Play;
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $i18n, $$unsubscribe_i18n;
  $$unsubscribe_i18n = subscribe(i18n, (value) => $i18n = value);
  let { data } = $$props;
  setInterval(
    () => {
      data.tasks = data.tasks;
    },
    1e3
  );
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$unsubscribe_i18n();
  return `<h2 class="h2 mb-4">${escape($i18n.t("settings.tasks.scheduled-tasks"))}</h2> <div class="table-container"><table class="table table-hover [&_td]:!align-middle"><thead><tr><th>${escape($i18n.t("settings.tasks.name"))}</th> <th>${escape($i18n.t("settings.tasks.interval"))}</th> <th>${escape($i18n.t("settings.tasks.last-execution"))}</th> <th>${escape($i18n.t("settings.tasks.last-duration"))}</th> <th>${escape($i18n.t("settings.tasks.next-execution"))}</th> <th></th></tr></thead> <tbody>${each(data.tasks, (task) => {
    return `<tr><td>${escape($i18n.t("tasks." + task.id))}</td> <td class="capitalize">${escape(cronstrue.toString(task.schedule, { locale: $i18n.language }))}</td> <td class="capitalize">${escape(task.stats.lastExecution ? intlFormatDistance(task.stats.lastExecution, /* @__PURE__ */ new Date(), { locale: $i18n.language }) : "-")}</td> <td> ${escape(task.stats.lastDuration ? `${task.stats.lastDuration} ${$i18n.t("settings.tasks.milliseconds")}` : "-")}</td> <td class="capitalize">${escape(task.stats.nextExecution ? intlFormatDistance(task.stats.nextExecution, /* @__PURE__ */ new Date(), { locale: $i18n.language }) : "-")}</td> <td class="flex items-center justify-end gap-2"><form method="post"><input type="hidden" name="id"${add_attribute("value", task.id, 0)}> <button type="submit" formaction="?/runTask" class="btn btn-sm variant-filled disabled:!opacity-100" ${task.stats.running ? "disabled" : ""}>${task.stats.running ? `${validate_component(ProgressRadial, "ProgressRadial").$$render(
      $$result,
      {
        class: "h-4 w-4",
        stroke: 100,
        meter: "stroke-surface-50 dark:stroke-surface-900",
        value: task.stats.progress === void 0 || task.stats.progress === null ? void 0 : task.stats.progress * 100
      },
      {},
      {}
    )}` : `${validate_component(Play$1, "Play").$$render($$result, { class: "h-4 w-4" }, {}, {})}`}</button> </form></td> </tr>`;
  })}</tbody></table></div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-Dz5quyLx.js.map
