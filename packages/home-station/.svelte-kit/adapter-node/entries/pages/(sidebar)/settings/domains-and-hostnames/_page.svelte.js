import { c as create_ssr_component, h as each, e as escape } from "../../../../../chunks/ssr.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${each(data.domainsAndHostnames, (host) => {
    return `${escape(host.host)}`;
  })}`;
});
export {
  Page as default
};
