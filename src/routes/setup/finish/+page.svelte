<script lang="ts">
	import type { PageData } from './$types';
	import Button from '$lib/components/button.svelte';

	export let data: PageData;
</script>

Domains: {data.detectedDomains}
<br />
Version: {data.version}
<br />
Containers: {data.containers}
<br />
Images: {data.images}
<br />
Volumes: {data.volumes}

<form action="?/proceed" method="post">
	<Button type="submit">Continue</Button>
</form>
