<script lang="ts" context="module">
	let id = 0;
</script>

<script lang="ts">
	import { getContext } from 'svelte';
	import type { AccordionContext } from './accordion.svelte';
	import { ChevronDown } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	const { idPrefix, registerItem, selectItem, activeItem, firstItem, lastItem } =
		getContext<AccordionContext>('accordion');

	let self = `${idPrefix}${id++}`;

	$: isActive = $activeItem === self;
	$: isFirst = $firstItem === self;
	$: isLast = $lastItem === self;

	registerItem(self);
</script>

<div id={self} class={!isLast && !isActive ? 'border-b border-gray-600' : ''}>
	<button
		class="bg-slate-900 w-full text-left relative {isFirst ? 'rounded-t-lg' : ''} {isLast &&
		!isActive
			? 'rounded-b-lg'
			: ''} p-2"
		on:click={() => selectItem(self)}
	>
		<slot name="header" />
		<ChevronDown
			class="absolute w-6 h-6 right-4 top-1/2 -translate-y-1/2 bottom-0 transition {isActive
				? '-rotate-180'
				: ''}"
		></ChevronDown>
	</button>
    {#if isActive}
	<div class="bg-black/20 transition-all {isLast && isActive ? 'rounded-b-lg' : ''}" transition:slide>
		<div class="p-2">
			<slot name="body" />
		</div>
	</div>
    {/if}
</div>
