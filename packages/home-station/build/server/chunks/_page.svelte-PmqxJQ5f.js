import { c as create_ssr_component, g as each, e as escape } from './ssr-7I8bkXxs.js';
import './utils2-5dgI7ZmJ.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${each(data.domainsAndHostnames, (host) => {
    return `${escape(host.host)}`;
  })}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-PmqxJQ5f.js.map
