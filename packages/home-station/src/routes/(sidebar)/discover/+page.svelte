<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    import { ProgressRadial, getModalStore, popup } from '@skeletonlabs/skeleton';
    import Globe from 'lucide-svelte/icons/globe';
    import HardDriveDownload from 'lucide-svelte/icons/hard-drive-download';
    import Info from 'lucide-svelte/icons/info';
    import Store from 'lucide-svelte/icons/store';
    import Code from 'lucide-svelte/icons/code';
    import ExternalLink from 'lucide-svelte/icons/external-link';
    import Trash2 from 'lucide-svelte/icons/trash-2';
    import Plus from 'lucide-svelte/icons/plus';
    import Pencil from 'lucide-svelte/icons/pencil';
    import { i18n, ts } from '$lib/i18n';
    import AppInfoModal from './AppInfoModal.svelte';
    import ContainerEnginesModal from './ContainerEnginesModal.svelte';
    import { onMount } from 'svelte';

    export let data: PageData;

    const modalStore = getModalStore();

    let appsLoading: string[] = [];
    let appsProgress: Map<string, number> = new Map();

    onMount(() => {
        const evtSource = new EventSource('/events');
        evtSource.onerror = (e) => console.error(e);
        evtSource.addEventListener('installAppProgress', (stats: MessageEvent<string>) => {
            const p = JSON.parse(stats.data) as { id: string; progress: number };
            appsProgress.set(p.id, p.progress);
            appsProgress = appsProgress;
        });
    });
</script>

