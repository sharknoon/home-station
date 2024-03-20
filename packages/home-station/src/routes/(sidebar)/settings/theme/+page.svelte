<script lang="ts">
    import type { ActionData, PageData } from './$types';
    import { enhance } from '$app/forms';
    import PaintRoller from 'lucide-svelte/icons/paint-roller';
    import { themes, applyTheme } from '$lib/theme';
    import { i18n } from '$lib/i18n';
    import { sendNotification } from '$lib/notifications';

    export let data: PageData;
    export let form: ActionData;

    $: if (form?.success) {
        applyTheme(form.theme);
        sendNotification('success', $i18n.t('settings.theme.success'));
    } else if (form?.error) {
        sendNotification('error', form.error);
    }
</script>

<h2 class="h2 mb-4">{$i18n.t('settings.theme.theme')}</h2>

<div class="grid grid-cols-3 gap-4">
    {#each themes as theme}
        <form
            method="post"
            action="?/updateTheme"
            class="card p-4"
            data-theme={theme.name}
            use:enhance
            on:mouseover={() => applyTheme(theme.name)}
            on:focus={() => applyTheme(theme.name)}
            on:mouseout={() => applyTheme(data.user?.theme)}
            on:blur={() => applyTheme(data.user?.theme)}
        >
            <input type="hidden" name="theme" value={theme.name} />
            <div class="flex items-center gap-4">
                <h2 class="h2 capitalize">
                    {theme.icon}
                    {theme.name.replace('-', ' ')}
                </h2>
                {#if data.user?.theme === theme.name}
                    <span class="badge variant-filled-secondary">
                        {$i18n.t('settings.theme.active')}
                    </span>
                {/if}
            </div>
            <button type="submit" class="btn variant-filled-primary mt-4" disabled={false}>
                <PaintRoller class="mr-2" />{$i18n.t('settings.theme.apply')}
            </button>
        </form>
    {/each}
</div>
