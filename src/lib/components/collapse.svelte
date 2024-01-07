<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	let collapsed = true;
</script>

<button type="button" class="flex gap-2 items-center" on:click={() => (collapsed = !collapsed)}>
	<ChevronRight class="h-4 w-4 transition duration-[400ms] {!collapsed ? 'rotate-90' : ''}" />
	<slot name="header" />
</button>
{#if !collapsed}
	<div class="pt-2" transition:slide={{ duration: 400 }}>
		<slot name="body" />
	</div>
{/if}
