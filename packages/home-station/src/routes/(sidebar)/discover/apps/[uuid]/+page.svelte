<script lang="ts">
    import type { PageData } from './$types';
    import { enhance } from '$app/forms';
    import { getModalStore } from '@skeletonlabs/skeleton';
    import ExternalLink from 'lucide-svelte/icons/external-link';
    import Globe from 'lucide-svelte/icons/globe';
    import Code from 'lucide-svelte/icons/code';
    import ArrowLeft from 'lucide-svelte/icons/arrow-left';
    import ArrowRight from 'lucide-svelte/icons/arrow-right';
    import Scale from 'lucide-svelte/icons/scale';
    import Shapes from 'lucide-svelte/icons/shapes';
    import Calendar from 'lucide-svelte/icons/calendar';
    import Store from 'lucide-svelte/icons/store';
    import SquareUserRound from 'lucide-svelte/icons/square-user-round';
    import FileStack from 'lucide-svelte/icons/file-stack';
    import Trash_2 from 'lucide-svelte/icons/trash-2';
    import { i18n, ts } from '$lib/i18n';
    import AppButton from '../../AppButton.svelte';

    export let data: PageData;

    // shields.io badge for GitHub / GitLab stars

    let shieldsUrl: string | undefined = undefined;
    if (data.app.links.repository.includes('github.com')) {
        const regex = /github\.com\/([^/.]+)\/([^/.]+)/;
        const match = data.app.links.repository.match(regex);
        if (match) {
            shieldsUrl = `https://img.shields.io/github/stars/${match[1]}/${match[2]}?style=social`;
        }
    } else if (data.app.links.repository.includes('gitlab')) {
        // I know not every gitlab instance has gitlab in its url, but I don't know any better way of detecting this
        const regex = /\/([^/.]+)\/([^/.]+)/;
        const match = data.app.links.repository.match(regex);
        if (match) {
            shieldsUrl = `https://img.shields.io/gitlab/stars/${match[1]}%2F${match[2]}?style=social`;
        }
    }

    // Uninstall button

    const modalStore = getModalStore();

    // Screenshots

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

    // Details at the bottom

    const dateTimeFormatter = new Intl.DateTimeFormat($i18n.language, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    $: marketplaceUrl = new URL(data.app.marketplaceUrl);
</script>

<header class="h-32 max-h-32 p-2 bg-white">
    <div
        class="h-full bg-contain bg-no-repeat bg-center"
        style="background-image: url('{data.app.banner}');"
    />
</header>
<div class="p-4 space-y-6">
    <div class="flex gap-4 items-center">
        <img
            src={data.app.icon}
            alt="icon"
            class="object-cover h-28 w-28 rounded-2xl p-2 bg-white"
        />
        <div>
            <h3 class="h3 mb-1">{ts(data.app.name)}</h3>
            {#if shieldsUrl}
                <img alt="GitHub Repo stars" class="mb-2" src={shieldsUrl} />
            {/if}
            <div class="flex gap-4">
                <AppButton app={data.app} installedApps={data.installedApps} />
                {#if data.installedApps.some((a) => a.uuid === data.app.uuid)}
                    <form method="post" action="/?/uninstallApp" use:enhance>
                        <input
                            type="hidden"
                            name="marketplaceUrl"
                            value={data.app.marketplaceUrl}
                        />
                        <input type="hidden" name="appUuid" value={data.app.uuid} />
                        <input type="hidden" name="version" value={data.app.version} />
                        <button
                            type="button"
                            class="btn variant-ringed-error"
                            on:click={async ({ currentTarget }) => {
                                modalStore.trigger({
                                    type: 'confirm',
                                    title: $i18n.t('discover.apps.remove-app'),
                                    body: $i18n.t('discover.apps.remove-app-text', {
                                        name: ts(data.app.name)
                                    }),
                                    buttonTextCancel: $i18n.t('discover.apps.cancel'),
                                    buttonTextConfirm: $i18n.t('discover.apps.remove'),
                                    response: (r) => r && currentTarget.form?.requestSubmit()
                                });
                            }}
                        >
                            <Trash_2 class="mr-2" />
                            {$i18n.t('discover.apps.uninstall')}
                        </button>
                    </form>
                {/if}
            </div>
        </div>
    </div>
    <div class="flex gap-2">
        {#if data.app.links.website}
            <a
                class="chip variant-soft hover:variant-filled"
                href={data.app.links.website}
                target="_blank"
            >
                <span><Globe class="h-4 w-4" /></span>
                <span>{$i18n.t('discover.links.website')}</span>
            </a>
        {/if}
        {#if data.app.links.repository}
            <a
                class="chip variant-soft hover:variant-filled"
                href={data.app.links.repository}
                target="_blank"
            >
                <span><Code class="h-4 w-4" /></span>
                <span>{$i18n.t('discover.links.repository')}</span>
            </a>
        {/if}
        {#each data.app.links.custom ?? [] as link}
            <a class="chip variant-soft hover:variant-filled" href={link.url} target="_blank">
                <span><ExternalLink class="h-4 w-4" /></span>
                <span>{ts(link.name)}</span>
            </a>
        {/each}
    </div>
    <div class="grid grid-cols-[auto_1fr_auto] gap-4 items-center">
        <!-- Button: Left -->
        {#if data.app.screenshots.length > 1}
            <button type="button" class="btn-icon variant-filled" on:click={multiColumnLeft}>
                <ArrowLeft />
            </button>
        {/if}
        <!-- Carousel -->
        <div
            bind:this={elemScreenshots}
            class="snap-x snap-mandatory scroll-smooth flex gap-4 overflow-x-auto pb-4"
        >
            {#each data.app.screenshots as screenshot, i}
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
        {#if data.app.screenshots.length > 1}
            <button type="button" class="btn-icon variant-filled" on:click={multiColumnRight}>
                <ArrowRight />
            </button>
        {/if}
    </div>
    <div class="!mt-2">{ts(data.app.description)}</div>
    <hr />
    <div class="flex divide-x divide-surface-300 dark:divide-surface-600">
        <!-- TODO convert to snippet -->
        <div class="text-center flex flex-col items-center gap-1 px-4">
            <div class="uppercase text-sm">{$i18n.t('discover.apps.category')}</div>
            <div><Shapes class="h-8 w-8" /></div>
            <div>{$i18n.t('marketplace-app.category.' + data.app.category)}</div>
        </div>
        <div class="text-center flex flex-col items-center gap-1 px-4">
            <div class="uppercase text-sm">{$i18n.t('discover.apps.developer')}</div>
            <div><SquareUserRound class="h-8 w-8" /></div>
            <div>{data.app.developer}</div>
        </div>
        <div class="text-center flex flex-col items-center gap-1 px-4">
            <div class="uppercase text-sm">{$i18n.t('discover.apps.license')}</div>
            <div><Scale class="h-8 w-8" /></div>
            <div>{data.app.license}</div>
        </div>
        <div class="text-center flex flex-col items-center gap-1 px-4">
            <div class="uppercase text-sm">{$i18n.t('discover.apps.published-at')}</div>
            <div><Calendar class="h-8 w-8" /></div>
            <div>{dateTimeFormatter.format(new Date(data.app.publishedAt))}</div>
        </div>
        <a
            href={data.app.marketplaceUrl}
            target="_blank"
            class="text-center flex flex-col items-center gap-1 px-4 group"
        >
            <div class="uppercase text-sm">{$i18n.t('discover.apps.marketplace')}</div>
            <div><Store class="h-8 w-8" /></div>
            <div class="group-hover:underline">
                {marketplaceUrl.host}{marketplaceUrl.pathname.replace('.git', '')}
            </div>
        </a>
        <div class="text-center flex flex-col items-center gap-1 px-4">
            <div class="uppercase text-sm">{$i18n.t('discover.apps.version')}</div>
            <div><FileStack class="h-8 w-8" /></div>
            <div>{data.app.version}</div>
        </div>
    </div>
</div>
