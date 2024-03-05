<script lang="ts">
    import type { PageData } from './$types';
    import { ts } from '$lib/i18n';
    import MoreHorizontal from 'lucide-svelte/icons/more-horizontal';
    import { popup } from '@skeletonlabs/skeleton';

    export let data: PageData;
</script>

<!-- TODO also implement the specific app settings here via modal -->
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
                    use:popup={{event: 'click', target: `popupApp-${i}`}}
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
