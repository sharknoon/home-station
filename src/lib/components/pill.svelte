<script lang="ts">
	export let variant: 'primary' | 'secondary' = 'primary';

	let styles = {
		primary: 'bg-emerald-700 border-emerald-500',
		secondary: 'bg-gray-800 border-gray-600'
	};
</script>

<div
	class="rounded-full px-2 leading-5 border py-[.1rem] text-sm font-semibold w-fit {styles[
		variant
	]}"
>
	<slot />
</div>
