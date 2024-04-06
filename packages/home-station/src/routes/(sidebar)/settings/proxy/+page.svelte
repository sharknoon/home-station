<script lang="ts">
    import { enhance } from '$app/forms';
    import { i18n } from '$lib/i18n';
    import { SlideToggle, getModalStore } from '@skeletonlabs/skeleton';
    import DomainTestModal from './AddDomainModal.svelte';
    import Plus from 'lucide-svelte/icons/plus';
    import Save from 'lucide-svelte/icons/save';
    import type { ActionData, PageData } from './$types';
    import { invalidateAll } from '$app/navigation';
    import { slide } from 'svelte/transition';
    import { sendNotification } from '$lib/notifications';

    export let data: PageData;
    export let form: ActionData;

    const modalStore = getModalStore();

    let formElement: HTMLFormElement;
    let httpsEnabled = data.httpsEnabled;
    let certificateEmail = data.certificateEmail;

    function onHttpsEnabledChange(event: Event) {
        // Only submit when https is being unchecked
        // When it is being checked, we have to do some validation first
        if (!(event.target as HTMLInputElement)?.checked) {
            formElement.requestSubmit();
        }
    }

    $: {
        if (form?.success) {
            sendNotification('success', $i18n.t('settings.proxy.save-success'));
        }
    }
</script>

<h2 class="h2 mb-4">Proxy</h2>

<form action="?/setHttps" method="post" class="card p-4" use:enhance bind:this={formElement}>
    <header class="flex gap-4 items-center">
        <SlideToggle
            name="httpsEnabled"
            bind:checked={httpsEnabled}
            on:change={onHttpsEnabledChange}
        />
        <div>
            <h3 class="h3">{$i18n.t('settings.proxy.https-certificates')}</h3>
            <p>
                {$i18n.t('settings.proxy.https-certificates-description')}
            </p>
        </div>
    </header>

    {#if httpsEnabled}
        <section
            class="space-y-4 transition mt-4"
            class:opacity-50={!httpsEnabled}
            transition:slide
        >
            <label class="label">
                <span>{$i18n.t('settings.proxy.certificate-email')}</span>
                <input
                    class="input disabled:!opacity-100"
                    type="email"
                    name="email"
                    bind:value={certificateEmail}
                    required
                    disabled={!httpsEnabled}
                />
                <span>
                    {$i18n.t('settings.proxy.certificate-email-description')}
                </span>
            </label>

            <h3 class="h3">{$i18n.t('settings.proxy.domains')}</h3>

            <ul class="list">
                {#each data.domains as domain}
                    <li>
                        <span class="flex-auto">{domain.domain}</span>
                    </li>
                {:else}
                    <li>
                        <span class="flex-auto">{$i18n.t('settings.proxy.no-domains')}</span>
                    </li>
                {/each}
            </ul>

            <button
                class="btn btn-sm variant-filled-secondary disabled:!opacity-100"
                disabled={!httpsEnabled}
                on:click={() =>
                    modalStore.trigger({
                        type: 'component',
                        component: { ref: DomainTestModal },
                        response: () => invalidateAll()
                    })}><Plus class="mr-2" />{$i18n.t('settings.proxy.add-domain')}</button
            >

            <br />

            <button class="btn variant-filled-primary" disabled={!httpsEnabled}>
                <Save class="mr-2" />
                {$i18n.t('settings.proxy.save')}
            </button>
        </section>
    {/if}
</form>
