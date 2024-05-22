<script lang="ts">
    import type { PageData } from './$types';
    import { enhance } from '$app/forms';
    import { getModalStore, popup } from '@skeletonlabs/skeleton';
    import Store from 'lucide-svelte/icons/store';
    import Trash2 from 'lucide-svelte/icons/trash-2';
    import Plus from 'lucide-svelte/icons/plus';
    import Pencil from 'lucide-svelte/icons/pencil';
    import { i18n, ts } from '$lib/i18n';
    import AppButton from './AppButton.svelte';
    import NewMarketplaceModal from './NewMarketplaceModal.svelte';
    import UpdateMarketplaceModal from './UpdateMarketplaceModal.svelte';

    export let data: PageData;

    const modalStore = getModalStore();
</script>

<div class="flex justify-end">
    <button
        type="button"
        class="btn-icon variant-soft"
        use:popup={{ event: 'click', target: 'popupMarketplaces', placement: 'bottom-end' }}
    >
        <Store />
    </button>
    <div class="card p-4 shadow-xl" data-popup="popupMarketplaces">
        <div class="space-y-2">
            <h3 class="h3">{$i18n.t('discover.marketplaces')}</h3>
            <ul class="list">
                {#each data.marketplaces as marketplace}
                    <li>
                        <div class="flex items-center gap-1 w-full">
                            <span class="mr-2 grow">{marketplace.gitRemoteUrl}</span>
                            <button
                                type="button"
                                class="btn-icon"
                                on:click={() =>
                                    modalStore.trigger({
                                        type: 'component',
                                        component: { ref: UpdateMarketplaceModal },
                                        meta: {
                                            gitRemoteUrl: marketplace.gitRemoteUrl,
                                            gitUsername: marketplace.gitUsername
                                        }
                                    })}
                            >
                                <Pencil />
                            </button>
                            <form method="post" action="?/deleteMarketplace" use:enhance>
                                <input
                                    type="hidden"
                                    name="gitRemoteUrl"
                                    value={marketplace.gitRemoteUrl}
                                />
                                <button class="btn-icon text-error-500-400-token">
                                    <Trash2 />
                                </button>
                            </form>
                        </div>
                    </li>
                {/each}
            </ul>
            <div class="flex gap-2">
                <button
                    class="btn btn-sm variant-filled-primary space-x-2"
                    on:click={() =>
                        modalStore.trigger({
                            type: 'component',
                            component: { ref: NewMarketplaceModal }
                        })}
                >
                    <Plus />
                    <span>{$i18n.t('discover.add-marketplace')}</span>
                </button>
                <!-- TODO make default repo dynamic-->
                {#if !data.marketplaces.some((marketplace) => marketplace.gitRemoteUrl === 'https://github.com/sharknoon/home-station-apps.git')}
                    <form method="post" action="?/addMarketplace" use:enhance>
                        <input
                            type="hidden"
                            name="gitRemoteUrl"
                            value="https://github.com/sharknoon/home-station-apps.git"
                        />
                        <!-- TODO remove username and token once public -->
                        <input type="hidden" name="gitUsername" value="Sharknoon" />
                        <input
                            type="hidden"
                            name="gitPassword"
                            value="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"
                        />
                        <button class="btn btn-sm variant-filled-secondary space-x-2">
                            <Plus />
                            <span>{$i18n.t('discover.add-default-marketplace')}</span>
                        </button>
                    </form>
                {/if}
            </div>
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
