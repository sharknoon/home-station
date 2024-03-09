<script lang="ts">
    import type { Icon } from 'lucide-svelte';
    import LayoutGrid from 'lucide-svelte/icons/layout-grid';
    import Settings from 'lucide-svelte/icons/settings';
    import Sparkles from 'lucide-svelte/icons/sparkles';
    import ChevronDown from 'lucide-svelte/icons/chevron-down';
    import LogOut from 'lucide-svelte/icons/log-out';
    import Search from 'lucide-svelte/icons/search';
    import CircleUserRound from 'lucide-svelte/icons/circle-user-round';
    import SimpleIcons from '$lib/components/SimpleIcons.svelte';
    import { siGithub } from 'simple-icons';
    import type { LayoutData } from './$types';
    import { enhance } from '$app/forms';
    import { page } from '$app/stores';
    import {
        AppShell,
        AppBar,
        Autocomplete,
        popup,
        type AutocompleteOption,
        type PopupSettings,
        AppRailAnchor,
        AppRail,
        getToastStore,
        AppRailTile,
        LightSwitch
    } from '@skeletonlabs/skeleton';
    import { onMount, type ComponentType } from 'svelte';
    import { goto } from '$app/navigation';
    import { slide } from 'svelte/transition';
    import { i18n } from '$lib/i18n';

    export let data: LayoutData;

    // Sidebar

    let appRailItems: {
        title: string;
        icon: ComponentType<Icon>;
        href?: string;
        submenu?: {
            title: string;
            list: {
                href: string;
                label: string;
                badge?: string;
            }[];
        }[];
    }[] = [];
    let currentItem = 0;
    $: appRailItems = [
        {
            title: $i18n.t('sidebar.my-apps'),
            icon: LayoutGrid,
            href: '/'
        },
        {
            title: $i18n.t('sidebar.discover'),
            icon: Sparkles,
            href: '/discover'
        },
        {
            title: $i18n.t('sidebar.settings.settings'),
            icon: Settings,
            submenu: [
                {
                    title: $i18n.t('sidebar.settings.general'),
                    list: [
                        { label: $i18n.t('sidebar.settings.users'), href: '/settings/users' },
                        {
                            label: $i18n.t('sidebar.settings.container-engines'),
                            href: '/settings/container-engines'
                        },
                        {
                            label: $i18n.t('sidebar.settings.domains-and-hostnames'),
                            href: '/settings/domains-and-hostnames'
                        }
                    ]
                },
                {
                    title: $i18n.t('sidebar.settings.system'),
                    list: [
                        { label: $i18n.t('sidebar.settings.tasks'), href: '/settings/tasks' },
                        { label: $i18n.t('sidebar.settings.logs'), href: '/settings/logs' },
                        { label: $i18n.t('sidebar.settings.about'), href: '/settings/about' }
                    ]
                }
            ]
        }
    ];

    function findCurrentItem(path: string) {
        return appRailItems.findIndex((item) => {
            let hrefs = [item.href];
            if (!item.href) {
                hrefs =
                    item.submenu?.flatMap((segment) => segment.list.map((item) => item.href)) ?? [];
            }
            return hrefs.some((href) => href?.includes(path));
        });
    }

    // TODO not an ideal situation: it flashes on hydration. Solution: wait for Svelte 5s effect runes
    onMount(() => {
        currentItem = findCurrentItem(new URL(data.url).pathname);
        page.subscribe((value) => {
            if (value) {
                currentItem = findCurrentItem(value.url.pathname);
            }
        });
    });

    $: submenuItemActive = (href: string) =>
        $page.url.pathname?.includes(href) ? 'bg-primary-active-token' : '';

    // eslint-disable-next-line no-undef
    const REPOSITORY_URL = __REPOSITORY_URL__;

    // Toast

    const toastStore = getToastStore();
    if (!data.appDataPersistency.isPersistent) {
        toastStore.trigger({
            message: $i18n.t('sidebar.toast-missing-mount', {
                path: data.appDataPersistency.defaultAppDataPath
            }),
            background: 'variant-filled-warning',
            hideDismiss: true,
            timeout: 2147483647 // This is an important warning and should never disappear, until the user has fixed the issue
        });
    }

    // Seachbar

    let searchPopupSettings: PopupSettings = {
        event: 'focus-click',
        target: 'popupSearch',
        placement: 'bottom'
    };
    let searchInput = '';
    const searchOptions: AutocompleteOption<string>[] = [
        // TODO
        { label: 'Vanilla', value: 'vanilla', keywords: 'plain, basic', meta: { healthy: false } },
        {
            label: 'Chocolate',
            value: 'chocolate',
            keywords: 'dark, white',
            meta: { healthy: false }
        },
        { label: 'Strawberry', value: 'strawberry', keywords: 'fruit', meta: { healthy: true } },
        {
            label: 'Neapolitan',
            value: 'neapolitan',
            keywords: 'mix, strawberry, chocolate, vanilla',
            meta: { healthy: false }
        },
        { label: 'Pineapple', value: 'pineapple', keywords: 'fruit', meta: { healthy: true } },
        { label: 'Peach', value: 'peach', keywords: 'fruit', meta: { healthy: true } }
    ];
    function onSelection(event: CustomEvent<AutocompleteOption<string>>): void {
        searchInput = event.detail.label;
    }
