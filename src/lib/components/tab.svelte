<script lang="ts" context="module">
	let id = 0;
</script>

<script lang="ts">
	import { getContext } from 'svelte';
	import type { TabsContext } from './tabs.svelte';

	const { idPrefix, registerTab, selectTab, activeTab } = getContext<TabsContext>('tabs');

	let self = `${idPrefix}t${id++}`;

	$: isActive = $activeTab === self;

	registerTab(self);
</script>

<button id={self} on:click={() => selectTab(self)} class="relative group px-2 py-4">
	<div
		class="text-sm font-semibold transition {isActive
			? 'text-emerald-700'
			: 'text-gray-400 group-hover:text-gray-200'}"
	>
		<slot />
	</div>
	<div
		class="absolute bottom-0 left-0 right-0 border border-gray-400 opacity-0 transition {isActive
			? ''
			: 'group-hover:opacity-100'}"
	></div>
</button>
