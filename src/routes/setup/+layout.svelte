<script lang="ts">
	import { page } from '$app/stores';
	import Box from '$lib/components/box.svelte';
	import Stepper from '$lib/components/stepper.svelte';

	let steps = [
		{
			title: 'Create Account',
			path: '/setup/signup'
		},
		{
			title: 'Connect Container Engine',
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
<div class="absolute inset-0 flex flex-col gap-2 justify-center items-center py-12">
	<img src="/logo.png" alt="logo" class="h-20 w-20" />
	<h1>Home Station</h1>
	<Stepper {steps} {currentStep} />
	<Box>
		<slot />
	</Box>
</div>
