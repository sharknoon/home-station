<script lang="ts">
    import type { PageData } from './$types';
    import { enhance } from '$app/forms';
    import Ellipsis from 'lucide-svelte/icons/ellipsis';
    import Plus from 'lucide-svelte/icons/plus';
    import Store from 'lucide-svelte/icons/store';
    import Trash_2 from 'lucide-svelte/icons/trash-2';
    import Settings from 'lucide-svelte/icons/settings';
    import { Accordion, AccordionItem, getModalStore, popup } from '@skeletonlabs/skeleton';
    import { i18n, ts } from '$lib/i18n';
    import rocket from './rocket.png';
    import { goto } from '$app/navigation';
    import type { InstalledApp } from '$lib/server/apps';
    import { dev } from '$app/environment';

    export let data: PageData;

    const modalStore = getModalStore();

    function onAppClick(id: InstalledApp['id'], launchOptions: InstalledApp['launchOptions']) {
        if (!launchOptions || launchOptions.length === 0) {
            // If the app has no HTTP route, we open the settings page
            goto('/apps/' + encodeURIComponent(id));
        } else if (launchOptions.length === 1) {
            // If the app has only one HTTP route, we open it in a new tab
            const host = dev ? 'localhost' : window.location.host;
            window.open(`http://${launchOptions[0].subdomain}.${host}`, '_blank');
        } else {
            modalStore.trigger({
                type: 'component',
                component: 'appLaunchOptionsModal',
                meta: { launchOptions }
            });
        }
    }
</script>

