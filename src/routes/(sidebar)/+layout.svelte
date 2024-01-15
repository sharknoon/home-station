<script lang="ts">
	import { LayoutGrid, Settings, Sparkles, ChevronDown, LogOut, Search } from 'lucide-svelte';
	import Brand from '$lib/components/brand.svelte';
	import type { LayoutData } from './$types';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import {
		AppShell,
		AppBar,
		Autocomplete,
		popup,
		type AutocompleteOption,
		type PopupSettings,
		AppRailAnchor,
		AppRail,
		getToastStore,
		AppRailTile
	} from '@skeletonlabs/skeleton';
	import type { SvelteComponent } from 'svelte';
	import { goto } from '$app/navigation';
	import { slide } from 'svelte/transition';

	export let data: LayoutData;

	// Sidebar

	let currentItem = 0;
	const appRailItems: {
		title: string;
		icon: typeof SvelteComponent<any, any, any>;
		href?: string;
		submenu?: {
			title: string;
			list: {
				href: string;
				label: string;
				badge?: string;
			}[];
		}[];
	}[] = [
		{
			title: 'My apps',
			icon: LayoutGrid,
			href: '/'
		},
		{
			title: 'Discover',
			icon: Sparkles,
			href: '/discover'
		},
		{
			title: 'Settings',
			icon: Settings,
			submenu: [
				{
					title: 'General',
					list: [
						{ label: 'Apps', href: '/settings/apps' },
						{ label: 'Users', href: '/settings/users' }
					]
				},
				{ title: 'System', list: [{ label: 'Tasks', href: '/settings/tasks' }] }
			]
		}
	];

	page.subscribe((value) => {
		if (value) {
			currentItem = appRailItems.findIndex((item) => {
				let hrefs = [item.href];
				if (!item.href) {
					hrefs = item.submenu?.flatMap((segment) => segment.list.map((item) => item.href)) ?? [];
				}
				return hrefs.some((href) => href?.includes(value.url.pathname));
			});
		}
	});

	$: submenuItemActive = (href: string) =>
		$page.url.pathname?.includes(href) ? 'bg-primary-active-token' : '';

	// Toast

	const toastStore = getToastStore();
	if (data.dataVolumeMounted) {
		toastStore.trigger({
			message: `The ${data.appDataPath} was not mounted properly. All data will be lost when the container is stopped or restarted.`,
			background: 'variant-filled-warning',
			hideDismiss: true,
			timeout: 2147483647 // This is an important warning and should never disappear, until the user has fixed the issue
		});
	}

	// Seachbar

	let searchPopupSettings: PopupSettings = {
		event: 'focus-click',
		target: 'popupSearch',
		placement: 'bottom'
	};
	let searchInput = '';
	const searchOptions: AutocompleteOption<string>[] = [
		// TODO
		{ label: 'Vanilla', value: 'vanilla', keywords: 'plain, basic', meta: { healthy: false } },
		{ label: 'Chocolate', value: 'chocolate', keywords: 'dark, white', meta: { healthy: false } },
		{ label: 'Strawberry', value: 'strawberry', keywords: 'fruit', meta: { healthy: true } },
		{
			label: 'Neapolitan',
			value: 'neapolitan',
			keywords: 'mix, strawberry, chocolate, vanilla',
			meta: { healthy: false }
		},
		{ label: 'Pineapple', value: 'pineapple', keywords: 'fruit', meta: { healthy: true } },
		{ label: 'Peach', value: 'peach', keywords: 'fruit', meta: { healthy: true } }
	];
	function onSelection(event: CustomEvent<AutocompleteOption<string>>): void {
		searchInput = event.detail.label;
	}
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar class="shadow-2xl">
			<svelte:fragment slot="lead">
				<h1 class="h1 leading-8">
					<span
						class="bg-gradient-to-br from-primary-500 to-secondary-500 bg-clip-text text-transparent box-decoration-clone font-bold"
					>
						App Station
					</span>
				</h1>
			</svelte:fragment>
			<div class="relative">
				<Search class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 z-10" />
				<input
					type="search"
					class="input variant-ghost autocomplete pl-12"
					placeholder="Search for apps"
					bind:value={searchInput}
					use:popup={searchPopupSettings}
				/>
				<div
					class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto"
					tabindex="-1"
					data-popup="popupSearch"
				>
					<Autocomplete
						bind:input={searchInput}
						options={searchOptions}
						on:selection={onSelection}
					/>
				</div>
			</div>
			<svelte:fragment slot="trail">
				<button
					class="btn variant-soft-primary"
					use:popup={{ event: 'click', target: 'avatarClick' }}
				>
					<span>{data.username}</span>
					<ChevronDown class="translate-y-[0.1rem]" />
				</button>
				<form method="post" class="card p-4 shadow-xl" data-popup="avatarClick" use:enhance>
					<nav class="list-nav">
						<ul>
							<li>
								<button formaction="?/logout">
									<LogOut class="h-6" />
									<span>Ausloggen</span>
								</button>
							</li>
						</ul>
					</nav>
				</form>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<div
			class="grid grid-cols-[auto_1fr] h-full bg-surface-50-900-token border-r border-surface-500/30"
		>
			<!-- App Rail -->
			<AppRail background="bg-transparent" border="border-r border-surface-500/30">
				{#each appRailItems as { title, icon, href }, i}
					<AppRailTile
						bind:group={currentItem}
						name={'item-' + i}
						value={i}
						{title}
						class="[&>button]:transition"
						on:click={() => (href ? goto(href) : {})}
					>
						<svelte:fragment slot="lead">
							<svelte:component this={icon} class="inline-block" />
						</svelte:fragment>
						<span>{title}</span>
					</AppRailTile>
				{/each}
				<svelte:fragment slot="trail">
					<AppRailAnchor
						href="https://github.com/Sharknoon/home-station"
						target="_blank"
						title="GitHub"
					>
						<svelte:fragment slot="lead"><Brand icon="siGithub" /></svelte:fragment>
					</AppRailAnchor>
				</svelte:fragment>
			</AppRail>
			{#if appRailItems[currentItem].submenu}
				{@const submenu = appRailItems[currentItem].submenu ?? []}
				<section class="p-4 pb-20 space-y-4 overflow-y-auto w-64" transition:slide={{ axis: 'x' }}>
					{#each submenu as segment, i}
						<!-- Title -->
						<p class="font-bold pl-4 text-2xl">{segment.title}</p>
						<!-- Nav List -->
						<nav class="list-nav">
							<ul>
								{#each segment.list as { href, label, badge }}
									<li>
										<a {href} class={submenuItemActive(href)}>
											<span class="flex-auto">{label}</span>
											{#if badge}<span class="badge variant-filled-secondary">{badge}</span>{/if}
										</a>
									</li>
								{/each}
							</ul>
						</nav>
						<!-- Divider -->
						{#if i + 1 < submenu.length}<hr class="!my-6 opacity-50" />{/if}
					{/each}
				</section>
			{/if}
		</div>
	</svelte:fragment>

	<slot />
</AppShell>
