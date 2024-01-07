<script lang="ts">
	import { enhance } from '$app/forms';
	import { Network, Plug2, Unplug } from 'lucide-svelte';
	import Button from '$lib/components/button.svelte';
	import Code from '$lib/components/code.svelte';
	import Tabs from '$lib/components/tabs.svelte';
	import TabList from '$lib/components/tablist.svelte';
	import Tab from '$lib/components/tab.svelte';
	import TabPanel from '$lib/components/tabpanel.svelte';
	import Accordion from '$lib/components/accordion.svelte';
	import AccordionItem from '$lib/components/accordionitem.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<div class="p-4">
	<h1 class="text-xl font-bold text-center mb-2">Connect your Docker engine</h1>
	<div class="text-sm font-semibold text-center mb-2">
		You can either use your local Docker installation or connect to a remote one
	</div>
	<Accordion>
		<AccordionItem>
			<div slot="header">
				<div class="flex gap-2 items-center">
					<Plug2 class="h-6 w-6" />
					<h1 class="text-xl font-bold">Local Docker Engine</h1>
				</div>
				<div class="text-gray-400 text-sm">Connect to Docker via Socket</div>
			</div>
			<form method="post" action="?/connectLocally" slot="body" use:enhance>
				<div class="flex gap-2 items-center">
					<Button type="submit" variant="secondary"><Unplug /> Connect</Button>
					{#if form?.error}
						<div class="text-red-500 text-sm font-semibold">{form.error}</div>
					{:else if form?.success}
						<div class="text-green-500 text-sm font-semibold">Successfully connected 🎉</div>
					{/if}
				</div>
				<Tabs>
					<TabList>
						<Tab>Docker CLI</Tab>
						<Tab>Docker Compose</Tab>
					</TabList>
					<TabPanel>
						<Code>-v "/var/run/docker.sock:/var/run/docker.sock"</Code>
					</TabPanel>
					<TabPanel>
						<pre><Code>    volumes:<br />      - /var/run/docker.sock:/var/run/docker.sock</Code
							></pre>
					</TabPanel>
				</Tabs>
			</form>
		</AccordionItem>
		<AccordionItem>
			<div slot="header">
				<div class="flex gap-2 items-center">
					<Network class="h-6 w-6" />
					<h1 class="text-xl font-bold">Remote Docker Engine</h1>
				</div>
				<span class="text-gray-400 text-sm">Connect to Docker via API</span>
			</div>
			<div slot="body">TODO</div>
		</AccordionItem>
	</Accordion>
</div>
