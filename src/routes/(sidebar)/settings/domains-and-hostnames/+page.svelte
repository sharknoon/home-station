<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

{#each data.domainsAndHostnames as host}
	{host.host}
{/each}
