import { s as subscribe } from './utils2-5dgI7ZmJ.js';
import { c as create_ssr_component, v as validate_component, e as escape, g as each, b as add_attribute } from './ssr-7I8bkXxs.js';
import './client-_MkdHwD5.js';
import { g as getModalStore } from './stores-86Gz9tEW.js';
import './ProgressBar.svelte_svelte_type_style_lang-sRcjXr2g.js';
import { P as ProgressRadial } from './ProgressRadial-turoKK2D.js';
import { I as Icon$1 } from './Icon-Z8qjZ-ni.js';
import { P as Plus$1 } from './plus-e05rKn2r.js';
import { i as i18n, l as ls } from './i18n-R5fiHbV9.js';
import './exports-mq_1S73-.js';
import './index2-I838xfq7.js';
import 'i18next';
import 'i18next-browser-languagedetector';
import 'cronstrue/locales/en.js';
import 'cronstrue/locales/de.js';

const Globe = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    [
      "path",
      {
        "d": "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"
      }
    ],
    ["path", { "d": "M2 12h20" }]
  ];
  return `${validate_component(Icon$1, "Icon").$$render($$result, Object.assign({}, { name: "globe" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Globe$1 = Globe;
const Hard_drive_download = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["path", { "d": "M12 2v8" }],
    ["path", { "d": "m16 6-4 4-4-4" }],
    [
      "rect",
      {
        "width": "20",
        "height": "8",
        "x": "2",
        "y": "14",
        "rx": "2"
      }
    ],
    ["path", { "d": "M6 18h.01" }],
    ["path", { "d": "M10 18h.01" }]
  ];
  return `${validate_component(Icon$1, "Icon").$$render($$result, Object.assign({}, { name: "hard-drive-download" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const HardDriveDownload = Hard_drive_download;
const Info = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    ["path", { "d": "M12 16v-4" }],
    ["path", { "d": "M12 8h.01" }]
  ];
  return `${validate_component(Icon$1, "Icon").$$render($$result, Object.assign({}, { name: "info" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Info$1 = Info;
const Library_big = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "rect",
      {
        "width": "8",
        "height": "18",
        "x": "3",
        "y": "3",
        "rx": "1"
      }
    ],
    ["path", { "d": "M7 3v18" }],
    [
      "path",
      {
        "d": "M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z"
      }
    ]
  ];
  return `${validate_component(Icon$1, "Icon").$$render($$result, Object.assign({}, { name: "library-big" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const LibraryBig = Library_big;
const Code = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["polyline", { "points": "16 18 22 12 16 6" }],
    ["polyline", { "points": "8 6 2 12 8 18" }]
  ];
  return `${validate_component(Icon$1, "Icon").$$render($$result, Object.assign({}, { name: "code" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Code$1 = Code;
const External_link = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["path", { "d": "M15 3h6v6" }],
    ["path", { "d": "M10 14 21 3" }],
    [
      "path",
      {
        "d": "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
      }
    ]
  ];
  return `${validate_component(Icon$1, "Icon").$$render($$result, Object.assign({}, { name: "external-link" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const ExternalLink = External_link;
const Trash_2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["path", { "d": "M3 6h18" }],
    [
      "path",
      {
        "d": "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"
      }
    ],
    [
      "path",
      {
        "d": "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
      }
    ],
    [
      "line",
      {
        "x1": "10",
        "x2": "10",
        "y1": "11",
        "y2": "17"
      }
    ],
    [
      "line",
      {
        "x1": "14",
        "x2": "14",
        "y1": "11",
        "y2": "17"
      }
    ]
  ];
  return `${validate_component(Icon$1, "Icon").$$render($$result, Object.assign({}, { name: "trash-2" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Trash2 = Trash_2;
const Pencil = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"
      }
    ],
    ["path", { "d": "m15 5 4 4" }]
  ];
  return `${validate_component(Icon$1, "Icon").$$render($$result, Object.assign({}, { name: "pencil" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Pencil$1 = Pencil;
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $i18n, $$unsubscribe_i18n;
  $$unsubscribe_i18n = subscribe(i18n, (value) => $i18n = value);
  let { data } = $$props;
  getModalStore();
  let appsLoading = [];
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$unsubscribe_i18n();
  return `<div class="flex justify-end"><button type="button" class="btn-icon variant-soft">${validate_component(LibraryBig, "LibraryBig").$$render($$result, {}, {}, {})}</button> <div class="card p-4 max-w-[36rem] shadow-xl" data-popup="popupMarketplaces"><div class="space-y-2"><h3 class="h3">${escape($i18n.t("discover.marketplaces"))}</h3> <ul class="list">${each(data.marketplaces, (marketplace) => {
    return `<li><form method="post" class="flex items-center gap-1"><input type="hidden" name="id"${add_attribute("value", marketplace.id, 0)}> <span class="mr-2">${escape(marketplace.gitRemoteUrl)}</span>  <button disabled class="btn-icon">${validate_component(Pencil$1, "Pencil").$$render($$result, {}, {}, {})}</button> <button formaction="?/deleteRepository" class="btn-icon text-error-500-400-token">${validate_component(Trash2, "Trash2").$$render($$result, {}, {}, {})}</button></form> </li>`;
  })}</ul>  <button disabled class="btn btn-sm variant-filled-primary space-x-2">${validate_component(Plus$1, "Plus").$$render($$result, {}, {}, {})} <span>${escape($i18n.t("discover.add-marketplace"))}</span></button>  ${!data.marketplaces.some((marketplace) => marketplace.gitRemoteUrl === "https://github.com/home-station-org/apps.git") ? `<button disabled class="btn btn-sm variant-filled-secondary space-x-2 ml-2">${validate_component(Plus$1, "Plus").$$render($$result, {}, {}, {})} <span>${escape($i18n.t("discover.add-default-marketplace"))}</span></button>` : ``}</div> <div class="arrow bg-surface-100-800-token"></div></div></div> <div class="grid grid-cols-4 gap-4">${each(data.marketplaceApps, (app) => {
    return `<div class="card card-hover overflow-hidden"><header class="h-24 max-h-24 p-2 bg-white"><div class="h-full bg-contain bg-no-repeat bg-center" style="${"background-image: url('" + escape(app.banner, true) + "');"}"></div></header> <div class="p-4 space-y-2"><div class="flex gap-4 items-center"><img${add_attribute("src", app.icon, 0)} alt="icon" class="object-cover h-20 w-20 rounded-2xl p-2 bg-white"> <div><h3 class="h3">${escape(ls(app.name))}</h3> <div class="text-sm text-surface-700-200-token">${escape(app.developer)}</div> </div></div> <div class="flex gap-2 overflow-x-auto pb-3">${app.links.website ? `<a class="chip variant-soft hover:variant-filled"${add_attribute("href", app.links.website, 0)} target="_blank"><span>${validate_component(Globe$1, "Globe").$$render($$result, { class: "h-4 w-4" }, {}, {})}</span> <span>${escape($i18n.t("discover.links.website"))}</span> </a>` : ``} ${app.links.repository ? `<a class="chip variant-soft hover:variant-filled"${add_attribute("href", app.links.repository, 0)} target="_blank"><span>${validate_component(Code$1, "Code").$$render($$result, { class: "h-4 w-4" }, {}, {})}</span> <span>${escape($i18n.t("discover.links.repository"))}</span> </a>` : ``} ${each(app.links.custom ?? [], (link) => {
      return `<a class="chip variant-soft hover:variant-filled"${add_attribute("href", link.url, 0)} target="_blank"><span>${validate_component(ExternalLink, "ExternalLink").$$render($$result, { class: "h-4 w-4" }, {}, {})}</span> <span>${escape(ls(link.name))}</span> </a>`;
    })}</div> <div class="!-mt-2">${escape(ls(app.description))}</div> <span class="badge variant-filled">${escape(app.category)}</span></div> <hr> <div class="p-4"><form method="post" class="flex justify-between"><input type="hidden" name="appId"${add_attribute("value", app.appId, 0)}> <input type="hidden" name="marketplaceId"${add_attribute("value", app.marketplace.id, 0)}> <button type="button" class="btn btn-icon variant-soft">${validate_component(Info$1, "Info").$$render($$result, {}, {}, {})}</button> ${data.containerEngines.length === 0 ? `<button type="button" disabled class="btn variant-filled-primary font-semibold">${validate_component(HardDriveDownload, "HardDriveDownload").$$render($$result, { class: "mr-2" }, {}, {})} ${escape($i18n.t("discover.install"))}</button> <div class="card p-4 variant-filled-warning" data-popup="popupNoContainerEngines"><p>${escape($i18n.t("discover.popup-no-container-engines.no-container-engine-available"))}</p> <div class="arrow variant-filled-warning"></div> </div>` : `${data.containerEngines.length === 1 ? `<input type="hidden" name="containerEngineId"${add_attribute("value", data.containerEngines[0].id, 0)}> <button type="submit" formaction="?/installApp" class="btn variant-filled-primary font-semibold">${appsLoading.includes(app.appId) ? `${validate_component(ProgressRadial, "ProgressRadial").$$render(
      $$result,
      {
        class: "h-6 w-6 mr-2 -ml-2",
        stroke: 100,
        meter: "stroke-surface-50 dark:stroke-surface-900",
        value: void 0
      },
      {},
      {}
    )} ${escape($i18n.t("discover.installing"))}` : `${validate_component(HardDriveDownload, "HardDriveDownload").$$render($$result, { class: "mr-2" }, {}, {})} ${escape($i18n.t("discover.install"))}`} </button>` : `<button type="button" class="btn variant-filled-primary font-semibold">${appsLoading.includes(app.appId) ? `${validate_component(ProgressRadial, "ProgressRadial").$$render(
      $$result,
      {
        class: "h-6 w-6 mr-2 -ml-2",
        stroke: 100,
        meter: "stroke-surface-50 dark:stroke-surface-900",
        value: void 0
      },
      {},
      {}
    )} ${escape($i18n.t("discover.installing"))}` : `${validate_component(HardDriveDownload, "HardDriveDownload").$$render($$result, { class: "mr-2" }, {}, {})} ${escape($i18n.t("discover.install"))}`} </button>`}`} </form></div> </div>`;
  })}</div>  <h1 data-svelte-h="svelte-pbvrh6">Recently Added</h1>  <h1 data-svelte-h="svelte-1u4cmqo">Trends</h1>  <h1 data-svelte-h="svelte-1e99svd">Charts</h1>  <h1 data-svelte-h="svelte-1pj7hf8">Categories</h1>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-6SeBHkE_.js.map
