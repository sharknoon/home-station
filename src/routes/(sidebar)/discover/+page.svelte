<script lang="ts">
	import { HardDriveDownload, Info, LibraryBig } from 'lucide-svelte';
	import type { PageData } from './$types';
	//import ColorThief from 'colorthief/dist/color-thief.modern.mjs';
	import { getModalStore, type ModalComponent } from '@skeletonlabs/skeleton';
	import AppInfoModal from './appInfoModal.svelte';
	import type { availableApps } from '$lib/server/schema';
	import i18n, { ls } from '$lib/i18n';

	type App = typeof availableApps.$inferSelect;

	export let data: PageData;

	const modalStore = getModalStore();

	let currentApp: App;
	let appInfoModalComponent: ModalComponent;
	$: appInfoModalComponent = { ref: AppInfoModal, props: { app: currentApp } };
</script>

<div class="flex justify-end">
	<button type="button" class="btn-icon variant-soft">
		<LibraryBig />
	</button>
</div>

<div class="grid grid-cols-4 gap-4">
	{#each data.apps as app}
		<a href="/" class="card card-hover overflow-hidden">
			<header class="h-24 max-h-24 p-2 bg-white">
				<div
					class="h-full bg-contain bg-no-repeat bg-center"
					style="background-image: url('{app.banner}');"
				/>
			</header>
			<div class="p-4 space-y-2">
				<div class="flex gap-4 items-center">
					<img src={app.icon} alt="icon" class="object-cover h-20 w-20 rounded-2xl p-2 bg-white" />
					<div>
						<h3 class="h3">{ls(app.name)}</h3>
						<div class="text-sm text-surface-700-200-token">{app.developer}</div>
					</div>
				</div>
				<div>{ls(app.description)}</div>
				<span class="badge variant-filled">{app.category}</span>
			</div>
			<hr />
			<div class="p-4">
				<div class="flex justify-between">
					<button
						type="button"
						class="btn btn-icon variant-soft"
						on:click|preventDefault={() => {
							currentApp = app;
							modalStore.trigger({
								type: 'component',
								component: appInfoModalComponent
							});
						}}
					>
						<Info />
					</button>
					<button
						type="button"
						class="btn variant-filled-primary font-semibold"
						on:click|preventDefault={() => {}}
					>
						<HardDriveDownload class="mr-2" />
						{$i18n.t('discover.install')}
					</button>
				</div>
			</div>
		</a>
	{/each}
</div>
<!-- sort by creation time newest to oldest -->
<h1>Recently Added</h1>
<!-- sort by fastest grow this week -->
<h1>Trends</h1>
<!-- sort by most downloads this week -->
<h1>Charts</h1>
<!-- adblocker, Media, etc... -->
<h1>Categories</h1>
