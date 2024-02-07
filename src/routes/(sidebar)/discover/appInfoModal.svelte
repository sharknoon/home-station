<script lang="ts">
    import type { availableApps } from '$lib/server/schema';
    import X from 'lucide-svelte/icons/x';
    import type { SvelteComponent } from 'svelte';
    import i18n from '$lib/i18n';

    type App = typeof availableApps.$inferSelect;

    export let app: App;
    export let appRepositoryUrl: string;
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
    <div>{$i18n.t('discover.app-info-modal.id')}: <code>{app.id}</code></div>
    <div>
        {$i18n.t('discover.app-info-modal.published-at')}: {dateTimeFormatter.format(
            new Date(app.publishedAt)
        )}
    </div>
    <div>
        {$i18n.t('discover.app-info-modal.app-repository')}:
        <a href={appRepositoryUrl} target="_blank" class="anchor">{appRepositoryUrl}</a>
    </div>
</div>