{#if data.apps.length > 0}
    <div class="grid grid-cols-6 place-items-center">
        {#each data.apps.filter((a) => a.status === 'running') as app, i}
            <button
                on:click={() => onAppClick(app.id, app.launchOptions)}
                class="group flex flex-col items-center m-16"
            >
                <!-- TODO convert to snippet -->
                <div class="relative">
                    <img
                        src={app.icon}
                        alt={ts(app.name)}
                        class="object-cover h-20 w-20 rounded-2xl p-2 bg-white transition-all hover:shadow-xl hover:scale-[103%]"
                    />
                    <button
                        class="group-hover:opacity-100 opacity-0 transition absolute right-0 top-0 btn-icon btn-icon-sm variant-filled-tertiary translate-x-[40%] -translate-y-[40%]"
                        on:click|stopPropagation
                        use:popup={{ event: 'click', target: `popupApp-${i}` }}
                    >
                        <Ellipsis class="h-6 w-6" />
                    </button>
                    <div class="card p-4 w-max shadow-xl" data-popup="popupApp-{i}">
                        <nav class="list-nav">
                            <ul>
                                <li>
                                    <a
                                        href="/discover/apps/{encodeURIComponent(app.id)}"
                                        on:click|stopPropagation
                                    >
                                        <Store class="h-6" />
                                        <span class="flex-auto text-left">
                                            {$i18n.t('my-apps.open-in-marketplace')}
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/apps/{encodeURIComponent(app.id)}"
                                        on:click|stopPropagation
                                    >
                                        <Settings class="h-6" />
                                        <span class="flex-auto text-left">
                                            {$i18n.t('my-apps.settings')}
                                        </span>
                                    </a>
                                </li>
                                <li class="text-error-500-400-token">
                                    <form method="post" action="?/uninstallApp" use:enhance>
                                        <input type="hidden" name="appId" value={app.id} />
                                        <button
                                            type="button"
                                            class="w-full text-left"
                                            on:click|stopPropagation={async ({ currentTarget }) => {
                                                modalStore.trigger({
                                                    type: 'confirm',
                                                    title: $i18n.t('my-apps.remove-app'),
                                                    body: $i18n.t('my-apps.remove-app-text', {
                                                        name: ts(app.name)
                                                    }),
                                                    buttonTextCancel: $i18n.t('my-apps.cancel'),
                                                    buttonTextConfirm: $i18n.t('my-apps.remove'),
                                                    response: (r) =>
                                                        r && currentTarget.form?.requestSubmit()
                                                });
                                            }}
                                        >
                                            <Trash_2 class="h-6" />
                                            <span class="flex-auto">
                                                {$i18n.t('my-apps.remove-app')}
                                            </span>
                                        </button>
                                    </form>
                                </li>
                            </ul>
                        </nav>
                        <div class="arrow bg-surface-100-800-token" />
                    </div>
                </div>
                <div class="mt-2">
                    {ts(app.name)}
                </div>
            </button>
        {/each}
        <a href="/discover">
            <div
                class="h-20 w-20 rounded-2xl border border-secondary-600-300-token border-dashed flex items-center justify-center transition-all hover:scale-[103%]"
            >
                <Plus class="h-12 w-12 text-secondary-600-300-token" />
            </div>
            <div class="h-8" />
        </a>
    </div>
    <!-- Accordion for stopped or errorneous apps -->
    {#if data.apps.filter((a) => a.status !== 'running').length > 0}
        <Accordion>
            <AccordionItem>
                <svelte:fragment slot="summary">{$i18n.t('my-apps.stopped-apps')}</svelte:fragment>
                <svelte:fragment slot="content">
                    <div class="grid grid-cols-6 place-items-center m-16">
                        {#each data.apps.filter((a) => a.status !== 'running') as app, i}
                            <div class="group flex flex-col items-center">
                                <div class="relative">
                                    <img
                                        src={app.icon}
                                        alt={ts(app.name)}
                                        class="object-cover h-20 w-20 rounded-2xl p-2 bg-white grayscale"
                                    />
                                    <button
                                        class="group-hover:opacity-100 opacity-0 transition absolute right-0 top-0 btn-icon btn-icon-sm variant-filled-tertiary translate-x-[40%] -translate-y-[40%]"
                                        on:click|preventDefault={() => {}}
                                        use:popup={{ event: 'click', target: `popupApp-${i}` }}
                                    >
                                        <Ellipsis class="h-6 w-6" />
                                    </button>
                                    <form
                                        method="post"
                                        class="card p-4 w-max shadow-xl"
                                        data-popup="popupApp-{i}"
                                        use:enhance
                                    >
                                        <nav class="list-nav">
                                            <ul>
                                                <li>
                                                    <a
                                                        href="/discover/apps/{encodeURIComponent(
                                                            app.id
                                                        )}"
                                                        on:click|stopPropagation
                                                    >
                                                        <Store class="h-6" />
                                                        <span class="flex-auto text-left">
                                                            {$i18n.t('my-apps.open-in-marketplace')}
                                                        </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        href="/apps/{encodeURIComponent(app.id)}"
                                                        on:click|stopPropagation
                                                    >
                                                        <Settings class="h-6" />
                                                        <span class="flex-auto text-left">
                                                            {$i18n.t('my-apps.settings')}
                                                        </span>
                                                    </a>
                                                </li>
                                                <li class="text-error-500-400-token">
                                                    <form
                                                        method="post"
                                                        action="?/uninstallApp"
                                                        use:enhance
                                                    >
                                                        <input
                                                            type="hidden"
                                                            name="appId"
                                                            value={app.id}
                                                        />
                                                        <button
                                                            type="button"
                                                            class="w-full text-left"
                                                            on:click|stopPropagation={async ({
                                                                currentTarget
                                                            }) => {
                                                                modalStore.trigger({
                                                                    type: 'confirm',
                                                                    title: $i18n.t(
                                                                        'my-apps.remove-app'
                                                                    ),
                                                                    body: $i18n.t(
                                                                        'my-apps.remove-app-text',
                                                                        {
                                                                            name: ts(app.name)
                                                                        }
                                                                    ),
                                                                    buttonTextCancel:
                                                                        $i18n.t('my-apps.cancel'),
                                                                    buttonTextConfirm:
                                                                        $i18n.t('my-apps.remove'),
                                                                    response: (r) =>
                                                                        r &&
                                                                        currentTarget.form?.requestSubmit()
                                                                });
                                                            }}
                                                        >
                                                            <Trash_2 class="h-6" />
                                                            <span class="flex-auto">
                                                                {$i18n.t('my-apps.remove-app')}
                                                            </span>
                                                        </button>
                                                    </form>
                                                </li>
                                            </ul>
                                        </nav>
                                        <div class="arrow bg-surface-100-800-token" />
                                    </form>
                                </div>
                                <div class="mt-2">
                                    {ts(app.name)}
                                </div>
                            </div>
                        {/each}
                    </div>
                </svelte:fragment>
            </AccordionItem>
        </Accordion>
    {/if}
{:else}
    <div class="flex h-full flex-col items-center justify-center gap-4">
        <img src={rocket} alt="rocket" class="h-64 mb-8" />
        <div class="text-center text-xl">
            <div class="mb-2 text-3xl font-black">{$i18n.t('my-apps.no-apps-installed')}</div>
            <div class="mb-2">{$i18n.t('my-apps.add-your-first-app')}</div>
        </div>
        <a href="/discover" class="btn btn-primary variant-filled-primary">
            <Plus />
            <span>{$i18n.t('my-apps.discover-apps')}</span>
        </a>
    </div>
{/if}
