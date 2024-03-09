<script lang="ts">
    import { enhance } from '$app/forms';
    import { ProgressRadial, getModalStore, popup } from '@skeletonlabs/skeleton';
    import HardDriveDownload from 'lucide-svelte/icons/hard-drive-download';
    import Play from 'lucide-svelte/icons/play';
    import { i18n } from '$lib/i18n';
    import { addEventListener } from '$lib/events';
    import type { MarketplaceApp } from '$lib/server/marketplaces';
    import ContainerEnginesModal from './ContainerEnginesModal.svelte';
    import type { ContainerEngine } from '$lib/server/containerengines';

    type AvailableContainerEngine = Pick<ContainerEngine, 'id' | 'name' | 'type'>;

    export let app: MarketplaceApp;
    export let containerEngines: AvailableContainerEngine[];
    export let installedApps: string[];
    export let size: 'small' | 'large' = 'large';

    const modalStore = getModalStore();
    let appProgress = 0;
    let appStatus = installedApps.some((uuid) => uuid === app.uuid) ? 'installed' : 'not installed';
    let buttonClasses = size === 'small' ? 'btn-sm' : '';

    addEventListener('appStatus', (status) => {
        if (status.appUuid !== app.uuid) return;
        appProgress = status.progress;
        appStatus = status.status;
    });
</script>

<form method="post" use:enhance>
    <input type="hidden" name="appUuid" value={app.uuid} />
    {#if containerEngines.length === 0}
        <button
            use:popup={{
                event: 'hover',
                target: 'popupNoContainerEngines',
                placement: 'top'
            }}
            type="button"
            disabled
            class="btn variant-filled-primary font-semibold {buttonClasses}"
        >
            <HardDriveDownload class="mr-2" />
            {$i18n.t('discover.install')}
        </button>
        <div class="card p-4 variant-filled-warning" data-popup="popupNoContainerEngines">
            <p>
                {$i18n.t('discover.popup-no-container-engines.no-container-engine-available')}
            </p>
            <div class="arrow variant-filled-warning" />
        </div>
    {:else if containerEngines.length === 1}
        <input type="hidden" name="containerEngineId" value={containerEngines[0].id} />
        <button
            type="submit"
            formaction="/discover?/installApp"
            class="btn variant-filled-primary font-semibold {buttonClasses}"
            on:click|stopPropagation
        >
            <!-- TODO in svelte 5 convert to snippet -->
            {#if appStatus === 'installing'}
                <ProgressRadial
                    class="h-6 w-6 mr-2 -ml-2"
                    stroke={100}
                    meter="stroke-surface-50 dark:stroke-surface-900"
                    value={appProgress}
                />
                {$i18n.t('discover.installing')}
            {:else if appStatus === 'not installed'}
                <HardDriveDownload class="mr-2" />
                {$i18n.t('discover.install')}
            {:else if appStatus === 'installed'}
                <Play class="mr-2" />
                {$i18n.t('discover.open')}
            {/if}
        </button>
    {:else}
        <button
            type="button"
            class="btn variant-filled-primary font-semibold {buttonClasses}"
            on:click|stopPropagation={() =>
                modalStore.trigger({
                    type: 'component',
                    component: {
                        ref: ContainerEnginesModal,
                        props: {
                            appUuid: app.uuid,
                            availableContainerEngines: containerEngines
                        }
                    }
                })}
        >
            {#if appStatus === 'installing'}
                <ProgressRadial
                    class="h-6 w-6 mr-2 -ml-2"
                    stroke={100}
                    meter="stroke-surface-50 dark:stroke-surface-900"
                    value={appProgress}
                />
                {$i18n.t('discover.installing')}
            {:else if appStatus === 'not installed'}
                <HardDriveDownload class="mr-2" />
                {$i18n.t('discover.install')}
            {:else if appStatus === 'installed'}
                <Play class="mr-2" />
                {$i18n.t('discover.open')}
            {/if}
        </button>
    {/if}
</form>
