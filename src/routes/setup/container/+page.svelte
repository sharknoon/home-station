<script lang="ts">
	import { Network, Plug2, Unplug } from 'lucide-svelte';
	import type { PageData } from './$types';
	import Button from '$lib/components/button.svelte';
	import Code from '$lib/components/code.svelte';
	import Tabs from '$lib/components/tabs.svelte';
	import TabList from '$lib/components/tablist.svelte';
	import Tab from '$lib/components/tab.svelte';
	import TabPanel from '$lib/components/tabpanel.svelte';

	export let data: PageData;
</script>

<div class="p-4">
	<div class="flex gap-2 items-center">
		<Plug2 class="h-6 w-6" />
		<h1 class="text-xl font-bold">Local Docker Engine</h1>
	</div>
	<div class="text-gray-400 text-sm mb-4">Connect to Docker via Socket</div>
	<Button variant="secondary"><Unplug /> Connect</Button>
	<Tabs>
		<TabList>
			<Tab>Docker CLI</Tab>
			<Tab>Docker Compose</Tab>
		</TabList>
		<TabPanel>
			<Code>-v "/var/run/docker.sock:/var/run/docker.sock"</Code>
		</TabPanel>
		<TabPanel>
			<pre><Code>volumes:<br />  - /var/run/docker.sock:/var/run/docker.sock</Code></pre>
		</TabPanel>
	</Tabs>

	<hr class="border-gray-600 my-4" />

	<div class="flex gap-2 items-center">
		<Network class="h-6 w-6" />
		<h1 class="text-xl font-bold">Remote Docker Engine</h1>
	</div>
	<span class="text-gray-400 text-sm">Connect to Docker via API</span>
</div>
