<script lang="ts" context="module">
	export type AccordionContext = {
		idPrefix: string;
		activeItem: Readable<string>;
		firstItem: Readable<string>;
		lastItem: Readable<string>;
		registerItem: (id: string) => void;
		selectItem: (id: string) => void;
	};
</script>

<script lang="ts">
	import { setContext } from 'svelte';
	import { derived, writable, type Readable } from 'svelte/store';

	// Random ID prefix to avoid collisions
	let idPrefix = Math.random().toString(36).substring(2, 7);

	let items = writable<string[]>([]);

	let activeIndex = writable(0);
	let activeItem = derived([activeIndex, items], ([$activeIndex, $items]) => $items[$activeIndex]);
	let firstItem = derived(items, ($items) => $items[0]);
	let lastItem = derived(items, ($items) => $items[$items.length - 1]);

	setContext<AccordionContext>('accordion', {
		idPrefix,
		activeItem,
		firstItem,
		lastItem,
		registerItem: (item: string) => {
			items.update((items) => [...items, item]);
		},
		selectItem: (item: string) => {
			activeIndex.set($items.indexOf(item));
		}
	});
</script>

<slot />
