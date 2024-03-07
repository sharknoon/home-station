<script lang="ts">
    import type { PageData } from './$types';
    import { i18n, ts } from '$lib/i18n';
    import MoreHorizontal from 'lucide-svelte/icons/more-horizontal';
    import Plus from 'lucide-svelte/icons/plus';
    import { popup } from '@skeletonlabs/skeleton';
    import rocket from './rocket.png';

    export let data: PageData;
</script>

<!-- TODO also implement the specific app settings here via modal -->
{#if data.apps.length > 0}
    <div class="grid grid-cols-6 place-items-center gap-16 m-16">
        {#each data.apps as app, i}
            <a href="https://google.com" class="group flex flex-col items-center">
                <div class="relative">
                    <img
                        src={app.icon}
                        alt={ts(app.name)}
                        class="object-cover h-20 w-20 rounded-2xl p-2 bg-white"
                    />
                    <button
                        class="group-hover:opacity-100 opacity-0 transition absolute right-0 top-0 btn-icon btn-icon-sm variant-filled-tertiary translate-x-[40%] -translate-y-[40%]"
                        on:click|preventDefault={() => {}}
                        use:popup={{ event: 'click', target: `popupApp-${i}` }}
                    >
                        <MoreHorizontal class="h-6 w-6" />
                    </button>
                    <div class="card p-4 w-72 shadow-xl" data-popup="popupApp-{i}">
                        <ul class="list">
                            <li>
                                <span>(icon)</span>
                                <span class="flex-auto">Open in marketplace</span>
                            </li>
                            <li>
                                <span>(icon)</span>
                                <span class="flex-auto">Settings</span>
                            </li>
                            <li>
                                <span>(icon)</span>
                                <span class="flex-auto">Remove app</span>
                            </li>
                        </ul>
                        <div class="arrow bg-surface-100-800-token" />
                    </div>
                </div>
                <div class="mt-2">
                    {ts(app.name)}
                </div>
            </a>
        {/each}
    </div>
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
