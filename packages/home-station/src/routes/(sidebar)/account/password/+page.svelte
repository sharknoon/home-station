<script lang="ts">
    import type { ActionData } from './$types';
    import { enhance } from '$app/forms';
    import Save from 'lucide-svelte/icons/save';
    import { i18n } from '$lib/i18n';
    import { sendNotification } from '$lib/notifications';

    export let form: ActionData;

    $: if (form?.success) {
        sendNotification('success', $i18n.t('account.password.success'));
    } else if (form?.oldPassword) {
        sendNotification('error', $i18n.t('account.password.wrong-old-password'));
    } else if (form?.error) {
        sendNotification('error', form.error);
    }

    let password1: string;
    let password2: string;
    $: passwordCorrect = (password1?.length || 0) >= 8;
    $: passwordsEqual = password1 === password2;
</script>

<h2 class="h2 mb-4">{$i18n.t('account.password.password')}</h2>

<form method="post" action="?/updatePassword" class="space-y-4" use:enhance>
    <label class="label">
        <span>{$i18n.t('account.password.old')}</span>
        <input class="input" type="password" name="old-password" required />
    </label>
    <label class="label">
        <span>{$i18n.t('account.password.new')}</span>
        <input class="input" type="password" name="password" bind:value={password1} required />
        <span class="text-sm text-surface-600-300-token">
            {$i18n.t('account.password.requirements')}
        </span>
    </label>
    <label class="label">
        <span>{$i18n.t('account.password.confirm')}</span>
        <input class="input" type="password" bind:value={password2} required />
    </label>
    <button
        type="submit"
        class="btn variant-filled-primary"
        disabled={!passwordsEqual || !passwordCorrect}
    >
        <Save class="mr-2" />{$i18n.t('account.password.save')}
    </button>
</form>
