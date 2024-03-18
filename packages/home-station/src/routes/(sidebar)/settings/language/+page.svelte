<script lang="ts">
    import type { ActionData } from './$types';
    import { dev } from '$app/environment';
    import { enhance } from '$app/forms';
    import Save from 'lucide-svelte/icons/save';
    import { i18n } from '$lib/i18n';
    import { sendNotification } from '$lib/notifications';

    export let form: ActionData;

    $: if (form?.success) {
        $i18n.changeLanguage(form.language);
        sendNotification('success', $i18n.t('settings.language.success'));
    } else if (form?.error) {
        sendNotification('error', form.error);
    }

    let formElement: HTMLFormElement;
</script>

<h2 class="h2 mb-4">{$i18n.t("settings.language.language")}</h2>

<form method="post" action="?/updateLanguage" use:enhance bind:this={formElement}>
    <label class="label">
        <span>{$i18n.t('settings.language.language')}</span>
        <select class="select" name="language" on:change={() => formElement.requestSubmit()}>
            {#if dev}
                <option value="cimode" selected={$i18n.language === 'cimode'}>
                    Translation keys
                </option>
            {/if}
            {#each ($i18n.options.supportedLngs || []).filter((l) => l !== 'cimode').sort() as l}
                <option value={l} selected={$i18n.language === l}>
                    {new Intl.DisplayNames([l], { type: 'language' }).of(l)}
                </option>
            {/each}
        </select>
    </label>
</form>
