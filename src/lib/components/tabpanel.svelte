<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import type { TabsContext } from './tabs.svelte';

	const { registerPanel, activePanel } = getContext<TabsContext>('tabs');

	let self: HTMLElement;

	$: isActive = $activePanel === self;
	
	onMount(() => {
		registerPanel(self);
	});
</script>

<div bind:this={self}>
	{#if isActive}
		<slot />
	{/if}
</div>
