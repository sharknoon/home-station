<script lang="ts">
	import { HardDrive, LayoutGrid, Settings, Sparkles } from 'lucide-svelte';
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';
	import SearchBar from '$lib/components/searchbar.svelte';
	import Alert from '$lib/components/alert.svelte';
	import Code from '$lib/components/code.svelte';

	export let data: LayoutData;

	const sidebarItems = [
		{
			icon: LayoutGrid,
			text: 'My Apps',
			href: '/'
		},
		{
			icon: Sparkles,
			text: 'Discover',
			href: '/discover'
		},
		{
			icon: Settings,
			text: 'Settings',
			href: '/settings'
		}
	];
</script>

<div
	class="fixed top-0 left-0 bottom-0 w-64 flex flex-col gap-4 bg-gradient-to-b from-slate-800 to-slate-900 text-gray-100 p-4 border-r border-gray-700"
>
	{#each sidebarItems as item}
		<a
			href={item.href}
			class="rounded-lg p-2 flex gap-2 items-center transition duration-150 ease-in-out focus:outline-none {item.href ===
			$page.url.pathname
				? 'bg-gradient-to-br from-emerald-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500'
				: 'hover:bg-gray-700 focus:bg-gray-700'}"
		>
			<svelte:component this={item.icon} />{item.text}
		</a>
	{/each}
	<div class="grow"></div>
	<button
		class="border border-gray-700 bg-gray-900 rounded-lg hover:bg-gray-800 transition p-2 flex items-center gap-2"
	>
		<HardDrive />
		<div class="text-left">
			<div class="text-xs font-bold leading-3">Home Station</div>
			<!-- svelte-ignore missing-declaration -->
			<code class="text-xs leading-3">{NPM_PACKAGE_VERSION}</code>
		</div>
	</button>
</div>
<div class="ml-64 bg-gray-900 text-gray-100 h-full p-4 flex flex-col gap-4">
	{#if !data.dataVolumeMounted}
		<Alert variant="warning">
			<p>
				The <Code>{data.appDataPath}</Code> volume was not configured property. All data will be cleared when
				the container is stopped or restarted.
			</p>
		</Alert>
	{/if}
	<SearchBar placeholder="Search for apps" />
	<slot />
</div>
