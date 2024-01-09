<script lang="ts">
	import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-svelte';

	export let variant: 'error' | 'success' | 'warning' | 'info' = 'error';

	let styles = {
		error: 'bg-red-400/20 border-red-500 text-red-100',
		success: 'bg-green-400/20 border-green-500 text-green-100',
		warning: 'bg-yellow-400/20 border-yellow-500 text-yellow-100',
		info: 'bg-blue-400/20 border-blue-500 text-blue-100'
	};
</script>

<div class="rounded backdrop-blur border p-4 flex gap-3 text-sm {styles[variant]}">
	{#if variant === 'error'}
		<XCircle class="h-5 w-5" />
	{:else if variant === 'success'}
		<CheckCircle2 class="h-5 w-5" />
	{:else if variant === 'warning'}
		<AlertTriangle class="h-5 w-5" />
	{:else if variant === 'info'}
		<Info class="h-5 w-5" />
	{/if}
    <div>
        <slot />
    </div>
</div>
