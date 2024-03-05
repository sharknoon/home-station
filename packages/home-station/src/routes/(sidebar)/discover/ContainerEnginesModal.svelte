<script lang="ts">
    import type { SvelteComponent } from 'svelte';
    import { enhance } from '$app/forms';
    import X from 'lucide-svelte/icons/x';
    import type { ContainerEngine } from '$lib/server/containerengines';
    import { i18n } from '$lib/i18n';

    type AvailableContainerEngine = Pick<ContainerEngine, 'id' | 'name' | 'type'>;

    export let appId: string;
    export let marketplaceUrl: string;
    export let availableContainerEngines: AvailableContainerEngine[];
    export let parent: SvelteComponent;

    let form: HTMLFormElement | null = null;
</script>

<div class="card variant-filled shadow-2xl p-4 relative space-y-2">
    <div>
        <h3 class="h3">{$i18n.t('discover.container-engines-modal.select-engine')}</h3>
        <button class="absolute top-2 right-2 btn btn-icon" on:click={parent.onClose}><X /></button>
    </div>
    <p class="text-sm">{$i18n.t('discover.container-engines-modal.select-engine-description')}</p>
    <form
        method="post"
        action="?/installApp"
        class="grid grid-cols-1 md:grid-cols-2 gap-4 !mt-4"
        bind:this={form}
        use:enhance
    >
        <input type="hidden" name="appId" value={appId} />
        <input type="hidden" name="marketplaceId" value={marketplaceUrl} />
        {#each availableContainerEngines as engine}
            <label>
                <input
                    type="radio"
                    name="containerEngineId"
                    class="hidden"
                    value={engine.id}
                    on:change={() => {
                        form?.requestSubmit();
                        parent.onClose();
                    }}
                />
                <div
                    class="card variant-filled hover:shadow-2xl hover:-translate-y-1 border-4 border-secondary-200-700-token p-4 transition-all"
                >
                    <h4 class="h4">{engine.name}</h4>
                    <!-- TODO more info: architecture (e.g. aarch64, x86_64, ...), average cpu utilization, available disk space -->
                </div>
            </label>
        {/each}
    </form>
</div>
