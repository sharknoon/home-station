import { s as subscribe } from './utils2-5dgI7ZmJ.js';
import { c as create_ssr_component, e as escape } from './ssr-7I8bkXxs.js';
import { p as page } from './stores3-LPogNXES.js';
import './client-_MkdHwD5.js';
import './exports-mq_1S73-.js';

const Error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_page();
  return `<h1>${escape($page.status)}</h1> <p>${escape($page.error?.message)}</p>`;
});

export { Error as default };
//# sourceMappingURL=error.svelte-oGIXcRYQ.js.map
