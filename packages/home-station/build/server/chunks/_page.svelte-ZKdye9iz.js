import { s as subscribe, c as compute_rest_props, a as compute_slots } from './utils2-5dgI7ZmJ.js';
import { c as create_ssr_component, v as validate_component, e as escape, g as each, b as add_attribute, s as setContext, h as getContext, d as spread, i as escape_attribute_value, f as escape_object } from './ssr-7I8bkXxs.js';
import './ProgressBar.svelte_svelte_type_style_lang-sRcjXr2g.js';
import { i as i18n } from './i18n-R5fiHbV9.js';
import { I as Icon$1 } from './Icon-Z8qjZ-ni.js';
import './client-_MkdHwD5.js';
import { t as themes } from './4-wm3Nw8I7.js';
import './index2-I838xfq7.js';
import 'i18next';
import 'i18next-browser-languagedetector';
import 'cronstrue/locales/en.js';
import 'cronstrue/locales/de.js';
import './exports-mq_1S73-.js';
import './db-cvVcOA05.js';
import 'node:path';
import 'drizzle-orm/better-sqlite3';
import 'drizzle-orm/better-sqlite3/migrator';
import 'better-sqlite3';
import 'drizzle-orm/sqlite-core';
import 'drizzle-orm';
import './appdata-osNviCV5.js';
import 'node:fs/promises';
import 'node:os';
import 'winston';
import './index-RcZWwKaW.js';
import 'bcrypt';

