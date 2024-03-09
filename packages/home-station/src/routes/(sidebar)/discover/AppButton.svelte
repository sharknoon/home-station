<script lang="ts">
    import ContainerEnginesModal from './ContainerEnginesModal.svelte';
    import { ProgressRadial, getModalStore, popup } from '@skeletonlabs/skeleton';
    import HardDriveDownload from 'lucide-svelte/icons/hard-drive-download';
    import { i18n } from '$lib/i18n';
    import { addEventListener } from '$lib/events';
    import type { MarketplaceApp } from '$lib/server/marketplaces';
    import type { InstalledApp } from '$lib/server/apps';

    export let app: MarketplaceApp;
    export let containerEngines: any[];
    export let installedApps: InstalledApp[];

    const modalStore = getModalStore();
    let appLoading = false;
    let appProgress = 0;

    addEventListener('appStatus', (status) => {
        if (status.appUuid !== app.uuid) return;
        if (status.status === 'installing') {
            appLoading = true;
        } else {
            appLoading = false;
        }
        appProgress = status.progress;
    });
</script>

{#if containerEngines.length === 0}
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
        formaction="?/installApp"
        class="btn variant-filled-primary font-semibold"
    >
        <!-- TODO in svelte 5 convert to snippet -->
        {#if appLoading}
            <ProgressRadial
                class="h-6 w-6 mr-2 -ml-2"
                stroke={100}
                meter="stroke-surface-50 dark:stroke-surface-900"
                value={appProgress}
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
                        appUuid: app.uuid,
                        availableContainerEngines: containerEngines
                    }
                }
            })}
    >
        {#if appLoading}
            <ProgressRadial
                class="h-6 w-6 mr-2 -ml-2"
                stroke={100}
                meter="stroke-surface-50 dark:stroke-surface-900"
                value={appProgress}
            />
            {$i18n.t('discover.installing')}
        {:else}
            <HardDriveDownload class="mr-2" />
            {$i18n.t('discover.install')}
        {/if}
    </button>
{/if}
