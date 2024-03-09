<script lang="ts">
    import { Tab, TabGroup } from '@skeletonlabs/skeleton';
    import { i18n } from '$lib/i18n';
    import PaintRoller from 'lucide-svelte/icons/paint-roller';
    import Save from 'lucide-svelte/icons/save';
    import { enhance } from '$app/forms';
    import type { ActionData, PageData } from './$types';
    import { themes, applyTheme } from '$lib/theme';
    import { dev } from '$app/environment';

    export let data: PageData;
    export let form: ActionData;

    let tabSet: number = 0;

    // General tab
    $: if (form?.language && form?.success) $i18n.changeLanguage(form.language);

    // Password tab
    let password1: string;
    let password2: string;
    $: passwordCorrect = (password1?.length || 0) >= 8;
    $: passwordsEqual = password1 === password2;

    // Theme tab
    $: if (form?.theme && form?.success) applyTheme(form.theme);
</script>

<TabGroup>
    <Tab bind:group={tabSet} name="tab1" value={0}>{$i18n.t('account.general.general')}</Tab>
    <Tab bind:group={tabSet} name="tab2" value={1}>{$i18n.t('account.password.password')}</Tab>
    <Tab bind:group={tabSet} name="tab3" value={2}>{$i18n.t('account.theme.theme')}</Tab>
    <svelte:fragment slot="panel">
        {#if tabSet === 0}
            <form method="post" action="?/updateAccount" use:enhance>
                <label class="label">
                    <span>{$i18n.t('account.general.language')}</span>
                    <select class="select" name="language">
                        {#if dev}
                            <option value="cimode" selected={$i18n.language === 'cimode'}>
                                Translation keys
                            </option>
                        {/if}
                        {#each ($i18n.options.supportedLngs || [])
                            .filter((l) => l !== 'cimode')
                            .sort() as l}
                            <option value={l} selected={$i18n.language === l}>
                                {new Intl.DisplayNames([l], { type: 'language' }).of(l)}
                            </option>
                        {/each}
                    </select>
                </label>
                <button type="submit" class="btn variant-filled-primary mt-4">
                    <Save class="mr-2" />{$i18n.t('account.general.save')}
                </button>
            </form>
        {:else if tabSet === 1}
            <form method="post" action="?/updatePassword" class="space-y-4" use:enhance>
                <label class="label">
                    <span>{$i18n.t('account.password.new')}</span>
                    <input class="input" type="password" name="password" bind:value={password1} />
                    <span class="text-sm text-surface-600-300-token">
                        {$i18n.t('account.password.requirements')}
                    </span>
                </label>
                <label class="label">
                    <span>{$i18n.t('account.password.confirm')}</span>
                    <input class="input" type="password" bind:value={password2} />
                </label>
                <button
                    type="submit"
                    class="btn variant-filled-primary"
                    disabled={!passwordsEqual || !passwordCorrect}
                >
                    <Save class="mr-2" />{$i18n.t('account.password.save')}
                </button>
            </form>
        {:else if tabSet === 2}
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
                                    {$i18n.t('account.theme.active')}
                                </span>
                            {/if}
                        </div>
                        <button
                            type="submit"
                            class="btn variant-filled-primary mt-4"
                            disabled={false}
                        >
                            <PaintRoller class="mr-2" />{$i18n.t('account.theme.apply')}
                        </button>
                    </form>
                {/each}
            </div>
        {/if}
    </svelte:fragment>
</TabGroup>
