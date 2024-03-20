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

<div class="card p-4 space-y-1">
    <div class="flex gap-2 items-center">
        <h2 class="h2">{$i18n.t('settings.container-engine.container-engine')}</h2>
        {#if data.stats.up}
            <span class="relative flex h-3 w-3">
                <span
                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400-500-token opacity-75"
                />
                <span class="relative inline-flex rounded-full h-3 w-3 bg-success-400-500-token" />
            </span>
        {:else}
            <span class="rounded-full h-3 w-3 bg-error-400-500-token" />
        {/if}
    </div>
    <div class="flex gap-8">
        <div>
            <Layers class="inline-block mr-2" />
            {#if data.stats.numberOfStacks === undefined}
                {$i18n.t('settings.container-engine.n-a')}
            {:else}
                {$i18n.t('settings.container-engine.number-of-stacks', {
                    count: data.stats.numberOfStacks
                })}
            {/if}
        </div>
        <div>
            <Box class="inline-block mr-2" />
            {#if data.stats.numberOfContainers === undefined}
                {$i18n.t('settings.container-engine.n-a')}
            {:else}
                {$i18n.t('settings.container-engine.number-of-containers', {
                    count: data.stats.numberOfContainers
                })}
            {/if}
        </div>
        <div>
            <Database class="inline-block mr-2" />
            {#if data.stats.numberOfVolumes === undefined}
                {$i18n.t('settings.container-engine.n-a')}
            {:else}
                {$i18n.t('settings.container-engine.number-of-volumes', {
                    count: data.stats.numberOfVolumes
                })}
            {/if}
        </div>
        <div>
            <List class="inline-block mr-2" />
            {#if data.stats.numberOfImages === undefined}
                {$i18n.t('settings.container-engine.n-a')}
            {:else}
                {$i18n.t('settings.container-engine.number-of-images', {
                    count: data.stats.numberOfImages
                })}
            {/if}
        </div>
        <div>
            <Cpu class="inline-block mr-2" />
            {#if data.stats.numberOfCPUs === undefined}
                {$i18n.t('settings.container-engine.n-a')}
            {:else}
                {$i18n.t('settings.container-engine.number-of-Cpus', {
                    count: data.stats.numberOfCPUs
                })}
            {/if}
        </div>
        <div>
            <MemoryStick class="inline-block mr-2" />
            {#if data.stats.totalMemory === undefined}
                {$i18n.t('settings.container-engine.n-a')}
            {:else}
                {$i18n.t('settings.container-engine.total-memory', {
                    value: ((data.stats.totalMemory ?? 0) / 1000 / 1000 / 1000).toFixed(1)
                })}
            {/if}
        </div>
    </div>
    <!-- TODO add docker stats for the entire system (aka all containers) -->
</div>
