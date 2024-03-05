<script lang="ts">
    import Box from 'lucide-svelte/icons/box';
    import Cpu from 'lucide-svelte/icons/cpu';
    import Database from 'lucide-svelte/icons/database';
    import Layers from 'lucide-svelte/icons/layers';
    import List from 'lucide-svelte/icons/list';
    import MemoryStick from 'lucide-svelte/icons/memory-stick';
    import type { PageData } from './$types';
    import { i18n } from '$lib/i18n';

    export let data: PageData;
</script>

<h2 class="h2 mb-4">{$i18n.t('settings.container-engines.container-engines')}</h2>

<section class="flex flex-col gap-4">
    {#each data.containerEngines as containerEngine}
        <div class="card p-4 space-y-1">
            <div class="badge variant-filled">
                {#if containerEngine.type === 'local'}
                    {$i18n.t('settings.container-engines.local')}
                {:else}
                    {$i18n.t('settings.container-engines.remote')}
                {/if}
            </div>
            <div class="flex gap-2 items-center">
                <h2 class="h2">{containerEngine.name}</h2>
                {#if containerEngine.up}
                    <span class="relative flex h-3 w-3">
                        <span
                            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400-500-token opacity-75"
                        />
                        <span
                            class="relative inline-flex rounded-full h-3 w-3 bg-success-400-500-token"
                        />
                    </span>
                {:else}
                    <span class="rounded-full h-3 w-3 bg-error-400-500-token" />
                {/if}
            </div>
            <div class="flex gap-8">
                <div>
                    <Layers class="inline-block mr-2" />
                    {#if containerEngine.numberOfStacks === undefined}
                        {$i18n.t('settings.container-engines.n-a')}
                    {:else}
                        {$i18n.t('settings.container-engines.number-of-stacks', {
                            count: containerEngine.numberOfStacks
                        })}
                    {/if}
                </div>
                <div>
                    <Box class="inline-block mr-2" />
                    {#if containerEngine.numberOfContainers === undefined}
                        {$i18n.t('settings.container-engines.n-a')}
                    {:else}
                        {$i18n.t('settings.container-engines.number-of-containers', {
                            count: containerEngine.numberOfContainers
                        })}
                    {/if}
                </div>
                <div>
                    <Database class="inline-block mr-2" />
                    {#if containerEngine.numberOfVolumes === undefined}
                        {$i18n.t('settings.container-engines.n-a')}
                    {:else}
                        {$i18n.t('settings.container-engines.number-of-volumes', {
                            count: containerEngine.numberOfVolumes
                        })}
                    {/if}
                </div>
                <div>
                    <List class="inline-block mr-2" />
                    {#if containerEngine.numberOfImages === undefined}
                        {$i18n.t('settings.container-engines.n-a')}
                    {:else}
                        {$i18n.t('settings.container-engines.number-of-images', {
                            count: containerEngine.numberOfImages
                        })}
                    {/if}
                </div>
                <div>
                    <Cpu class="inline-block mr-2" />
                    {#if containerEngine.numberOfCPUs === undefined}
                        {$i18n.t('settings.container-engines.n-a')}
                    {:else}
                        {$i18n.t('settings.container-engines.number-of-Cpus', {
                            count: containerEngine.numberOfCPUs
                        })}
                    {/if}
                </div>
                <div>
                    <MemoryStick class="inline-block mr-2" />
                    {#if containerEngine.totalMemory === undefined}
                        {$i18n.t('settings.container-engines.n-a')}
                    {:else}
                        {$i18n.t('settings.container-engines.total-memory', {
                            value: (
                                (containerEngine.totalMemory ?? 0) /
                                1000 /
                                1000 /
                                1000
                            ).toFixed(1)
                        })}
                    {/if}
                </div>
            </div>
        </div>
    {/each}
</section>
