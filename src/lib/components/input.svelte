<script lang="ts">
	import { onMount } from 'svelte';
	import type { HTMLInputTypeAttribute } from 'svelte/elements';

	export let label: string | null | undefined = undefined;
	export let type: HTMLInputTypeAttribute = 'text';
	export let name: string | null | undefined;
	export let id: string | undefined | null = undefined;
	export let required: boolean = false;
	export let placeholder: string | null | undefined = label;
</script>

<div class="flex flex-col gap-1 text-left">
	{#if label}
		<label for={id} class="font-semibold text-gray-300 text-sm">{label}</label>
	{/if}
	<input
		{type}
		{name}
		{id}
		{required}
		{placeholder}
		class="border border-gray-400 rounded bg-gray-600 h-10"
	/>
</div>