</script>

<AppShell>
    <svelte:fragment slot="header">
        <AppBar class="shadow-2xl" slotDefault="flex justify-center">
            <svelte:fragment slot="lead">
                <h1 class="h1 leading-8 -translate-y-1">
                    <span
                        class="bg-gradient-to-br from-primary-500 to-secondary-500 bg-clip-text text-transparent box-decoration-clone font-bold"
                    >
                        {$i18n.t('brand.title')}
                    </span>
                </h1>
            </svelte:fragment>
            <div class="relative w-96">
                <Search class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 z-10" />
                <input
                    type="search"
                    class="input variant-soft autocomplete pl-12"
                    placeholder={$i18n.t('sidebar.search')}
                    bind:value={searchInput}
                    use:popup={searchPopupSettings}
                />
                <div
                    class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto"
                    tabindex="-1"
                    data-popup="popupSearch"
                >
                    <Autocomplete
                        bind:input={searchInput}
                        options={searchOptions}
                        on:selection={onSelection}
                    />
                </div>
            </div>
            <svelte:fragment slot="trail">
                <LightSwitch />
                <button
                    class="btn variant-soft-primary"
                    use:popup={{ event: 'click', target: 'avatarClick', placement: 'bottom-end' }}
                >
                    <span class="-translate-y-[0.1rem]">{data.user?.username}</span>
                    <ChevronDown />
                </button>
                <form
                    method="post"
                    class="card p-4 shadow-xl w-max"
                    data-popup="avatarClick"
                    use:enhance
                >
                    <nav class="list-nav">
                        <ul>
                            <li>
                                <a href="/account">
                                    <CircleUserRound class="h-6" />
                                    <span>{$i18n.t('sidebar.account')}</span>
                                </a>
                            </li>
                            <li>
                                <button formaction="/?/logout">
                                    <LogOut class="h-6" />
                                    <span>{$i18n.t('sidebar.sign-out')}</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </form>
            </svelte:fragment>
        </AppBar>
    </svelte:fragment>
    <svelte:fragment slot="sidebarLeft">
        <div
            class="grid grid-cols-[auto_1fr] h-full bg-surface-50-900-token border-r border-surface-500/30"
        >
            <!-- App Rail -->
            <AppRail background="bg-transparent" border="border-r border-surface-500/30">
                {#each appRailItems as { title, icon, href }, i}
                    <AppRailTile
                        bind:group={currentItem}
                        name={'item-' + i}
                        value={i}
                        {title}
                        class="[&>button]:transition"
                        on:click={() => (href ? goto(href) : {})}
                    >
                        <svelte:fragment slot="lead">
                            <svelte:component this={icon} class="inline-block" />
                        </svelte:fragment>
                        <span>{title}</span>
                    </AppRailTile>
                {/each}
                <svelte:fragment slot="trail">
                    <AppRailAnchor href={REPOSITORY_URL} target="_blank" title="GitHub">
                        <svelte:fragment slot="lead">
                            <SimpleIcons icon={siGithub} />
                        </svelte:fragment>
                    </AppRailAnchor>
                </svelte:fragment>
            </AppRail>
            {#if appRailItems[currentItem]?.submenu}
                {@const submenu = appRailItems[currentItem].submenu ?? []}
                <section
                    class="p-4 pb-20 space-y-4 overflow-y-auto w-64"
                    transition:slide={{ axis: 'x' }}
                >
                    {#each submenu as segment, i}
                        <!-- Title -->
                        <p class="font-bold pl-4 text-2xl">{segment.title}</p>
                        <!-- Nav List -->
                        <nav class="list-nav">
                            <ul>
                                {#each segment.list as { href, label, badge }}
                                    <li>
                                        <a {href} class={submenuItemActive(href)}>
                                            <span class="flex-auto truncate">{label}</span>
                                            {#if badge}
                                                <span class="badge variant-filled-secondary">
                                                    {badge}
                                                </span>
                                            {/if}
                                        </a>
                                    </li>
                                {/each}
                            </ul>
                        </nav>
                        <!-- Divider -->
                        {#if i + 1 < submenu.length}<hr class="!my-6 opacity-50" />{/if}
                    {/each}
                </section>
            {/if}
        </div>
    </svelte:fragment>

    <div class="container mx-auto p-4 h-full">
        <slot />
    </div>
</AppShell>
