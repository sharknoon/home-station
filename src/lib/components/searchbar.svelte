<script>
	import { Search } from 'lucide-svelte';

	export let placeholder = 'Search...';
</script>

<div class="relative text-gray-100">
	<input
		type="text"
		name="search"
		class="border-gray-600 rounded-full pl-12 bg-gray-900 w-full hover:border-gray-500 focus:border-gray-500 placeholder-gray-300 focus:outline-none focus:ring-0"
		{placeholder}
	/>
	<Search class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" />
</div>
