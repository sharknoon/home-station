<script lang="ts">
    import type { SvelteComponent } from 'svelte';
    import { getModalStore } from '@skeletonlabs/skeleton';
    import X from 'lucide-svelte/icons/x';
    import type { containerEngines } from '$lib/server/schema';
    import i18n from '$lib/i18n';

    type ContainerEngine = Pick<typeof containerEngines.$inferSelect, 'id' | 'name' | 'type'>;

    export let availableContainerEngines: ContainerEngine[];
    export let parent: SvelteComponent;

    const modalStore = getModalStore();

    function onContainerEngineSelected(engine: ContainerEngine) {
        if ($modalStore[0].response) {
            $modalStore[0].response(engine.id);
        }
        modalStore.close();
    }
</script>

<div class="card variant-filled shadow-2xl p-4 relative space-y-2">
    <div>
        <h3 class="h3">{$i18n.t('discover.container-engines-modal.select-engine')}</h3>
        <button class="absolute top-2 right-2 btn btn-icon" on:click={parent.onClose}><X /></button>
    </div>
    <p class="text-sm">{$i18n.t('discover.container-engines-modal.select-engine-description')}</p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 !mt-4">
        {#each availableContainerEngines as engine}
            <button
                type="button"
                class="card variant-filled hover:shadow-2xl hover:-translate-y-1 border-4 border-secondary-200-700-token p-4 transition-all"
                on:click={() => onContainerEngineSelected(engine)}
            >
                <h4 class="h4">{engine.name}</h4>
                <!-- TODO more info: architecture (e.g. aarch64, x86_64, ...), average cpu utilization, available disk space -->
            </button>
        {/each}
    </div>
</div>
