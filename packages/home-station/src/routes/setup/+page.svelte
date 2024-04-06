<script lang="ts">
    import type { ActionData, PageData } from './$types';
    import TriangleAlert from 'lucide-svelte/icons/triangle-alert';
    import { i18n } from '$lib/i18n';
    import { enhance } from '$app/forms';

    export let data: PageData;
    export let form: ActionData;

    let username = '';
    let password1 = '';
    let password2 = '';

    $: usernameCorrect = /[a-zA-Z0-9_]{4,31}/.test(username);
    $: passwordCorrect = password1.length >= 8;
    $: passwordsEqual = password1 === password2;
</script>

<div class="h-full flex flex-col gap-12 items-center justify-center p-12">
    <h1 class="h1">
        <span
            class="bg-gradient-to-br from-primary-500 to-secondary-500 bg-clip-text text-transparent box-decoration-clone font-bold"
        >
            {$i18n.t('brand.title')}
        </span>
    </h1>

    {#if !data.dataPersistency.isPersistent}
        <aside class="alert variant-filled-warning max-w-[35rem]">
            <div><TriangleAlert /></div>
            <div class="alert-message">
                <p>
                    {$i18n.t('setup.missing-mount', {
                        path: data.dataPersistency.defaultDataPath
                    })}
                </p>
            </div>
        </aside>
    {/if}

    <form
        method="post"
        action="?/signup"
        enctype="multipart/form-data"
        class="card max-w-[35rem] p-4 overflow-y-auto space-y-4"
        use:enhance
    >
        <input type="hidden" name="username" bind:value={username} />
        <input type="hidden" name="password" bind:value={password1} />
        <input type="hidden" name="language" value={$i18n.language} />
        <h1 class="h3 text-center">{$i18n.t('setup.welcome')}</h1>
        <p>{$i18n.t('setup.get-started-account')}</p>
        <label class="label">
            <span>{$i18n.t('setup.username')}</span>
            <input
                class="input {form?.username || (usernameCorrect === false && username.length > 0)
                    ? '[&:not(:focus)]:input-error'
                    : ''}"
                type="text"
                required
                placeholder={$i18n.t('setup.username')}
                bind:value={username}
            />
            <span class="text-sm text-surface-600-300-token">
                {$i18n.t('setup.username-requirements')}
            </span>
        </label>
        <label class="label">
            <span>{$i18n.t('setup.password')}</span>
            <input
                class="input {form?.password || (passwordCorrect === false && password1.length > 0)
                    ? '[&:not(:focus)]:input-error'
                    : ''}"
                type="password"
                required
                placeholder={$i18n.t('setup.password')}
                bind:value={password1}
            />
            <span class="text-sm text-surface-600-300-token">
                {$i18n.t('setup.password-requirements')}
            </span>
        </label>
        <label class="label">
            <span>{$i18n.t('setup.repeat-password')}</span>
            <input
                class="input {passwordsEqual === false && password2.length > 0
                    ? '[&:not(:focus)]:input-error'
                    : ''}"
                type="password"
                required
                placeholder={$i18n.t('setup.password')}
                bind:value={password2}
            />
        </label>
        <button
            type="submit"
            class="btn variant-filled-primary"
            disabled={!usernameCorrect || !passwordCorrect || !passwordsEqual}
        >
            {$i18n.t('setup.create-account')}
        </button>
    </form>
</div>
