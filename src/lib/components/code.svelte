<script lang="ts">
	import { Copy } from 'lucide-svelte';

	export let copy = true;

    let code: HTMLElement;
</script>

<div class="bg-gray-800 rounded p-2 border border-gray-600 flex justify-between gap-2">
	<code bind:this={code} class="ml-2"><slot /></code>
	{#if copy}
		<button
			class="text-gray-400 hover:text-gray-200 transition"
			on:click={() => navigator.clipboard.writeText(code.innerText)}
		>
			<Copy />
		</button>
	{/if}
</div>
