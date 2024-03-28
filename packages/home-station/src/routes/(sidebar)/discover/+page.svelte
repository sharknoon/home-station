<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    import { popup } from '@skeletonlabs/skeleton';
    import Store from 'lucide-svelte/icons/store';
    import Trash2 from 'lucide-svelte/icons/trash-2';
    import Plus from 'lucide-svelte/icons/plus';
    import Pencil from 'lucide-svelte/icons/pencil';
    import { i18n, ts } from '$lib/i18n';
    import { addEventListener } from '$lib/events';
    import AppButton from './AppButton.svelte';

    export let data: PageData;

    let appsLoading: string[] = [];
    let appsProgress: Map<string, number> = new Map();

    // TODO
    addEventListener('appStatus', (status: { appId: string; status: string; progress: number }) => {
        if (status.status === 'installing') {
            appsLoading = [...appsLoading, status.appId];
            appsProgress.set(status.appId, status.progress);
        } else {
            appsLoading = appsLoading.filter((id) => id !== status.appId);
            appsProgress.delete(status.appId);
        }
        appsLoading = appsLoading;
        appsProgress = appsProgress;
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
        <a
            href="/discover/apps/{encodeURIComponent(app.id)}"
            class="card card-hover overflow-hidden"
        >
            <div class="p-4 space-y-2">
                <div class="flex gap-4 items-center">
                    <img
                        src={app.icon}
                        alt="icon"
                        class="object-cover h-28 w-28 rounded-2xl p-2 bg-white"
                    />
                    <div>
                        <h3 class="h3">{ts(app.name)}</h3>
                        <div class="text-sm text-surface-700-200-token mb-2">
                            {$i18n.t('marketplace-app.category.' + app.category)}
                        </div>
                        <AppButton
                            {app}
                            installedApps={data.installedApps}
                            size="small"
                            type="soft"
                        />
                    </div>
                </div>
                <div>{ts(app.description)}</div>
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
