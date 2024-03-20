<script lang="ts">
    import { page } from '$app/stores';
    import { i18n } from '$lib/i18n';
    import { derived } from 'svelte/store';
    import disconnected from './(error)/disconnected.png';
    import error from './(error)/error.png';

    const message = derived(
        page,
        ($page) => decodeURIComponent($page.error?.message ?? '') as string
    );

    const errorType = derived(message, ($message) => {
        if (
            $message.includes('//./pipe/docker_engine') ||
            $message.includes('/var/run/docker.sock')
        ) {
            return 'docker-not-reachable';
        }
        return 'unknown';
    });
</script>

<div class="h-full flex flex-col gap-12 items-center justify-center p-12">
    <h1 class="h1">
        <span
            class="bg-gradient-to-br from-primary-500 to-secondary-500 bg-clip-text text-transparent box-decoration-clone font-bold"
        >
            {$i18n.t('brand.title')}
        </span>
    </h1>

    <aside class="alert variant-filled-error max-w-[35rem]">
        <div class="alert-message text-center space-y-4">
            {#if $errorType === 'docker-not-reachable'}
                <h3 class="h3">{$i18n.t('error.connection-to-container-engine-failed')}</h3>
                <img src={disconnected} alt="disconnected" class="mx-auto h-32" />
                <div>
                    <code>{$page.status}</code><br />
                    <code>{$message}</code>
                </div>
                <p>{$i18n.t('error.tips-for-docker-reachability')}</p>
            {:else}
                <h3 class="h3">{$i18n.t('error.unknown-error-occured')}</h3>
                <img src={error} alt="error" class="mx-auto h-32" />
                <div>
                    <code>{$page.status}</code><br />
                    <code>{$message}</code>
                </div>
            {/if}
        </div>
    </aside>
</div>
