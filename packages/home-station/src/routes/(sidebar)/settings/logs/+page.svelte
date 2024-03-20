<script lang="ts">
    import type { PageData } from './$types';
    import { i18n } from '$lib/i18n';
    import RefreshCw from 'lucide-svelte/icons/refresh-cw';
    import { invalidateAll } from '$app/navigation';
    import { stripAnsi } from '$lib/utils';

    export let data: PageData;

    function logLevelColor(level: string) {
        switch (level) {
            case 'ERROR':
                return 'variant-filled-error';
            case 'WARN':
                return 'variant-filled-warning';
            case 'DEBUG':
                return 'variant-filled-primary';
            case 'INFO':
            default:
                return 'variant-filled';
        }
    }

    const dateTimeFormatter = new Intl.DateTimeFormat($i18n.language, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });
</script>

<div class="flex justify-between mb-4">
    <h2 class="h2">{$i18n.t('settings.logs.logs')}</h2>
    <button class="btn variant-filled-secondary" on:click={() => invalidateAll()}>
        <RefreshCw class="w-6 h-6 mr-2" />
        {$i18n.t('settings.logs.refresh')}
    </button>
</div>

<div class="table-container mb-4">
    <table class="table table-compact table-hover [&_td]:!align-middle">
        <thead>
            <tr>
                <th class="normal-case">{$i18n.t('settings.logs.timestamp')}</th>
                <th class="normal-case">{$i18n.t('settings.logs.level')}</th>
                <th class="normal-case">{$i18n.t('settings.logs.message')}</th>
            </tr>
        </thead>
        <tbody>
            {#each data.logs as log}
                <tr>
                    <td class="!table-cell-fit"
                        >{dateTimeFormatter.format(new Date(log.timestamp))}</td
                    >
                    <td class="table-cell-fit">
                        <span class="badge {logLevelColor(log.level)}">{stripAnsi(log.level)}</span>
                    </td>
                    <td><code>{log.message}</code></td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
