<script lang="ts">
    import type { SvelteComponent } from 'svelte';
    import { getModalStore } from '@skeletonlabs/skeleton';
    import X from 'lucide-svelte/icons/x';

    export let parent: SvelteComponent;

    const modalStore = getModalStore();
</script>

{#if $modalStore[0]}
    <button
        class="btn-icon variant-filled fixed top-4 right-4 z-50 font-bold shadow-xl'"
        on:click={parent.onClose}><X /></button
    >
    <img
        src={$modalStore[0]?.image}
        class="max-w-[90vw] max-h-[90vh] rounded-container-token overflow-hidden shadow-xl"
        alt="gallery"
    />
{/if}
