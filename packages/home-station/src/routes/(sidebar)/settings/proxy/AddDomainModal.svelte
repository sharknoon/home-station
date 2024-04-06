<script lang="ts">
    import type { SvelteComponent } from 'svelte';
    import { getModalStore } from '@skeletonlabs/skeleton';
    import { i18n } from '$lib/i18n';
    import { sendNotification } from '$lib/notifications';
    import TriangleAlert from 'lucide-svelte/icons/triangle-alert';

    export let parent: SvelteComponent;

    const modalStore = getModalStore();

    let domain = '';
    let domainValidationError = false;

    async function addDomain() {
        const result = await fetch(`/settings/proxy?domain=${domain}`, { method: 'POST' });
        if (result.ok) {
            sendNotification('success', $i18n.t('settings.proxy.add-domain-modal.success'));
            $modalStore[0]?.response?.(true);
            parent.onClose();
        } else {
            domainValidationError = true;
        }
    }
</script>

{#if $modalStore[0]}
    <div class="card p-4 w-modal shadow-xl space-y-4">
        <header class="text-2xl font-bold'">
            {$i18n.t('settings.proxy.add-domain-modal.title')}
        </header>
        <article>{$i18n.t('settings.proxy.add-domain-modal.body')}</article>
        <label class="label">
            <span>{$i18n.t('settings.proxy.add-domain-modal.domain')}</span>
            <input
                class="input"
                type="text"
                bind:value={domain}
                placeholder={$i18n.t('settings.proxy.add-domain-modal.domain-placeholder')}
            />
        </label>
        {#if domainValidationError}
            <aside class="alert variant-filled-error">
                <div><TriangleAlert /></div>
                <div class="alert-message">
                    <h3 class="h3">{$i18n.t('settings.proxy.add-domain-modal.error')}</h3>
                    <p>{$i18n.t('settings.proxy.add-domain-modal.error-body')}</p>
                </div>
            </aside>
        {/if}
        <footer class="modal-footer {parent.regionFooter}">
            <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>
                {$i18n.t('settings.proxy.add-domain-modal.cancel')}
            </button>
            <button class="btn {parent.buttonPositive}" on:click={addDomain}>
                {$i18n.t('settings.proxy.add-domain-modal.add-domain')}
            </button>
        </footer>
    </div>
{/if}
