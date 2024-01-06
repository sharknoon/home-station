<script lang="ts" context="module">
	export type TabsContext = {
		idPrefix: string;
		activeTab: Readable<string>;
		activePanel: Readable<string>;
		registerTab: (tab: string) => void;
		registerPanel: (panel: string) => void;
		selectTab: (tab: string) => void;
	};
</script>

<script lang="ts">
	import { setContext } from 'svelte';
	import { derived, writable, type Readable } from 'svelte/store';

	// Random ID prefix to avoid collisions
	let idPrefix = Math.random().toString(36).substring(2, 7);

	let tabs = writable<string[]>([]);
	let panels = writable<string[]>([]);

	let activeIndex = writable(0);
	let activeTab = derived([activeIndex, tabs], ([$activeIndex, $tabs]) => $tabs[$activeIndex]);
	let activePanel = derived(
		[activeIndex, panels],
		([$activeIndex, $panels]) => $panels[$activeIndex]
	);

	setContext<TabsContext>('tabs', {
		idPrefix,
		activeTab,
		activePanel,
		registerTab: (tab: string) => {
			tabs.update((t) => [...t, tab]);
		},
		registerPanel: (panel: string) => {
			panels.update((p) => [...p, panel]);
		},
		selectTab: (tab: string) => {
			activeIndex.set($tabs.indexOf(tab));
		}
	});
</script>

<slot />
