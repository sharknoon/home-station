import { s as subscribe, b as set_store_value, a as compute_slots } from './utils2-5dgI7ZmJ.js';
import { c as create_ssr_component, e as escape, v as validate_component, b as add_attribute, g as each, s as setContext, a as createEventDispatcher, h as getContext, o as onDestroy } from './ssr-7I8bkXxs.js';
import { p as prefersReducedMotionStore } from './ProgressBar.svelte_svelte_type_style_lang-sRcjXr2g.js';
import { w as writable } from './index2-I838xfq7.js';
import { s as slide, a as fade } from './index3-IyzMm1tg.js';
import { I as Icon$1 } from './Icon-Z8qjZ-ni.js';
import { P as Plus$1 } from './plus-e05rKn2r.js';
import { i as i18n } from './i18n-R5fiHbV9.js';
import './client-_MkdHwD5.js';
import { p as page } from './stores3-LPogNXES.js';
import 'i18next';
import 'i18next-browser-languagedetector';
import 'cronstrue/locales/en.js';
import 'cronstrue/locales/de.js';
import './exports-mq_1S73-.js';

const Accordion = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classesBase;
  let $prefersReducedMotionStore, $$unsubscribe_prefersReducedMotionStore;
  $$unsubscribe_prefersReducedMotionStore = subscribe(prefersReducedMotionStore, (value) => $prefersReducedMotionStore = value);
  let { autocollapse = false } = $$props;
  let { width = "w-full" } = $$props;
  let { spacing = "space-y-1" } = $$props;
  let { disabled = false } = $$props;
  let { padding = "py-2 px-4" } = $$props;
  let { hover = "hover:bg-primary-hover-token" } = $$props;
  let { rounded = "rounded-container-token" } = $$props;
  let { caretOpen = "rotate-180" } = $$props;
  let { caretClosed = "" } = $$props;
  let { regionControl = "" } = $$props;
  let { regionPanel = "space-y-4" } = $$props;
  let { regionCaret = "" } = $$props;
  let { transitions = !$prefersReducedMotionStore } = $$props;
  let { transitionIn = slide } = $$props;
  let { transitionInParams = { duration: 200 } } = $$props;
  let { transitionOut = slide } = $$props;
  let { transitionOutParams = { duration: 200 } } = $$props;
  const active = writable(null);
  setContext("active", active);
  setContext("autocollapse", autocollapse);
  setContext("disabled", disabled);
  setContext("padding", padding);
  setContext("hover", hover);
  setContext("rounded", rounded);
  setContext("caretOpen", caretOpen);
  setContext("caretClosed", caretClosed);
  setContext("regionControl", regionControl);
  setContext("regionPanel", regionPanel);
  setContext("regionCaret", regionCaret);
  setContext("transitions", transitions);
  setContext("transitionIn", transitionIn);
  setContext("transitionInParams", transitionInParams);
  setContext("transitionOut", transitionOut);
  setContext("transitionOutParams", transitionOutParams);
  if ($$props.autocollapse === void 0 && $$bindings.autocollapse && autocollapse !== void 0)
    $$bindings.autocollapse(autocollapse);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.spacing === void 0 && $$bindings.spacing && spacing !== void 0)
    $$bindings.spacing(spacing);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.padding === void 0 && $$bindings.padding && padding !== void 0)
    $$bindings.padding(padding);
  if ($$props.hover === void 0 && $$bindings.hover && hover !== void 0)
    $$bindings.hover(hover);
  if ($$props.rounded === void 0 && $$bindings.rounded && rounded !== void 0)
    $$bindings.rounded(rounded);
  if ($$props.caretOpen === void 0 && $$bindings.caretOpen && caretOpen !== void 0)
    $$bindings.caretOpen(caretOpen);
  if ($$props.caretClosed === void 0 && $$bindings.caretClosed && caretClosed !== void 0)
    $$bindings.caretClosed(caretClosed);
  if ($$props.regionControl === void 0 && $$bindings.regionControl && regionControl !== void 0)
    $$bindings.regionControl(regionControl);
  if ($$props.regionPanel === void 0 && $$bindings.regionPanel && regionPanel !== void 0)
    $$bindings.regionPanel(regionPanel);
  if ($$props.regionCaret === void 0 && $$bindings.regionCaret && regionCaret !== void 0)
    $$bindings.regionCaret(regionCaret);
  if ($$props.transitions === void 0 && $$bindings.transitions && transitions !== void 0)
    $$bindings.transitions(transitions);
  if ($$props.transitionIn === void 0 && $$bindings.transitionIn && transitionIn !== void 0)
    $$bindings.transitionIn(transitionIn);
  if ($$props.transitionInParams === void 0 && $$bindings.transitionInParams && transitionInParams !== void 0)
    $$bindings.transitionInParams(transitionInParams);
  if ($$props.transitionOut === void 0 && $$bindings.transitionOut && transitionOut !== void 0)
    $$bindings.transitionOut(transitionOut);
  if ($$props.transitionOutParams === void 0 && $$bindings.transitionOutParams && transitionOutParams !== void 0)
    $$bindings.transitionOutParams(transitionOutParams);
  classesBase = `${width} ${spacing} ${$$props.class ?? ""}`;
  $$unsubscribe_prefersReducedMotionStore();
  return ` <div class="${"accordion " + escape(classesBase, true)}" data-testid="accordion">${slots.default ? slots.default({}) : ``}</div>`;
});
const cBase$2 = "";
const cControl = "text-start w-full flex items-center space-x-4";
const cControlIcons = "fill-current w-3 transition-transform duration-[200ms]";
const cPanel = "";
const AccordionItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let openState;
  let classesBase;
  let classesControl;
  let classesCaretState;
  let classesControlCaret;
  let classesControlIcons;
  let classesPanel;
  let $$slots = compute_slots(slots);
  let $active, $$unsubscribe_active;
  const dispatch = createEventDispatcher();
  let { open = false } = $$props;
  let { id = String(Math.random()) } = $$props;
  let { autocollapse = getContext("autocollapse") } = $$props;
  let { active = getContext("active") } = $$props;
  $$unsubscribe_active = subscribe(active, (value) => $active = value);
  let { disabled = getContext("disabled") } = $$props;
  let { padding = getContext("padding") } = $$props;
  let { hover = getContext("hover") } = $$props;
  let { rounded = getContext("rounded") } = $$props;
  let { caretOpen = getContext("caretOpen") } = $$props;
  let { caretClosed = getContext("caretClosed") } = $$props;
  let { regionControl = getContext("regionControl") } = $$props;
  let { regionPanel = getContext("regionPanel") } = $$props;
  let { regionCaret = getContext("regionCaret") } = $$props;
  let { transitions = getContext("transitions") } = $$props;
  let { transitionIn = getContext("transitionIn") } = $$props;
  let { transitionInParams = getContext("transitionInParams") } = $$props;
  let { transitionOut = getContext("transitionOut") } = $$props;
  let { transitionOutParams = getContext("transitionOutParams") } = $$props;
  const svgCaretIcon = `
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class={classesControlCaret}>
			<path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
		</svg>`;
  function setActive(event) {
    if (autocollapse === true) {
      active.set(id);
    } else {
      open = !open;
    }
    onToggle(event);
  }
  function onToggle(event) {
    const currentOpenState = autocollapse ? $active === id : open;
    dispatch("toggle", {
      event,
      id,
      panelId: `accordion-panel-${id}`,
      open: currentOpenState,
      autocollapse
    });
  }
  if (autocollapse && open)
    setActive();
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.autocollapse === void 0 && $$bindings.autocollapse && autocollapse !== void 0)
    $$bindings.autocollapse(autocollapse);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.padding === void 0 && $$bindings.padding && padding !== void 0)
    $$bindings.padding(padding);
  if ($$props.hover === void 0 && $$bindings.hover && hover !== void 0)
    $$bindings.hover(hover);
  if ($$props.rounded === void 0 && $$bindings.rounded && rounded !== void 0)
    $$bindings.rounded(rounded);
  if ($$props.caretOpen === void 0 && $$bindings.caretOpen && caretOpen !== void 0)
    $$bindings.caretOpen(caretOpen);
  if ($$props.caretClosed === void 0 && $$bindings.caretClosed && caretClosed !== void 0)
    $$bindings.caretClosed(caretClosed);
  if ($$props.regionControl === void 0 && $$bindings.regionControl && regionControl !== void 0)
    $$bindings.regionControl(regionControl);
  if ($$props.regionPanel === void 0 && $$bindings.regionPanel && regionPanel !== void 0)
    $$bindings.regionPanel(regionPanel);
  if ($$props.regionCaret === void 0 && $$bindings.regionCaret && regionCaret !== void 0)
    $$bindings.regionCaret(regionCaret);
  if ($$props.transitions === void 0 && $$bindings.transitions && transitions !== void 0)
    $$bindings.transitions(transitions);
  if ($$props.transitionIn === void 0 && $$bindings.transitionIn && transitionIn !== void 0)
    $$bindings.transitionIn(transitionIn);
  if ($$props.transitionInParams === void 0 && $$bindings.transitionInParams && transitionInParams !== void 0)
    $$bindings.transitionInParams(transitionInParams);
  if ($$props.transitionOut === void 0 && $$bindings.transitionOut && transitionOut !== void 0)
    $$bindings.transitionOut(transitionOut);
  if ($$props.transitionOutParams === void 0 && $$bindings.transitionOutParams && transitionOutParams !== void 0)
    $$bindings.transitionOutParams(transitionOutParams);
  {
    if (open && autocollapse)
      setActive();
  }
  openState = autocollapse ? $active === id : open;
  classesBase = `${cBase$2} ${$$props.class ?? ""}`;
  classesControl = `${cControl} ${padding} ${hover} ${rounded} ${regionControl}`;
  classesCaretState = openState ? caretOpen : caretClosed;
  classesControlCaret = `${cControlIcons} ${regionCaret} ${classesCaretState}`;
  classesControlIcons = `${cControlIcons} ${regionCaret}`;
  classesPanel = `${cPanel} ${padding} ${rounded} ${regionPanel}`;
  $$unsubscribe_active();
  return ` <div class="${"accordion-item " + escape(classesBase, true)}" data-testid="accordion-item"> <button type="button" class="${"accordion-control " + escape(classesControl, true)}"${add_attribute("id", id, 0)}${add_attribute("aria-expanded", openState, 0)} aria-controls="${"accordion-panel-" + escape(id, true)}" ${disabled ? "disabled" : ""}> ${$$slots.lead ? `<div class="accordion-lead">${slots.lead ? slots.lead({}) : ``}</div>` : ``}  <div class="accordion-summary flex-1">${slots.summary ? slots.summary({}) : `(summary)`}</div>  ${$$slots.iconClosed || $$slots.iconOpen ? `  <div class="${"accordion-summary-icons " + escape(classesControlIcons, true)}">${openState ? `${slots.iconClosed ? slots.iconClosed({}) : `<!-- HTML_TAG_START -->${svgCaretIcon}<!-- HTML_TAG_END -->`}` : `${slots.iconOpen ? slots.iconOpen({}) : `<!-- HTML_TAG_START -->${svgCaretIcon}<!-- HTML_TAG_END -->`}`}</div>` : ` <div class="${"accordion-summary-caret " + escape(classesControlCaret, true)}"><!-- HTML_TAG_START -->${svgCaretIcon}<!-- HTML_TAG_END --></div>`}</button>  ${openState ? `<div class="${"accordion-panel " + escape(classesPanel, true)}" id="${"accordion-panel-" + escape(id, true)}" role="region"${add_attribute("aria-hidden", !openState, 0)}${add_attribute("aria-labelledby", id, 0)}>${slots.content ? slots.content({}) : `(content)`}</div>` : ``}</div>`;
});
const cBase$1 = "space-y-4";
const cHeader$1 = "flex items-center border-t mt-[15px]";
const cHeaderStep = "-mt-[15px] transition-all duration-300";
const cContent$1 = "";
const Stepper = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isActive;
  let classesBase;
  let classesHeader;
  let classesHeaderStep;
  let classesBadge;
  let classesContent;
  let $state, $$unsubscribe_state;
  let $prefersReducedMotionStore, $$unsubscribe_prefersReducedMotionStore;
  $$unsubscribe_prefersReducedMotionStore = subscribe(prefersReducedMotionStore, (value) => $prefersReducedMotionStore = value);
  const dispatch = createEventDispatcher();
  let { gap = "gap-4" } = $$props;
  let { stepTerm = "Step" } = $$props;
  let { badge = "variant-filled-surface" } = $$props;
  let { active = "variant-filled" } = $$props;
  let { border = "border-surface-400-500-token" } = $$props;
  let { start = 0 } = $$props;
  let { justify = "justify-between" } = $$props;
  let { buttonBack = "variant-ghost" } = $$props;
  let { buttonBackType = "button" } = $$props;
  let { buttonBackLabel = "&larr; Back" } = $$props;
  let { buttonNext = "variant-filled" } = $$props;
  let { buttonNextType = "button" } = $$props;
  let { buttonNextLabel = "Next &rarr;" } = $$props;
  let { buttonComplete = "variant-filled-primary" } = $$props;
  let { buttonCompleteType = "button" } = $$props;
  let { buttonCompleteLabel = "Complete" } = $$props;
  let { regionHeader = "" } = $$props;
  let { regionContent = "" } = $$props;
  let { transitions = !$prefersReducedMotionStore } = $$props;
  let { transitionIn = fade } = $$props;
  let { transitionInParams = { duration: 100 } } = $$props;
  let { transitionOut = fade } = $$props;
  let { transitionOutParams = { duration: 100 } } = $$props;
  let state = writable({ current: start, total: 0 });
  $$unsubscribe_state = subscribe(state, (value) => $state = value);
  async function onNext(locked, stepIndex) {
    await new Promise((resolve) => setTimeout(resolve));
    if (locked)
      return;
    set_store_value(state, $state.current++, $state);
    dispatch("next", { step: stepIndex, state: $state });
    dispatch("step", { step: stepIndex, state: $state });
  }
  function onBack(stepIndex) {
    set_store_value(state, $state.current--, $state);
    dispatch("back", { step: stepIndex, state: $state });
    dispatch("step", { step: stepIndex, state: $state });
  }
  function onComplete(stepIndex) {
    dispatch("complete", { step: stepIndex, state: $state });
  }
  setContext("state", state);
  setContext("stepTerm", stepTerm);
  setContext("gap", gap);
  setContext("justify", justify);
  setContext("onNext", onNext);
  setContext("onBack", onBack);
  setContext("onComplete", onComplete);
  setContext("buttonBack", buttonBack);
  setContext("buttonBackType", buttonBackType);
  setContext("buttonBackLabel", buttonBackLabel);
  setContext("buttonNext", buttonNext);
  setContext("buttonNextType", buttonNextType);
  setContext("buttonNextLabel", buttonNextLabel);
  setContext("buttonComplete", buttonComplete);
  setContext("buttonCompleteType", buttonCompleteType);
  setContext("buttonCompleteLabel", buttonCompleteLabel);
  setContext("transitions", transitions);
  setContext("transitionIn", transitionIn);
  setContext("transitionInParams", transitionInParams);
  setContext("transitionOut", transitionOut);
  setContext("transitionOutParams", transitionOutParams);
  if ($$props.gap === void 0 && $$bindings.gap && gap !== void 0)
    $$bindings.gap(gap);
  if ($$props.stepTerm === void 0 && $$bindings.stepTerm && stepTerm !== void 0)
    $$bindings.stepTerm(stepTerm);
  if ($$props.badge === void 0 && $$bindings.badge && badge !== void 0)
    $$bindings.badge(badge);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  if ($$props.border === void 0 && $$bindings.border && border !== void 0)
    $$bindings.border(border);
  if ($$props.start === void 0 && $$bindings.start && start !== void 0)
    $$bindings.start(start);
  if ($$props.justify === void 0 && $$bindings.justify && justify !== void 0)
    $$bindings.justify(justify);
  if ($$props.buttonBack === void 0 && $$bindings.buttonBack && buttonBack !== void 0)
    $$bindings.buttonBack(buttonBack);
  if ($$props.buttonBackType === void 0 && $$bindings.buttonBackType && buttonBackType !== void 0)
    $$bindings.buttonBackType(buttonBackType);
  if ($$props.buttonBackLabel === void 0 && $$bindings.buttonBackLabel && buttonBackLabel !== void 0)
    $$bindings.buttonBackLabel(buttonBackLabel);
  if ($$props.buttonNext === void 0 && $$bindings.buttonNext && buttonNext !== void 0)
    $$bindings.buttonNext(buttonNext);
  if ($$props.buttonNextType === void 0 && $$bindings.buttonNextType && buttonNextType !== void 0)
    $$bindings.buttonNextType(buttonNextType);
  if ($$props.buttonNextLabel === void 0 && $$bindings.buttonNextLabel && buttonNextLabel !== void 0)
    $$bindings.buttonNextLabel(buttonNextLabel);
  if ($$props.buttonComplete === void 0 && $$bindings.buttonComplete && buttonComplete !== void 0)
    $$bindings.buttonComplete(buttonComplete);
  if ($$props.buttonCompleteType === void 0 && $$bindings.buttonCompleteType && buttonCompleteType !== void 0)
    $$bindings.buttonCompleteType(buttonCompleteType);
  if ($$props.buttonCompleteLabel === void 0 && $$bindings.buttonCompleteLabel && buttonCompleteLabel !== void 0)
    $$bindings.buttonCompleteLabel(buttonCompleteLabel);
  if ($$props.regionHeader === void 0 && $$bindings.regionHeader && regionHeader !== void 0)
    $$bindings.regionHeader(regionHeader);
  if ($$props.regionContent === void 0 && $$bindings.regionContent && regionContent !== void 0)
    $$bindings.regionContent(regionContent);
  if ($$props.transitions === void 0 && $$bindings.transitions && transitions !== void 0)
    $$bindings.transitions(transitions);
  if ($$props.transitionIn === void 0 && $$bindings.transitionIn && transitionIn !== void 0)
    $$bindings.transitionIn(transitionIn);
  if ($$props.transitionInParams === void 0 && $$bindings.transitionInParams && transitionInParams !== void 0)
    $$bindings.transitionInParams(transitionInParams);
  if ($$props.transitionOut === void 0 && $$bindings.transitionOut && transitionOut !== void 0)
    $$bindings.transitionOut(transitionOut);
  if ($$props.transitionOutParams === void 0 && $$bindings.transitionOutParams && transitionOutParams !== void 0)
    $$bindings.transitionOutParams(transitionOutParams);
  isActive = (step) => step === $state.current;
  classesBase = `${cBase$1} ${$$props.class ?? ""}`;
  classesHeader = `${cHeader$1} ${border} ${gap} ${regionHeader}`;
  classesHeaderStep = `${cHeaderStep}`;
  classesBadge = (step) => isActive(step) ? active : badge;
  classesContent = `${cContent$1} ${regionContent}`;
  $$unsubscribe_state();
  $$unsubscribe_prefersReducedMotionStore();
  return `<div class="${"stepper " + escape(classesBase, true)}" data-testid="stepper"> ${$state.total ? `<header class="${"stepper-header " + escape(classesHeader, true)}">${each(Array.from(Array($state.total).keys()), (step) => {
    return `<div class="${[
      "stepper-header-step " + escape(classesHeaderStep, true),
      isActive(step) ? "flex-1" : ""
    ].join(" ").trim()}"><span class="${"badge " + escape(classesBadge(step), true)}">${escape(isActive(step) ? `${stepTerm} ${step + 1}` : step + 1)}</span> </div>`;
  })}</header>` : ``}  <div class="${"stepper-content " + escape(classesContent, true)}">${slots.default ? slots.default({}) : ``}</div></div>`;
});
const cBase = "space-y-4";
const cHeader = "text-2xl font-bold";
const cContent = "space-y-4";
const cNavigation = "flex";
const Step = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classesBase;
  let classesHeader;
  let classesContent;
  let classesNavigation;
  let $$slots = compute_slots(slots);
  let $state, $$unsubscribe_state;
  let { locked = false } = $$props;
  let { regionHeader = "" } = $$props;
  let { regionContent = "" } = $$props;
  let { regionNavigation = "" } = $$props;
  let { state = getContext("state") } = $$props;
  $$unsubscribe_state = subscribe(state, (value) => $state = value);
  let { stepTerm = getContext("stepTerm") } = $$props;
  let { gap = getContext("gap") } = $$props;
  let { justify = getContext("justify") } = $$props;
  let { onNext = getContext("onNext") } = $$props;
  let { onBack = getContext("onBack") } = $$props;
  let { onComplete = getContext("onComplete") } = $$props;
  let { buttonBack = getContext("buttonBack") } = $$props;
  let { buttonBackType = getContext("buttonBackType") } = $$props;
  let { buttonBackLabel = getContext("buttonBackLabel") } = $$props;
  let { buttonNext = getContext("buttonNext") } = $$props;
  let { buttonNextType = getContext("buttonNextType") } = $$props;
  let { buttonNextLabel = getContext("buttonNextLabel") } = $$props;
  let { buttonComplete = getContext("buttonComplete") } = $$props;
  let { buttonCompleteType = getContext("buttonCompleteType") } = $$props;
  let { buttonCompleteLabel = getContext("buttonCompleteLabel") } = $$props;
  let { transitions = getContext("transitions") } = $$props;
  let { transitionIn = getContext("transitionIn") } = $$props;
  let { transitionInParams = getContext("transitionInParams") } = $$props;
  let { transitionOut = getContext("transitionOut") } = $$props;
  let { transitionOutParams = getContext("transitionOutParams") } = $$props;
  const stepIndex = $state.total;
  set_store_value(state, $state.total++, $state);
  onDestroy(() => {
    set_store_value(state, $state.total--, $state);
  });
  if ($$props.locked === void 0 && $$bindings.locked && locked !== void 0)
    $$bindings.locked(locked);
  if ($$props.regionHeader === void 0 && $$bindings.regionHeader && regionHeader !== void 0)
    $$bindings.regionHeader(regionHeader);
  if ($$props.regionContent === void 0 && $$bindings.regionContent && regionContent !== void 0)
    $$bindings.regionContent(regionContent);
  if ($$props.regionNavigation === void 0 && $$bindings.regionNavigation && regionNavigation !== void 0)
    $$bindings.regionNavigation(regionNavigation);
  if ($$props.state === void 0 && $$bindings.state && state !== void 0)
    $$bindings.state(state);
  if ($$props.stepTerm === void 0 && $$bindings.stepTerm && stepTerm !== void 0)
    $$bindings.stepTerm(stepTerm);
  if ($$props.gap === void 0 && $$bindings.gap && gap !== void 0)
    $$bindings.gap(gap);
  if ($$props.justify === void 0 && $$bindings.justify && justify !== void 0)
    $$bindings.justify(justify);
  if ($$props.onNext === void 0 && $$bindings.onNext && onNext !== void 0)
    $$bindings.onNext(onNext);
  if ($$props.onBack === void 0 && $$bindings.onBack && onBack !== void 0)
    $$bindings.onBack(onBack);
  if ($$props.onComplete === void 0 && $$bindings.onComplete && onComplete !== void 0)
    $$bindings.onComplete(onComplete);
  if ($$props.buttonBack === void 0 && $$bindings.buttonBack && buttonBack !== void 0)
    $$bindings.buttonBack(buttonBack);
  if ($$props.buttonBackType === void 0 && $$bindings.buttonBackType && buttonBackType !== void 0)
    $$bindings.buttonBackType(buttonBackType);
  if ($$props.buttonBackLabel === void 0 && $$bindings.buttonBackLabel && buttonBackLabel !== void 0)
    $$bindings.buttonBackLabel(buttonBackLabel);
  if ($$props.buttonNext === void 0 && $$bindings.buttonNext && buttonNext !== void 0)
    $$bindings.buttonNext(buttonNext);
  if ($$props.buttonNextType === void 0 && $$bindings.buttonNextType && buttonNextType !== void 0)
    $$bindings.buttonNextType(buttonNextType);
  if ($$props.buttonNextLabel === void 0 && $$bindings.buttonNextLabel && buttonNextLabel !== void 0)
    $$bindings.buttonNextLabel(buttonNextLabel);
  if ($$props.buttonComplete === void 0 && $$bindings.buttonComplete && buttonComplete !== void 0)
    $$bindings.buttonComplete(buttonComplete);
  if ($$props.buttonCompleteType === void 0 && $$bindings.buttonCompleteType && buttonCompleteType !== void 0)
    $$bindings.buttonCompleteType(buttonCompleteType);
  if ($$props.buttonCompleteLabel === void 0 && $$bindings.buttonCompleteLabel && buttonCompleteLabel !== void 0)
    $$bindings.buttonCompleteLabel(buttonCompleteLabel);
  if ($$props.transitions === void 0 && $$bindings.transitions && transitions !== void 0)
    $$bindings.transitions(transitions);
  if ($$props.transitionIn === void 0 && $$bindings.transitionIn && transitionIn !== void 0)
    $$bindings.transitionIn(transitionIn);
  if ($$props.transitionInParams === void 0 && $$bindings.transitionInParams && transitionInParams !== void 0)
    $$bindings.transitionInParams(transitionInParams);
  if ($$props.transitionOut === void 0 && $$bindings.transitionOut && transitionOut !== void 0)
    $$bindings.transitionOut(transitionOut);
  if ($$props.transitionOutParams === void 0 && $$bindings.transitionOutParams && transitionOutParams !== void 0)
    $$bindings.transitionOutParams(transitionOutParams);
  classesBase = `${cBase} ${$$props.class ?? ""}`;
  classesHeader = `${cHeader} ${regionHeader}`;
  classesContent = `${cContent} ${regionContent}`;
  classesNavigation = `${cNavigation} ${justify} ${gap} ${regionNavigation}`;
  $$unsubscribe_state();
  return `  ${stepIndex === $state.current ? `<div class="${"step " + escape(classesBase, true)}" data-testid="step"> <header class="${"step-header " + escape(classesHeader, true)}">${slots.header ? slots.header({}) : `${escape(stepTerm)} ${escape(stepIndex + 1)}`}</header>  <div class="${"step-content " + escape(classesContent, true)}">${slots.default ? slots.default({}) : `(${escape(stepTerm)} ${escape(stepIndex + 1)} Content)`}</div>  ${$state.total > 1 ? `<div class="${"step-navigation " + escape(classesNavigation, true)}">${stepIndex === 0 && $$slots.navigation ? ` <div class="step-navigation-slot">${slots.navigation ? slots.navigation({}) : ``}</div>` : ` <button${add_attribute("type", buttonBackType, 0)} class="${"btn " + escape(buttonBack, true)}" ${$state.current === 0 ? "disabled" : ""}><!-- HTML_TAG_START -->${buttonBackLabel}<!-- HTML_TAG_END --></button>`} ${stepIndex < $state.total - 1 ? ` <button${add_attribute("type", buttonNextType, 0)} class="${"btn " + escape(buttonNext, true)}" ${locked ? "disabled" : ""}>${locked ? `<svg class="w-3 aspect-square fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"></path></svg>` : ``} <span><!-- HTML_TAG_START -->${buttonNextLabel}<!-- HTML_TAG_END --></span></button>` : ` <button${add_attribute("type", buttonCompleteType, 0)} class="${"btn " + escape(buttonComplete, true)}" ${locked ? "disabled" : ""}><!-- HTML_TAG_START -->${buttonCompleteLabel}<!-- HTML_TAG_END --></button>`}</div>` : ``}</div>` : ``}`;
});
const Minus = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [["path", { "d": "M5 12h14" }]];
  return `${validate_component(Icon$1, "Icon").$$render($$result, Object.assign({}, { name: "minus" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Minus$1 = Minus;
const Network = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "rect",
      {
        "x": "16",
        "y": "16",
        "width": "6",
        "height": "6",
        "rx": "1"
      }
    ],
    [
      "rect",
      {
        "x": "2",
        "y": "16",
        "width": "6",
        "height": "6",
        "rx": "1"
      }
    ],
    [
      "rect",
      {
        "x": "9",
        "y": "2",
        "width": "6",
        "height": "6",
        "rx": "1"
      }
    ],
    [
      "path",
      {
        "d": "M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"
      }
    ],
    ["path", { "d": "M12 12V8" }]
  ];
  return `${validate_component(Icon$1, "Icon").$$render($$result, Object.assign({}, { name: "network" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Network$1 = Network;
const Plug_2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["path", { "d": "M9 2v6" }],
    ["path", { "d": "M15 2v6" }],
    ["path", { "d": "M12 17v5" }],
    ["path", { "d": "M5 8h14" }],
    ["path", { "d": "M6 11V8h12v3a6 6 0 1 1-12 0v0Z" }]
  ];
  return `${validate_component(Icon$1, "Icon").$$render($$result, Object.assign({}, { name: "plug-2" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Plug2 = Plug_2;
const Unplug = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["path", { "d": "m19 5 3-3" }],
    ["path", { "d": "m2 22 3-3" }],
    [
      "path",
      {
        "d": "M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z"
      }
    ],
    ["path", { "d": "M7.5 13.5 10 11" }],
    ["path", { "d": "M10.5 16.5 13 14" }],
    [
      "path",
      {
        "d": "m12 6 6 6 2.3-2.3a2.4 2.4 0 0 0 0-3.4l-2.6-2.6a2.4 2.4 0 0 0-3.4 0Z"
      }
    ]
  ];
  return `${validate_component(Icon$1, "Icon").$$render($$result, Object.assign({}, { name: "unplug" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Unplug$1 = Unplug;
const Alert_triangle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
      }
    ],
    ["path", { "d": "M12 9v4" }],
    ["path", { "d": "M12 17h.01" }]
  ];
  return `${validate_component(Icon$1, "Icon").$$render($$result, Object.assign({}, { name: "alert-triangle" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const AlertTriangle = Alert_triangle;
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let usernameCorrect;
  let passwordCorrect;
  let passwordsEqual;
  let hostnamesOnly;
  let $i18n, $$unsubscribe_i18n;
  $$unsubscribe_i18n = subscribe(i18n, (value) => $i18n = value);
  let { data } = $$props;
  let { form } = $$props;
  let username = "";
  let password1 = "";
  let password2 = "";
  let name = "";
  let host = "";
  let hostnameInput;
  let hostnames = data.detectedHostnames.map((hostname) => ({ hostname, autoDetected: true }));
  page.subscribe((page2) => {
    if (page2.form?.hostname && page2.form?.success && !hostnames.some((h) => h.hostname === page2.form?.hostname)) {
      hostnames = [
        ...hostnames,
        {
          hostname: page2.form.hostname,
          autoDetected: true
        }
      ];
    }
  });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  usernameCorrect = /[a-zA-Z0-9_]{4,31}/.test(username);
  passwordCorrect = password1.length >= 8;
  passwordsEqual = password1 === password2;
  hostnamesOnly = hostnames.map((h) => h.hostname).join(",");
  $$unsubscribe_i18n();
  return `<div class="h-full flex flex-col gap-12 items-center justify-center p-12"><h1 class="h1"><span class="bg-gradient-to-br from-primary-500 to-secondary-500 bg-clip-text text-transparent box-decoration-clone font-bold">${escape($i18n.t("brand.title"))}</span></h1> ${!data.appDataPersistency.isPersistent ? `<aside class="alert variant-filled-warning max-w-[35rem]"><div>${validate_component(AlertTriangle, "AlertTriangle").$$render($$result, {}, {}, {})}</div> <div class="alert-message"><p>${escape($i18n.t("setup.missing-mount", {
    path: data.appDataPersistency.defaultAppDataPath
  }))}</p></div></aside>` : ``} <form method="post" action="?/signup" enctype="multipart/form-data" class="card max-w-[35rem] p-4 overflow-y-auto">${validate_component(Stepper, "Stepper").$$render(
    $$result,
    {
      stepTerm: $i18n.t("setup.step"),
      buttonBackLabel: $i18n.t("setup.back"),
      buttonNextLabel: $i18n.t("setup.next"),
      buttonCompleteLabel: $i18n.t("setup.complete"),
      buttonCompleteType: "submit"
    },
    {},
    {
      default: () => {
        return `${validate_component(Step, "Step").$$render(
          $$result,
          {
            locked: !usernameCorrect || !passwordCorrect || !passwordsEqual
          },
          {},
          {
            navigation: () => {
              return `${escape("")}`;
            },
            header: () => {
              return `${escape($i18n.t("setup.welcome"))}`;
            },
            default: () => {
              return `<p>${escape($i18n.t("setup.get-started-account"))}</p> <div class="space-y-4"><label class="label"><span>${escape($i18n.t("setup.username"))}</span> <input class="${"input " + escape(
                form?.username || usernameCorrect === false && username.length > 0 ? "[&:not(:focus)]:input-error" : "",
                true
              )}" type="text" required${add_attribute("placeholder", $i18n.t("setup.username"), 0)}${add_attribute("value", username, 0)}> <span class="text-sm text-surface-600-300-token">${escape($i18n.t("setup.username-requirements"))}</span></label> <label class="label"><span>${escape($i18n.t("setup.password"))}</span> <input class="${"input " + escape(
                form?.password || passwordCorrect === false && password1.length > 0 ? "[&:not(:focus)]:input-error" : "",
                true
              )}" type="password" required${add_attribute("placeholder", $i18n.t("setup.password"), 0)}${add_attribute("value", password1, 0)}> <span class="text-sm text-surface-600-300-token">${escape($i18n.t("setup.password-requirements"))}</span></label> <label class="label"><span>${escape($i18n.t("setup.repeat-password"))}</span> <input class="${"input " + escape(
                passwordsEqual === false && password2.length > 0 ? "[&:not(:focus)]:input-error" : "",
                true
              )}" type="password" required${add_attribute("placeholder", $i18n.t("setup.password"), 0)}${add_attribute("value", password2, 0)}></label></div> `;
            }
          }
        )} ${validate_component(Step, "Step").$$render(
          $$result,
          {
            locked: !form?.success || name?.length === 0
          },
          {},
          {
            header: () => {
              return `${escape($i18n.t("setup.connect-container-engine"))}`;
            },
            default: () => {
              return `<p>${escape($i18n.t("setup.container-engine-explanation"))}</p> ${validate_component(Accordion, "Accordion").$$render(
                $$result,
                {
                  autocollapse: true,
                  class: "bg-surface-200-700-token rounded-container-token"
                },
                {},
                {
                  default: () => {
                    return `${validate_component(AccordionItem, "AccordionItem").$$render($$result, { open: true }, {}, {
                      content: () => {
                        return `<div class="space-y-2"><label class="label"><span>${escape($i18n.t("setup.container-engine-name"))}</span> <input class="input" type="text" name="name" required${add_attribute("placeholder", $i18n.t("setup.container-engine-name-placeholder"), 0)}${add_attribute("value", name, 0)}></label> ${validate_component(Accordion, "Accordion").$$render($$result, {}, {}, {
                          default: () => {
                            return `${validate_component(AccordionItem, "AccordionItem").$$render($$result, {}, {}, {
                              content: () => {
                                return `<label class="label"><span>${escape($i18n.t("setup.override-socket"))}</span> <input class="input" type="text" name="socketPath"${add_attribute("placeholder", $i18n.t("setup.override-socket-placeholder"), 0)}></label> `;
                              },
                              summary: () => {
                                return `${escape($i18n.t("setup.more-settings"))}`;
                              }
                            })}`;
                          }
                        })}  <div class="flex gap-4 items-center"><button type="submit" formaction="?/connectLocal" class="btn variant-filled-secondary">${`<span>${validate_component(Unplug$1, "Unplug").$$render($$result, {}, {}, {})}</span> <span>${escape($i18n.t("setup.test-connection"))}</span>`}</button> ${form?.type === "local" && form?.error ? `<div class="text-error-500-400-token text-sm font-semibold">${escape(form.error)}</div>` : `${form?.type === "local" && form?.success ? `<div class="text-success-800-100-token text-sm font-semibold">${escape($i18n.t("setup.successfully-connected"))}</div>` : ``}`}</div> ${form?.type === "local" && (form?.error?.includes("/var/run/docker.sock") || form?.error?.includes("//./pipe/docker_engine")) ? `<span class="badge variant-filled-warning">${escape($i18n.t("setup.note"))}</span> <span class="grow text-sm">${escape($i18n.t("setup.note-mounted-docker-socket"))}</span>` : ``}</div> `;
                      },
                      summary: () => {
                        return `${escape($i18n.t("setup.local-container-engine"))} `;
                      },
                      lead: () => {
                        return `${validate_component(Plug2, "Plug2").$$render($$result, {}, {}, {})}`;
                      }
                    })} ${validate_component(AccordionItem, "AccordionItem").$$render($$result, {}, {}, {
                      content: () => {
                        return `<div class="space-y-2 mb-2"><label class="label"><span>${escape($i18n.t("setup.container-engine-name"))}</span> <input class="input" type="text" name="name" required${add_attribute("placeholder", $i18n.t("setup.container-engine-name-placeholder"), 0)}${add_attribute("value", name, 0)}></label> <label class="label"><span>${escape($i18n.t("setup.container-engine-api-url"))}</span> <input class="input" type="text" name="host" required${add_attribute("placeholder", $i18n.t("setup.container-engine-api-url-placeholder"), 0)}${add_attribute("value", host, 0)}></label> ${validate_component(Accordion, "Accordion").$$render($$result, {}, {}, {
                          default: () => {
                            return `${validate_component(AccordionItem, "AccordionItem").$$render($$result, {}, {}, {
                              content: () => {
                                return `<label class="label"><span>${escape($i18n.t("setup.tls-ca-certificate"))}</span> <input class="input" type="file" name="ca"></label> <label class="label"><span>${escape($i18n.t("setup.tls-certificate"))}</span> <input class="input" type="file" name="cert"></label> <label class="label"><span>${escape($i18n.t("setup.tls-key"))}</span> <input class="input" type="file" name="key"></label> `;
                              },
                              summary: () => {
                                return `${escape($i18n.t("setup.more-settings"))}`;
                              }
                            })}`;
                          }
                        })} <div class="flex gap-4 items-center"><button type="submit" formaction="?/connectRemote" class="btn variant-filled-secondary" ${"disabled"}>${`<span>${validate_component(Unplug$1, "Unplug").$$render($$result, {}, {}, {})}</span> <span>${escape($i18n.t("setup.test-connection"))}</span>`}</button> ${form?.type === "remote" && form?.error ? `<div class="text-error-500-400-token text-sm font-semibold">${escape(form.error)}</div>` : `${form?.type === "remote" && form?.success ? `<div class="text-success-800-100-token text-sm font-semibold">${escape($i18n.t("setup.successfully-connected"))}</div>` : ``}`}</div></div> `;
                      },
                      summary: () => {
                        return `${escape($i18n.t("setup.remote-container-engine"))} `;
                      },
                      lead: () => {
                        return `${validate_component(Network$1, "Network").$$render($$result, {}, {}, {})}`;
                      }
                    })}`;
                  }
                }
              )} <span class="badge variant-filled">${escape($i18n.t("setup.tip"))}</span> <span class="grow text-sm">${escape($i18n.t("setup.additional-container-engines"))}</span>`;
            }
          }
        )} ${validate_component(Step, "Step").$$render($$result, {}, {}, {
          header: () => {
            return `${escape($i18n.t("setup.add-domains-and-hostnames"))}`;
          },
          default: () => {
            return ` <input type="hidden" name="username"${add_attribute("value", username, 0)}> <input type="hidden" name="password"${add_attribute("value", password1, 0)}> <input type="hidden" name="language"${add_attribute("value", $i18n.language, 0)}> <input type="hidden" name="hostnames"${add_attribute("value", hostnamesOnly, 0)}> <ul class="list">${each(hostnames, ({ hostname, autoDetected }) => {
              return `<li><code class="code text-base">${escape(hostname)}</code> ${autoDetected ? `<span class="badge variant-filled">${escape($i18n.t("setup.auto-detected"))}</span>` : ``} <span class="flex-auto"></span> <button type="button" class="btn btn-sm variant-filled-error">${validate_component(Minus$1, "Minus").$$render($$result, {}, {}, {})}</button> </li>`;
            })}</ul> <div><p>${escape($i18n.t("setup.add-domain-or-hostname"))}</p> <div class="input-group input-group-divider grid-cols-[1fr_auto]"><input type="text"${add_attribute("placeholder", $i18n.t("setup.domain-hostname-placeholder"), 0)}${add_attribute("value", hostnameInput, 0)}> <button type="button" class="variant-filled-secondary">${validate_component(Plus$1, "Plus").$$render($$result, {}, {}, {})}</button></div></div> <span class="badge variant-filled">${escape($i18n.t("setup.tip"))}</span> <span class="grow text-sm">${escape($i18n.t("setup.additional-domains-or-hostnames"))}</span>`;
          }
        })}`;
      }
    }
  )}</form></div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-5DndqIII.js.map
