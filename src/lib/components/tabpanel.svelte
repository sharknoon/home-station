<script lang="ts" context="module">
	let id = 0;
</script>

<script lang="ts">
	import { getContext } from 'svelte';
	import type { TabsContext } from './tabs.svelte';

	const { idPrefix, registerPanel, activePanel } = getContext<TabsContext>('tabs');

	let self = `${idPrefix}p${id++}`;

	$: isActive = $activePanel === self;

	registerPanel(self);
</script>

<div id={self}>
	{#if isActive}
		<slot />
	{/if}
</div>
