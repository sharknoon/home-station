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
    import type { InstalledApp } from '$lib/server/apps';

    type AvailableContainerEngine = Pick<ContainerEngine, 'id' | 'name' | 'type'>;

    export let app: MarketplaceApp;
    export let containerEngines: AvailableContainerEngine[];
    export let installedApps: InstalledApp[];
    export let size: 'small' | 'large' = 'large';
    export let type: 'primary' | 'soft' = 'primary';

    const modalStore = getModalStore();
    let appInstallProgress = 0;
    let appInstallStatus = installedApps.some((app) => app.uuid === app.uuid)
        ? 'installed'
        : 'not installed';
    let buttonClasses = `${size === 'small' ? 'btn-sm' : ''} ${type === 'primary' ? 'variant-filled-primary' : 'variant-soft'}`;

    addEventListener('appStatus', (status) => {
        if (status.appUuid !== app.uuid) return;
        appInstallProgress = status.progress;
        appInstallStatus = status.status;
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
            class="btn font-semibold {buttonClasses}"
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
            class="btn font-semibold {buttonClasses}"
            on:click|stopPropagation
        >
            <!-- TODO in svelte 5 convert to snippet -->
            {#if appInstallStatus === 'installing'}
                <ProgressRadial
                    class="h-6 w-6 mr-2 -ml-2"
                    stroke={100}
                    meter="stroke-surface-50 dark:stroke-surface-900"
                    value={appInstallProgress}
                />
                {$i18n.t('discover.installing')}
            {:else if appInstallStatus === 'not installed'}
                <HardDriveDownload class="mr-2" />
                {$i18n.t('discover.install')}
            {:else if appInstallStatus === 'installed'}
                {@const installedApp = installedApps.find((a) => a.uuid === app.uuid)}
                {#if installedApp?.status === 'running'}
                    <Play class="mr-2" />
                    {$i18n.t('discover.open')}
                {:else if installedApp?.status === 'stopped'}
                    <Play class="mr-2" />
                    {$i18n.t('discover.start')}
                {:else}Whaaat: {installedApp?.status}{/if}
            {/if}
        </button>
    {:else}
        <button
            type="button"
            class="btn font-semibold {buttonClasses}"
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
            {#if appInstallStatus === 'installing'}
                <ProgressRadial
                    class="h-6 w-6 mr-2 -ml-2"
                    stroke={100}
                    meter="stroke-surface-50 dark:stroke-surface-900"
                    value={appInstallProgress}
                />
                {$i18n.t('discover.installing')}
            {:else if appInstallStatus === 'not installed'}
                <HardDriveDownload class="mr-2" />
                {$i18n.t('discover.install')}
            {:else if appInstallStatus === 'installed'}
                <Play class="mr-2" />
                {$i18n.t('discover.open')}
            {/if}
        </button>
    {/if}
</form>
