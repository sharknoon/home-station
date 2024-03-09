<script lang="ts">
    import type { PageData } from './$types';
    import ExternalLink from 'lucide-svelte/icons/external-link';
    import Globe from 'lucide-svelte/icons/globe';
    import Code from 'lucide-svelte/icons/code';
    import ArrowLeft from 'lucide-svelte/icons/arrow-left';
    import ArrowRight from 'lucide-svelte/icons/arrow-right';
    import Scale from 'lucide-svelte/icons/scale';
    import Shapes from 'lucide-svelte/icons/shapes';
    import Calendar from 'lucide-svelte/icons/calendar';
    import Store from 'lucide-svelte/icons/store';
    import { i18n, ts } from '$lib/i18n';
    import FileStack from 'lucide-svelte/icons/file-stack';
    import AppButton from '../../AppButton.svelte';

    export let data: PageData;

    const app = data.app;
    const containerEngines = data.containerEngines;
    const installedApps = data.installedApps;
    const marketplaceUrl = new URL(app.marketplaceUrl);

    let elemScreenshots: HTMLDivElement;

    function multiColumnLeft(): void {
        let x = elemScreenshots.scrollWidth;
        if (elemScreenshots.scrollLeft !== 0)
            x = elemScreenshots.scrollLeft - elemScreenshots.clientWidth;
        elemScreenshots.scroll(x, 0);
    }

    function multiColumnRight(): void {
        let x = 0;
        // -1 is used because different browsers use different methods to round scrollWidth pixels.
        if (
            elemScreenshots.scrollLeft <
            elemScreenshots.scrollWidth - elemScreenshots.clientWidth - 1
        )
            x = elemScreenshots.scrollLeft + elemScreenshots.clientWidth;
        elemScreenshots.scroll(x, 0);
    }

    const dateTimeFormatter = new Intl.DateTimeFormat($i18n.language, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
</script>

<header class="h-32 max-h-32 p-2 bg-white">
    <div
        class="h-full bg-contain bg-no-repeat bg-center"
        style="background-image: url('{app.banner}');"
    />
</header>
<div class="p-4 space-y-4">
    <div class="flex gap-4 items-center">
        <img src={app.icon} alt="icon" class="object-cover h-28 w-28 rounded-2xl p-2 bg-white" />
        <div>
            <h3 class="h3">{ts(app.name)}</h3>
            <div class="text-sm text-surface-700-200-token mb-2">{app.developer}</div>
            <AppButton {app} {containerEngines} {installedApps} />
        </div>
    </div>
    <div class="flex gap-2">
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
            <a class="chip variant-soft hover:variant-filled" href={link.url} target="_blank">
                <span><ExternalLink class="h-4 w-4" /></span>
                <span>{ts(link.name)}</span>
            </a>
        {/each}
    </div>
    <div class="grid grid-cols-[auto_1fr_auto] gap-4 items-center">
        <!-- Button: Left -->
        {#if app.screenshots.length > 1}
            <button type="button" class="btn-icon variant-filled" on:click={multiColumnLeft}>
                <ArrowLeft />
            </button>
        {/if}
        <!-- Carousel -->
        <div
            bind:this={elemScreenshots}
            class="snap-x snap-mandatory scroll-smooth flex gap-2 overflow-x-auto pb-4"
        >
            {#each app.screenshots as screenshot, i}
                <div class="shrink-0 w-[28%] snap-start">
                    <img
                        class="rounded-container-token"
                        src={screenshot}
                        alt="Screenshot {i}"
                        loading="lazy"
                    />
                </div>
            {/each}
        </div>
        <!-- Button-Right -->
        {#if app.screenshots.length > 1}
            <button type="button" class="btn-icon variant-filled" on:click={multiColumnRight}>
                <ArrowRight />
            </button>
        {/if}
    </div>
    <div class="!mt-0">{ts(app.description)}</div>
    <hr />
    <div class="flex divide-x divide-surface-300 dark:divide-surface-600">
        <!-- TODO convert to snippet -->
        <div class="text-center flex flex-col items-center gap-1 px-2">
            <div class="uppercase text-sm">{$i18n.t('discover.apps.category')}</div>
            <div><Shapes class="h-8 w-8" /></div>
            <div>{$i18n.t('marketplace-app.category.' + app.category)}</div>
        </div>
        <div class="text-center flex flex-col items-center gap-1 px-2">
            <div class="uppercase text-sm">{$i18n.t('discover.apps.license')}</div>
            <div><Scale class="h-8 w-8" /></div>
            <div>{app.license}</div>
        </div>
        <div class="text-center flex flex-col items-center gap-1 px-2">
            <div class="uppercase text-sm">{$i18n.t('discover.apps.published-at')}</div>
            <div><Calendar class="h-8 w-8" /></div>
            <div>{dateTimeFormatter.format(new Date(app.publishedAt))}</div>
        </div>
        <a
            href={app.marketplaceUrl}
            target="_blank"
            class="text-center flex flex-col items-center gap-1 px-2 group"
        >
            <div class="uppercase text-sm">{$i18n.t('discover.apps.marketplace')}</div>
            <div><Store class="h-8 w-8" /></div>
            <div class="group-hover:underline">
                {marketplaceUrl.host}{marketplaceUrl.pathname.replace('.git', '')}
            </div>
        </a>
        <div class="text-center flex flex-col items-center gap-1 px-2">
            <div class="uppercase text-sm">{$i18n.t('discover.apps.version')}</div>
            <div><FileStack class="h-8 w-8" /></div>
            <div>{app.version}</div>
        </div>
    </div>
</div>
