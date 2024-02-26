import { c as create_ssr_component, v as validate_component } from './ssr-7I8bkXxs.js';
import { I as Icon$1 } from './Icon-Z8qjZ-ni.js';

const Plus = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [["path", { "d": "M5 12h14" }], ["path", { "d": "M12 5v14" }]];
  return `${validate_component(Icon$1, "Icon").$$render($$result, Object.assign({}, { name: "plus" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Plus$1 = Plus;

export { Plus$1 as P };
//# sourceMappingURL=plus-e05rKn2r.js.map
