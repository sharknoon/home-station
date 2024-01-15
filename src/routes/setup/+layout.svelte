<script lang="ts">
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';
	import i18n from '$lib/i18n';

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

<div class="absolute inset-0 flex flex-col gap-12 justify-center items-center p-12">
	<h1 class="h1 leading-8">
		<span
			class="bg-gradient-to-br from-primary-500 to-secondary-500 bg-clip-text text-transparent box-decoration-clone font-bold"
		>
			{$i18n.t('brand.title')}
		</span>
	</h1>

	<div class="card p-4">
		<slot />
	</div>
</div>
