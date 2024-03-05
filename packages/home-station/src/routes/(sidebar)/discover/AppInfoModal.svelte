<script lang="ts">
    import X from 'lucide-svelte/icons/x';
    import type { SvelteComponent } from 'svelte';
    import { i18n } from '$lib/i18n';
    import type { MarketplaceApp } from '$lib/server/marketplaces';

    export let marketplaceApp: MarketplaceApp;
    export let marketplaceUrl: string;
    export let parent: SvelteComponent;

    const dateTimeFormatter = new Intl.DateTimeFormat($i18n.language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
</script>

<div class="card variant-filled shadow-2xl p-4 relative">
    <h3 class="h3">{$i18n.t('discover.app-info-modal.additional-information')}</h3>
    <button class="absolute top-2 right-2 btn btn-icon" on:click={parent.onClose}><X /></button>
    <div>{$i18n.t('discover.app-info-modal.id')}: <code>{marketplaceApp.id}</code></div>
    <div>
        {$i18n.t('discover.app-info-modal.published-at')}: {dateTimeFormatter.format(
            new Date(marketplaceApp.publishedAt)
        )}
    </div>
    <div>
        {$i18n.t('discover.app-info-modal.marketplace')}:
        <a href={marketplaceUrl} target="_blank" class="anchor">{marketplaceUrl}</a>
    </div>
</div>