const cBase$1 = "space-y-4";
const cList = "flex overflow-x-auto hide-scrollbar";
const cPanel = "";
const TabGroup = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classesBase;
  let classesList;
  let classesPanel;
  let $$slots = compute_slots(slots);
  let { justify = "justify-start" } = $$props;
  let { border = "border-b border-surface-400-500-token" } = $$props;
  let { active = "border-b-2 border-surface-900-50-token" } = $$props;
  let { hover = "hover:variant-soft" } = $$props;
  let { flex = "flex-none" } = $$props;
  let { padding = "px-4 py-2" } = $$props;
  let { rounded = "rounded-tl-container-token rounded-tr-container-token" } = $$props;
  let { spacing = "space-y-1" } = $$props;
  let { regionList = "" } = $$props;
  let { regionPanel = "" } = $$props;
  let { labelledby = "" } = $$props;
  let { panel = "" } = $$props;
  setContext("active", active);
  setContext("hover", hover);
  setContext("flex", flex);
  setContext("padding", padding);
  setContext("rounded", rounded);
  setContext("spacing", spacing);
  if ($$props.justify === void 0 && $$bindings.justify && justify !== void 0)
    $$bindings.justify(justify);
  if ($$props.border === void 0 && $$bindings.border && border !== void 0)
    $$bindings.border(border);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  if ($$props.hover === void 0 && $$bindings.hover && hover !== void 0)
    $$bindings.hover(hover);
  if ($$props.flex === void 0 && $$bindings.flex && flex !== void 0)
    $$bindings.flex(flex);
  if ($$props.padding === void 0 && $$bindings.padding && padding !== void 0)
    $$bindings.padding(padding);
  if ($$props.rounded === void 0 && $$bindings.rounded && rounded !== void 0)
    $$bindings.rounded(rounded);
  if ($$props.spacing === void 0 && $$bindings.spacing && spacing !== void 0)
    $$bindings.spacing(spacing);
  if ($$props.regionList === void 0 && $$bindings.regionList && regionList !== void 0)
    $$bindings.regionList(regionList);
  if ($$props.regionPanel === void 0 && $$bindings.regionPanel && regionPanel !== void 0)
    $$bindings.regionPanel(regionPanel);
  if ($$props.labelledby === void 0 && $$bindings.labelledby && labelledby !== void 0)
    $$bindings.labelledby(labelledby);
  if ($$props.panel === void 0 && $$bindings.panel && panel !== void 0)
    $$bindings.panel(panel);
  classesBase = `${cBase$1} ${$$props.class ?? ""}`;
  classesList = `${cList} ${justify} ${border} ${regionList}`;
  classesPanel = `${cPanel} ${regionPanel}`;
  return `  <div class="${"tab-group " + escape(classesBase, true)}" data-testid="tab-group"> <div class="${"tab-list " + escape(classesList, true)}" role="tablist"${add_attribute("aria-labelledby", labelledby, 0)}>${slots.default ? slots.default({}) : ``}</div>  ${$$slots.panel ? `<div class="${"tab-panel " + escape(classesPanel, true)}" role="tabpanel"${add_attribute("aria-labelledby", panel, 0)} tabindex="0">${slots.panel ? slots.panel({}) : ``}</div>` : ``}</div>`;
});
const cBase = "text-center cursor-pointer transition-colors duration-100";
const cInterface = "";
const Tab = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let selected;
  let classesActive;
  let classesBase;
  let classesInterface;
  let classesTab;
  let $$restProps = compute_rest_props($$props, [
    "group",
    "name",
    "value",
    "title",
    "controls",
    "regionTab",
    "active",
    "hover",
    "flex",
    "padding",
    "rounded",
    "spacing"
  ]);
  let $$slots = compute_slots(slots);
  let { group } = $$props;
  let { name } = $$props;
  let { value } = $$props;
  let { title = "" } = $$props;
  let { controls = "" } = $$props;
  let { regionTab = "" } = $$props;
  let { active = getContext("active") } = $$props;
  let { hover = getContext("hover") } = $$props;
  let { flex = getContext("flex") } = $$props;
  let { padding = getContext("padding") } = $$props;
  let { rounded = getContext("rounded") } = $$props;
  let { spacing = getContext("spacing") } = $$props;
  let elemInput;
  function prunedRestProps() {
    delete $$restProps.class;
    return $$restProps;
  }
  if ($$props.group === void 0 && $$bindings.group && group !== void 0)
    $$bindings.group(group);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.controls === void 0 && $$bindings.controls && controls !== void 0)
    $$bindings.controls(controls);
  if ($$props.regionTab === void 0 && $$bindings.regionTab && regionTab !== void 0)
    $$bindings.regionTab(regionTab);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  if ($$props.hover === void 0 && $$bindings.hover && hover !== void 0)
    $$bindings.hover(hover);
  if ($$props.flex === void 0 && $$bindings.flex && flex !== void 0)
    $$bindings.flex(flex);
  if ($$props.padding === void 0 && $$bindings.padding && padding !== void 0)
    $$bindings.padding(padding);
  if ($$props.rounded === void 0 && $$bindings.rounded && rounded !== void 0)
    $$bindings.rounded(rounded);
  if ($$props.spacing === void 0 && $$bindings.spacing && spacing !== void 0)
    $$bindings.spacing(spacing);
  selected = value === group;
  classesActive = selected ? active : hover;
  classesBase = `${cBase} ${flex} ${padding} ${rounded} ${classesActive} ${$$props.class ?? ""}`;
  classesInterface = `${cInterface} ${spacing}`;
  classesTab = `${regionTab}`;
  return `<label${add_attribute("class", classesBase, 0)}${add_attribute("title", title, 0)}> <div class="${"tab " + escape(classesTab, true)}" data-testid="tab" role="tab"${add_attribute("aria-controls", controls, 0)}${add_attribute("aria-selected", selected, 0)}${add_attribute("tabindex", selected ? 0 : -1, 0)}> <div class="h-0 w-0 overflow-hidden"><input${spread(
    [
      { type: "radio" },
      { name: escape_attribute_value(name) },
      { value: escape_attribute_value(value) },
      escape_object(prunedRestProps()),
      { tabindex: "-1" }
    ],
    {}
  )}${add_attribute("this", elemInput, 0)}${value === group ? add_attribute("checked", true, 1) : ""}></div>  <div class="${"tab-interface " + escape(classesInterface, true)}">${$$slots.lead ? `<div class="tab-lead">${slots.lead ? slots.lead({}) : ``}</div>` : ``} <div class="tab-label">${slots.default ? slots.default({}) : ``}</div></div></div></label>`;
});
const Paint_roller = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "rect",
      {
        "width": "16",
        "height": "6",
        "x": "2",
        "y": "2",
        "rx": "2"
      }
    ],
    [
      "path",
      {
        "d": "M10 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
      }
    ],
    [
      "rect",
      {
        "width": "4",
        "height": "6",
        "x": "8",
        "y": "16",
        "rx": "1"
      }
    ]
  ];
  return `${validate_component(Icon$1, "Icon").$$render($$result, Object.assign({}, { name: "paint-roller" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const PaintRoller = Paint_roller;
const Save = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
      }
    ],
    ["polyline", { "points": "17 21 17 13 7 13 7 21" }],
    ["polyline", { "points": "7 3 7 8 15 8" }]
  ];
  return `${validate_component(Icon$1, "Icon").$$render($$result, Object.assign({}, { name: "save" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Save$1 = Save;
function applyTheme(theme) {
  if (theme)
    document.body.setAttribute("data-theme", theme);
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let passwordCorrect;
  let passwordsEqual;
  let $i18n, $$unsubscribe_i18n;
  $$unsubscribe_i18n = subscribe(i18n, (value) => $i18n = value);
  let { data } = $$props;
  let { form } = $$props;
  let tabSet = 0;
  let password1;
  let password2;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      if (form?.language && form?.success)
        $i18n.changeLanguage(form.language);
    }
    passwordCorrect = 0 >= 8;
    passwordsEqual = password1 === password2;
    {
      if (form?.theme && form?.success)
        applyTheme(form.theme);
    }
    $$rendered = `${validate_component(TabGroup, "TabGroup").$$render($$result, {}, {}, {
      panel: () => {
        return `${tabSet === 0 ? `<form method="post" action="?/updateAccount"><label class="label"><span>${escape($i18n.t("account.general.language"))}</span> <select class="select" name="language">${``}${each(($i18n.options.supportedLngs || []).filter((l) => l !== "cimode").sort(), (l) => {
          return `<option${add_attribute("value", l, 0)} ${$i18n.language === l ? "selected" : ""}>${escape(new Intl.DisplayNames([l], { type: "language" }).of(l))} </option>`;
        })}</select></label> <button type="submit" class="btn variant-filled-primary mt-4">${validate_component(Save$1, "Save").$$render($$result, { class: "mr-2" }, {}, {})}${escape($i18n.t("account.general.save"))}</button></form>` : `${tabSet === 1 ? `<form method="post" action="?/updatePassword" class="space-y-4"><label class="label"><span>${escape($i18n.t("account.password.new"))}</span> <input class="input" type="password" name="password"${add_attribute("value", password1, 0)}> <span class="text-sm text-surface-600-300-token">${escape($i18n.t("account.password.requirements"))}</span></label> <label class="label"><span>${escape($i18n.t("account.password.confirm"))}</span> <input class="input" type="password"${add_attribute("value", password2, 0)}></label> <button type="submit" class="btn variant-filled-primary" ${!passwordsEqual || !passwordCorrect ? "disabled" : ""}>${validate_component(Save$1, "Save").$$render($$result, { class: "mr-2" }, {}, {})}${escape($i18n.t("account.password.save"))}</button></form>` : `${tabSet === 2 ? `<div class="grid grid-cols-3 gap-4">${each(themes, (theme) => {
          return `<form method="post" action="?/updateTheme" class="card p-4"${add_attribute("data-theme", theme.name, 0)}><input type="hidden" name="theme"${add_attribute("value", theme.name, 0)}> <div class="flex items-center gap-4"><h2 class="h2 capitalize">${escape(theme.icon)} ${escape(theme.name.replace("-", " "))}</h2> ${data.user?.theme === theme.name ? `<span class="badge variant-filled-secondary">${escape($i18n.t("account.theme.active"))} </span>` : ``}</div> <button type="submit" class="btn variant-filled-primary mt-4" ${""}>${validate_component(PaintRoller, "PaintRoller").$$render($$result, { class: "mr-2" }, {}, {})}${escape($i18n.t("account.theme.apply"))}</button> </form>`;
        })}</div>` : ``}`}`} `;
      },
      default: () => {
        return `${validate_component(Tab, "Tab").$$render(
          $$result,
          { name: "tab1", value: 0, group: tabSet },
          {
            group: ($$value) => {
              tabSet = $$value;
              $$settled = false;
            }
          },
          {
            default: () => {
              return `${escape($i18n.t("account.general.general"))}`;
            }
          }
        )} ${validate_component(Tab, "Tab").$$render(
          $$result,
          { name: "tab2", value: 1, group: tabSet },
          {
            group: ($$value) => {
              tabSet = $$value;
              $$settled = false;
            }
          },
          {
            default: () => {
              return `${escape($i18n.t("account.password.password"))}`;
            }
          }
        )} ${validate_component(Tab, "Tab").$$render(
          $$result,
          { name: "tab3", value: 2, group: tabSet },
          {
            group: ($$value) => {
              tabSet = $$value;
              $$settled = false;
            }
          },
          {
            default: () => {
              return `${escape($i18n.t("account.theme.theme"))}`;
            }
          }
        )}`;
      }
    })}`;
  } while (!$$settled);
  $$unsubscribe_i18n();
  return $$rendered;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-ZKdye9iz.js.map
