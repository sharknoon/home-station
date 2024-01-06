<script lang="ts">
	export let type: 'submit' | 'reset' | 'button' | undefined | null = 'button';
	export let variant: 'primary' | 'secondary' = 'primary';
</script>

<button
	class="rounded px-4 py-2 border text-sm font-semibold hover:brightness-125 transition flex gap-2 items-center {variant ===
	'primary'
		? 'bg-emerald-700 border-emerald-600'
		: 'bg-gray-800 border-gray-600'}"
	{type}
>
	<slot />
</button>
