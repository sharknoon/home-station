<script lang="ts">
    import type { SvelteComponent } from 'svelte';
    import { enhance } from '$app/forms';
    import { getModalStore } from '@skeletonlabs/skeleton';
    import Save from 'lucide-svelte/icons/save';
    import { i18n } from '$lib/i18n';

    export let parent: SvelteComponent;

    const modalStore = getModalStore();
</script>

{#if $modalStore[0]}
    <form
        method="post"
        action="?/updateMarketplace"
        class="modal-example-form card p-4 w-modal shadow-xl space-y-4"
        on:submit={parent.onClose}
        use:enhance
    >
        <input type="hidden" name="gitRemoteUrl" value={$modalStore[0].meta.gitRemoteUrl} />
        <header class="text-2xl font-bold'">
            {$i18n.t('discover.update-marketplace-modal.title')}
        </header>
        <article>{$i18n.t('discover.update-marketplace-modal.body')}</article>
        <div class="modal-form border border-surface-500 p-4 space-y-4 rounded-container-token">
            <label class="label">
                <span>{$i18n.t('discover.update-marketplace-modal.git-username')}</span>
                <input
                    class="input"
                    type="text"
                    name="gitUsername"
                    value={$modalStore[0].meta.gitUsername ?? ''}
                    placeholder={$i18n.t(
                        'discover.update-marketplace-modal.git-username-placeholder'
                    )}
                />
            </label>
            <label class="label">
                <span>{$i18n.t('discover.update-marketplace-modal.git-password-or-token')}</span>
                <input
                    class="input"
                    type="password"
                    name="gitPassword"
                    placeholder={$i18n.t(
                        'discover.update-marketplace-modal.git-password-or-token-placeholder'
                    )}
                />
            </label>
        </div>
        <footer class="modal-footer {parent.regionFooter}">
            <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>
                {$i18n.t('discover.update-marketplace-modal.cancel')}
            </button>
            <button type="submit" class="btn {parent.buttonPositive}">
                <Save class="mr-2" />{$i18n.t('discover.update-marketplace-modal.save')}
            </button>
        </footer>
    </form>
{/if}
