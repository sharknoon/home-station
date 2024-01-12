<script lang="ts">
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';
	import Box from '$lib/components/box.svelte';
	import Stepper from '$lib/components/stepper.svelte';
	import Alert from '$lib/components/alert.svelte';
	import Code from '$lib/components/code.svelte';

	export let data: LayoutData;

	let steps = [
		{
			title: 'Create Account',
			path: '/setup/signup'
		},
		{
			title: 'Connect to Container Engine',
			path: '/setup/container'
		},
		{
			title: 'Migrate Services',
			path: '/setup/finish'
		}
	];
	$: currentStep = steps.findIndex((step) => step.path === $page.url.pathname);
</script>

<div class="bg-[url('/wallpapers/background.jpg')] bg-cover bg-center bg-no-repeat h-full">
	<div class="absolute inset-0 bg-gradient-to-b from-slate-800/50 to-slate-900"></div>
</div>
<div class="absolute inset-0 flex flex-col gap-4 justify-center items-center p-12">
	<img src="/logo.png" alt="logo" class="h-20 w-20" />
	<h1>Home Station</h1>
	<div class="max-w-4xl w-full">
		{#if !data.dataVolumeMounted}
			<Alert variant="warning">
				<p>
					The <Code>{data.appDataPath}</Code> volume was not configured property. All data will be cleared when
					the container is stopped or restarted.
				</p>
			</Alert>
		{/if}
	</div>
	<Stepper {steps} {currentStep} />
	<Box>
		<slot />
	</Box>
</div>
