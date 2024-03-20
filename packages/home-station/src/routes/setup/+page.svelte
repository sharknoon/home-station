<script lang="ts">
    import type { ActionData, PageData } from './$types';
    import { Stepper, Step } from '@skeletonlabs/skeleton';
    import Minus from 'lucide-svelte/icons/minus';
    import Plus from 'lucide-svelte/icons/plus';
    import TriangleAlert from 'lucide-svelte/icons/triangle-alert';
    import { i18n } from '$lib/i18n';
    import { enhance } from '$app/forms';
    import { page } from '$app/stores';

    export let data: PageData;
    export let form: ActionData;

    // Step 1 Signup

    let username = '';
    let password1 = '';
    let password2 = '';

    $: usernameCorrect = /[a-zA-Z0-9_]{4,31}/.test(username);
    $: passwordCorrect = password1.length >= 8;
    $: passwordsEqual = password1 === password2;

    // Step 2 Add domains and hostnames

    let hostnameInput: string;
    let hostnames = data.detectedHostnames.map((hostname) => ({ hostname, autoDetected: true }));
    page.subscribe((page) => {
        if (
            page.form?.hostname &&
            page.form?.success &&
            !hostnames.some((h) => h.hostname === page.form?.hostname)
        ) {
            hostnames = [...hostnames, { hostname: page.form.hostname, autoDetected: true }];
        }
    });
    $: hostnamesOnly = hostnames.map((h) => h.hostname).join(',');
</script>

<div class="h-full flex flex-col gap-12 items-center justify-center p-12">
    <h1 class="h1">
        <span
            class="bg-gradient-to-br from-primary-500 to-secondary-500 bg-clip-text text-transparent box-decoration-clone font-bold"
        >
            {$i18n.t('brand.title')}
        </span>
    </h1>

    {#if !data.appDataPersistency.isPersistent}
        <aside class="alert variant-filled-warning max-w-[35rem]">
            <div><TriangleAlert /></div>
            <div class="alert-message">
                <p>
                    {$i18n.t('setup.missing-mount', {
                        path: data.appDataPersistency.defaultAppDataPath
                    })}
                </p>
            </div>
        </aside>
    {/if}

    <form
        method="post"
        action="?/signup"
        enctype="multipart/form-data"
        class="card max-w-[35rem] p-4 overflow-y-auto"
        use:enhance
    >
        <Stepper
            stepTerm={$i18n.t('setup.step')}
            buttonBackLabel={$i18n.t('setup.back')}
            buttonNextLabel={$i18n.t('setup.next')}
            buttonCompleteLabel={$i18n.t('setup.complete')}
            buttonCompleteType="submit"
        >
            <Step locked={!usernameCorrect || !passwordCorrect || !passwordsEqual}>
                <svelte:fragment slot="header">{$i18n.t('setup.welcome')}</svelte:fragment>
                <p>{$i18n.t('setup.get-started-account')}</p>
                <div class="space-y-4">
                    <label class="label">
                        <span>{$i18n.t('setup.username')}</span>
                        <input
                            class="input {form?.username ||
                            (usernameCorrect === false && username.length > 0)
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
                            class="input {form?.password ||
                            (passwordCorrect === false && password1.length > 0)
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
                </div>
                <!-- This is to remove the first "Back" button -->
                <svelte:fragment slot="navigation">{''}</svelte:fragment>
            </Step>
            <Step>
                <svelte:fragment slot="header">
                    {$i18n.t('setup.add-domains-and-hostnames')}
                </svelte:fragment>
                <!-- Repeat all previous step inputs here, because the stepper deletes them from the DOM -->
                <input type="hidden" name="username" bind:value={username} />
                <input type="hidden" name="password" bind:value={password1} />
                <input type="hidden" name="language" value={$i18n.language} />
                <input type="hidden" name="hostnames" bind:value={hostnamesOnly} />
                <ul class="list">
                    {#each hostnames as { hostname, autoDetected }}
                        <li>
                            <code class="code text-base">{hostname}</code>
                            {#if autoDetected}
                                <span class="badge variant-filled"
                                    >{$i18n.t('setup.auto-detected')}</span
                                >
                            {/if}
                            <span class="flex-auto"></span>
                            <button
                                type="button"
                                class="btn btn-sm variant-filled-error"
                                on:click={() =>
                                    (hostnames = hostnames.filter((h) => h.hostname !== hostname))}
                            >
                                <Minus />
                            </button>
                        </li>
                    {/each}
                </ul>
                <div>
                    <p>{$i18n.t('setup.add-domain-or-hostname')}</p>
                    <div class="input-group input-group-divider grid-cols-[1fr_auto]">
                        <input
                            type="text"
                            placeholder={$i18n.t('setup.domain-hostname-placeholder')}
                            bind:value={hostnameInput}
                        />
                        <button
                            type="button"
                            class="variant-filled-secondary"
                            on:click={() => {
                                if (!hostnames.some((h) => h.hostname === hostnameInput)) {
                                    hostnames = [
                                        ...hostnames,
                                        { hostname: hostnameInput, autoDetected: false }
                                    ];
                                }
                            }}
                        >
                            <Plus />
                        </button>
                    </div>
                </div>
                <span class="badge variant-filled">{$i18n.t('setup.tip')}</span>
                <span class="grow text-sm">{$i18n.t('setup.additional-domains-or-hostnames')}</span>
            </Step>
        </Stepper>
    </form>
</div>
