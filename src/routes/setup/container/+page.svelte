<script lang="ts">
	import { enhance } from '$app/forms';
	import { Network, Plug2, RefreshCcw, Unplug } from 'lucide-svelte';
	import Button from '$lib/components/button.svelte';
	import Accordion from '$lib/components/accordion.svelte';
	import AccordionItem from '$lib/components/accordionitem.svelte';
	import type { ActionData } from './$types';
	import Input from '$lib/components/input.svelte';
	import Collapse from '$lib/components/collapse.svelte';
	import Pill from '$lib/components/pill.svelte';

	export let form: ActionData;

	$: connecting = false;
</script>

<div class="p-4">
	<h1 class="text-xl font-bold text-center mb-1">Connect your container engine</h1>
	<div class="text-sm font-semibold text-center mb-4">
		Docker and Podman are supported. Please add your container engine below.
	</div>
	<Accordion>
		<AccordionItem>
			<div class="flex gap-2 items-center" slot="header">
				<Plug2 class="h-4 w-4" />
				<div class="text-sm">Local container engine (socket)</div>
			</div>
			<form
				method="post"
				action="?/connectLocal"
				slot="body"
				use:enhance={() => {
					const timeout = setTimeout(() => (connecting = true), 100);
					return async ({ update }) => {
						clearTimeout(timeout);
						connecting = false;
						update();
					};
				}}
			>
				<Input name="name" label="Name" required placeholder="e.g. docker-prod01"></Input>
				<div class="mt-2">
					<Collapse>
						<span slot="header">More settings</span>
						<div slot="body">
							<Input
								name="socketPath"
								label="Override default socket path"
								placeholder="e.g. /var/run/docker.sock (on Linux) or //./pipe/docker_engine (on Windows)"
							></Input>
						</div>
					</Collapse>
				</div>
				<div class="flex gap-4 items-center mt-4">
					<Button type="submit" variant="secondary">
						{#if !connecting}
							<Unplug />
							Connect
						{:else}
							<RefreshCcw class="animate-spin" />
							Connecting...
						{/if}
					</Button>
					{#if form?.type === 'local' && form?.error}
						<div class="text-red-500 text-sm font-semibold">{form.error}</div>
					{:else if form?.type === 'local' && form?.success}
						<div class="text-green-500 text-sm font-semibold">Successfully connected 🎉</div>
					{/if}
				</div>
			</form>
		</AccordionItem>
		<AccordionItem>
			<div class="flex gap-2 items-center" slot="header">
				<Network class="h-4 w-4" />
				<div class="text-sm">Remote container engine (API)</div>
			</div>
			<form
				enctype="multipart/form-data"
				method="post"
				action="?/connectRemote"
				slot="body"
				use:enhance={() => {
					const timeout = setTimeout(() => (connecting = true), 100);
					return async ({ update }) => {
						clearTimeout(timeout);
						connecting = false;
						update();
					};
				}}
			>
				<Input name="name" label="Name" required placeholder="e.g. docker-prod01"></Input>
				<div class="my-4"></div>
				<Input
					name="host"
					label="Docker API URL"
					required
					placeholder="e.g. 10.0.0.10:2375 or mydocker.mydomain.com:2375"
				></Input>
				<div class="mt-2">
					<Collapse>
						<span slot="header">More settings</span>
						<div slot="body">
							<Input name="ca" type="file" label="TLS CA certificate"></Input>
							<Input name="cert" type="file" label="TLS certificate"></Input>
							<Input name="key" type="file" label="TLS key"></Input>
						</div>
					</Collapse>
				</div>
				<div class="flex gap-4 items-center mt-4">
					<Button type="submit" variant="secondary">
						{#if !connecting}
							<Unplug />
							Connect
						{:else}
							<RefreshCcw class="animate-spin" />
							Connecting...
						{/if}
					</Button>
					{#if form?.type === 'remote' && form?.error}
						<div class="text-red-500 text-sm font-semibold">{form.error}</div>
					{:else if form?.type === 'remote' && form?.success}
						<div class="text-green-500 text-sm font-semibold">Successfully connected 🎉</div>
					{/if}
				</div>
			</form>
		</AccordionItem>
	</Accordion>
	<form method="post" action="?/proceed" class=" flex items-center gap-2 mt-4" use:enhance>
		<input type="hidden" name="type" value="local" />
		{#if form?.containerEngine && form?.missing}
			<span class="text-red-600 text-sm">
				Please connect to a container engine first before proceeding.
			</span>
		{/if}
		<Pill variant="secondary">Tip</Pill>
		<span class="grow text-sm">You can add additional container engines in the settings</span>
		<Button type="submit" disabled={!form?.success}>Continue</Button>
	</form>
</div>