<div class="flex justify-end">
    <button
        type="button"
        class="btn-icon variant-soft"
        use:popup={{ event: 'click', target: 'popupMarketplaces', placement: 'bottom-end' }}
    >
        <Store />
    </button>
    <div class="card p-4 max-w-[36rem] shadow-xl" data-popup="popupMarketplaces">
        <div class="space-y-2">
            <h3 class="h3">{$i18n.t('discover.marketplaces')}</h3>
            <ul class="list">
                {#each data.marketplaces as marketplace}
                    <li>
                        <form method="post" class="flex items-center gap-1" use:enhance>
                            <input type="hidden" name="url" value={marketplace.gitRemoteUrl} />
                            <span class="mr-2">{marketplace.gitRemoteUrl}</span>
                            <!-- TODO -->
                            <button disabled class="btn-icon"><Pencil /></button>
                            <button
                                formaction="?/deleteRepository"
                                class="btn-icon text-error-500-400-token"><Trash2 /></button
                            >
                        </form>
                    </li>
                {/each}
            </ul>
            <!-- TODO -->
            <button disabled class="btn btn-sm variant-filled-primary space-x-2">
                <Plus />
                <span>{$i18n.t('discover.add-marketplace')}</span>
            </button>
            <!-- TODO implement and make default repo dynamic-->
            {#if !data.marketplaces.some((marketplace) => marketplace.gitRemoteUrl === 'https://github.com/home-station-org/apps.git')}
                <button disabled class="btn btn-sm variant-filled-secondary space-x-2 ml-2">
                    <Plus />
                    <span>{$i18n.t('discover.add-default-marketplace')}</span>
                </button>
            {/if}
        </div>
        <div class="arrow bg-surface-100-800-token" />
    </div>
</div>

<div class="grid grid-cols-4 gap-4">
    {#each data.marketplaceApps as app}
        <div class="card card-hover overflow-hidden">
            <header class="h-24 max-h-24 p-2 bg-white">
                <div
                    class="h-full bg-contain bg-no-repeat bg-center"
                    style="background-image: url('{app.banner}');"
                />
            </header>
            <div class="p-4 space-y-2">
                <div class="flex gap-4 items-center">
                    <img
                        src={app.icon}
                        alt="icon"
                        class="object-cover h-20 w-20 rounded-2xl p-2 bg-white"
                    />
                    <div>
                        <h3 class="h3">{ts(app.name)}</h3>
                        <div class="text-sm text-surface-700-200-token">{app.developer}</div>
                    </div>
                </div>
                <div class="flex gap-2 overflow-x-auto pb-3">
                    {#if app.links.website}
                        <a
                            class="chip variant-soft hover:variant-filled"
                            href={app.links.website}
                            target="_blank"
                        >
                            <span><Globe class="h-4 w-4" /></span>
                            <span>{$i18n.t('discover.links.website')}</span>
                        </a>
                    {/if}
                    {#if app.links.repository}
                        <a
                            class="chip variant-soft hover:variant-filled"
                            href={app.links.repository}
                            target="_blank"
                        >
                            <span><Code class="h-4 w-4" /></span>
                            <span>{$i18n.t('discover.links.repository')}</span>
                        </a>
                    {/if}
                    {#each app.links.custom ?? [] as link}
                        <a
                            class="chip variant-soft hover:variant-filled"
                            href={link.url}
                            target="_blank"
                        >
                            <span><ExternalLink class="h-4 w-4" /></span>
                            <span>{ts(link.name)}</span>
                        </a>
                    {/each}
                </div>
                <div class="!-mt-2">{ts(app.description)}</div>
                <span class="badge variant-filled">{$i18n.t(app.category)}</span>
            </div>
            <hr />
            <div class="p-4">
                <form
                    method="post"
                    class="flex justify-between"
                    use:enhance={() => {
                        appsLoading = [...appsLoading, app.id];
                        return async ({ update }) => {
                            appsLoading = appsLoading.filter((id) => id !== app.id);
                            update();
                        };
                    }}
                >
                    <input type="hidden" name="id" value={app.id} />
                    <input
                        type="hidden"
                        name="marketplaceUrl"
                        value={app.marketplace.gitRemoteUrl}
                    />
                    <button
                        type="button"
                        class="btn btn-icon variant-soft"
                        on:click={() => {
                            modalStore.trigger({
                                type: 'component',
                                component: {
                                    ref: AppInfoModal,
                                    props: {
                                        marketplaceApp: app
                                    }
                                }
                            });
                        }}
                    >
                        <Info />
                    </button>
                    {#if data.containerEngines.length === 0}
                        <button
                            use:popup={{
                                event: 'hover',
                                target: 'popupNoContainerEngines',
                                placement: 'top'
                            }}
                            type="button"
                            disabled
                            class="btn variant-filled-primary font-semibold"
                        >
                            <HardDriveDownload class="mr-2" />
                            {$i18n.t('discover.install')}
                        </button>
                        <div
                            class="card p-4 variant-filled-warning"
                            data-popup="popupNoContainerEngines"
                        >
                            <p>
                                {$i18n.t(
                                    'discover.popup-no-container-engines.no-container-engine-available'
                                )}
                            </p>
                            <div class="arrow variant-filled-warning" />
                        </div>
                    {:else if data.containerEngines.length === 1}
                        <input
                            type="hidden"
                            name="containerEngineId"
                            value={data.containerEngines[0].id}
                        />
                        <button
                            type="submit"
                            formaction="?/installApp"
                            class="btn variant-filled-primary font-semibold"
                        >
                            <!-- TODO in svelte 5 convert to snippet -->
                            {#if appsLoading.includes(app.id)}
                                <ProgressRadial
                                    class="h-6 w-6 mr-2 -ml-2"
                                    stroke={100}
                                    meter="stroke-surface-50 dark:stroke-surface-900"
                                    value={appsProgress.get(app.id)}
                                />
                                {$i18n.t('discover.installing')}
                            {:else}
                                <HardDriveDownload class="mr-2" />
                                {$i18n.t('discover.install')}
                            {/if}
                        </button>
                    {:else}
                        <button
                            type="button"
                            class="btn variant-filled-primary font-semibold"
                            on:click={() =>
                                modalStore.trigger({
                                    type: 'component',
                                    component: {
                                        ref: ContainerEnginesModal,
                                        props: {
                                            appId: app.id,
                                            marketplaceUrl: app.marketplace.gitRemoteUrl,
                                            availableContainerEngines: data.containerEngines
                                        }
                                    }
                                })}
                        >
                            {#if appsLoading.includes(app.id)}
                                <ProgressRadial
                                    class="h-6 w-6 mr-2 -ml-2"
                                    stroke={100}
                                    meter="stroke-surface-50 dark:stroke-surface-900"
                                    value={appsProgress.get(app.id)}
                                />
                                {$i18n.t('discover.installing')}
                            {:else}
                                <HardDriveDownload class="mr-2" />
                                {$i18n.t('discover.install')}
                            {/if}
                        </button>
                    {/if}
                </form>
            </div>
        </div>
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
