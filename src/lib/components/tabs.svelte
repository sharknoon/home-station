<script lang="ts" context="module">
	export type TabsContext = {
		activeTab: Readable<HTMLElement>;
		activePanel: Readable<HTMLElement>;
		registerTab: (tab: HTMLElement) => void;
		registerPanel: (panel: HTMLElement) => void;
		selectTab: (tab: HTMLElement) => void;
	};
</script>

<script lang="ts">
	import { setContext } from 'svelte';
	import { derived, writable, type Readable } from 'svelte/store';

	let tabs = writable<HTMLElement[]>([]);
	let panels = writable<HTMLElement[]>([]);

	let activeIndex = writable(0);
	let activeTab = derived([activeIndex, tabs], ([$activeIndex, $tabs]) => $tabs[$activeIndex]);
	let activePanel = derived(
		[activeIndex, panels],
		([$activeIndex, $panels]) => $panels[$activeIndex]
	);

	setContext<TabsContext>('tabs', {
		activeTab,
		activePanel,
		registerTab: (tab: HTMLElement) => {
			tabs.update((t) => [...t, tab]);
		},
		registerPanel: (panel: HTMLElement) => {
			panels.update((p) => [...p, panel]);
		},
		selectTab: (tab: HTMLElement) => {
			activeIndex.set($tabs.indexOf(tab));
		}
	});
</script>

<slot />
