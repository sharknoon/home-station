<script lang="ts">
    import Globe from 'lucide-svelte/icons/globe';
    import HardDriveDownload from 'lucide-svelte/icons/hard-drive-download';
    import Info from 'lucide-svelte/icons/info';
    import LibraryBig from 'lucide-svelte/icons/library-big';
    import Code from 'lucide-svelte/icons/code';
    import ExternalLink from 'lucide-svelte/icons/external-link';
    import type { PageData } from './$types';
    //import ColorThief from 'colorthief/dist/color-thief.modern.mjs';
    import { getModalStore, popup } from '@skeletonlabs/skeleton';
    import AppInfoModal from './appInfoModal.svelte';
    import i18n, { ls } from '$lib/i18n';
    import Trash2 from 'lucide-svelte/icons/trash-2';
    import Plus from 'lucide-svelte/icons/plus';
    import Pencil from 'lucide-svelte/icons/pencil';

    export let data: PageData;

    const modalStore = getModalStore();
</script>

<div class="flex justify-end">
    <button
        type="button"
        class="btn-icon variant-soft"
        use:popup={{ event: 'click', target: 'popupAppRepositories', placement: 'bottom-end' }}
    >
        <LibraryBig />
    </button>
    <div class="card p-4 max-w-[36rem] shadow-xl space-y-2" data-popup="popupAppRepositories">
        <h3 class="h3">{$i18n.t('discover.app-repositories')}</h3>
        <ul class="list">
            {#each data.appRepositories as appRepository}
                <li>
                    <span class="flex items-center gap-1">
                        <span class="mr-2">{appRepository.url}</span>
                        <button class="btn-icon"><Pencil /></button>
                        <button class="btn-icon text-error-500-400-token"><Trash2 /></button>
                    </span>
                </li>
            {/each}
        </ul>
        <button class="btn btn-sm variant-filled-secondary space-x-2">
            <Plus />
            <span>{$i18n.t('discover.add-app-repository')}</span>
        </button>
        <div class="arrow bg-surface-100-800-token" />
    </div>
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
                    <img
                        src={app.icon}
                        alt="icon"
                        class="object-cover h-20 w-20 rounded-2xl p-2 bg-white"
                    />
                    <div>
                        <h3 class="h3">{ls(app.name)}</h3>
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
                            <span>{ls(link.name)}</span>
                        </a>
                    {/each}
                </div>
                <div class="!-mt-2">{ls(app.description)}</div>
                <span class="badge variant-filled">{app.category}</span>
            </div>
            <hr />
            <div class="p-4">
                <div class="flex justify-between">
                    <button
                        type="button"
                        class="btn btn-icon variant-soft"
                        on:click|preventDefault={() => {
                            modalStore.trigger({
                                type: 'component',
                                component: {
                                    ref: AppInfoModal,
                                    props: { app, appRepositoryUrl: app.appRepository.url }
                                }
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
