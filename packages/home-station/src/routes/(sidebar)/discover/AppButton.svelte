<script lang="ts">
    import { enhance } from '$app/forms';
    import { ProgressRadial } from '@skeletonlabs/skeleton';
    import HardDriveDownload from 'lucide-svelte/icons/hard-drive-download';
    import Play from 'lucide-svelte/icons/play';
    import { i18n } from '$lib/i18n';
    import { addEventListener } from '$lib/events';
    import type { MarketplaceApp } from '$lib/server/marketplaces';
    import type { InstalledApp } from '$lib/server/apps';

    export let app: MarketplaceApp;
    export let installedApps: InstalledApp[];
    export let size: 'small' | 'large' = 'large';
    export let type: 'primary' | 'soft' = 'primary';

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
</form>
