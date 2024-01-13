<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

{#each data.apps as app}
	<a href="/app/{app.appId}">
		<img src={app.icon} alt="icon" />
		<h1>{app.name}</h1>
		<p>{app.description}</p>
	</a>
{/each}
<!-- sort by creation time newest to oldest -->
<h1>Recently Added</h1>
<!-- sort by fastest grow this week -->
<h1>Trends</h1>
<!-- sort by most downloads this week -->
<h1>Charts</h1>
<!-- adblocker, Media, etc... -->
<h1>Categories</h1>
