<script lang="ts">
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
	{#if type === 'file'}
		<input
			{type}
			{name}
			{id}
			{required}
			{placeholder}
			class="h-10 file:rounded file:px-4 file:py-2 file:border file:text-sm file:font-semibold file:hover:brightness-125
			 file:transition file:disabled:opacity-50 file:bg-emerald-700 file:border-emerald-600
			 file:active:border-emerald-800 file:text-gray-300"
		/>
	{:else}
		<input
			{type}
			{name}
			{id}
			{required}
			{placeholder}
			class="border border-gray-400 rounded bg-gray-600 h-10"
		/>
	{/if}
</div>
