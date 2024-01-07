<script lang="ts">
	export let type: 'submit' | 'reset' | 'button' | undefined | null = 'button';
	export let variant: 'primary' | 'secondary' = 'primary';
	export let disabled: boolean | null | undefined = undefined;

	let styles = {
		primary: 'bg-emerald-700 border-emerald-600 active:border-emerald-800',
		secondary: 'bg-gray-800 border-gray-600 active:border-gray-800'
	};
</script>

<button
	class="rounded px-4 py-2 border text-sm font-semibold hover:brightness-125 transition flex gap-2 items-center disabled:opacity-50 {styles[
		variant
	]}"
	{type}
	{disabled}
>
	<slot />
</button>
