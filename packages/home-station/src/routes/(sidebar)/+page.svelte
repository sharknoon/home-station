<script lang="ts">
    import type { PageData } from './$types';
    import { ts } from '$lib/i18n';

    export let data: PageData;
</script>

<!-- TODO also implement the specific app settings here via modal -->
<div class="grid grid-cols-6 place-items-center gap-16 m-16">
    {#each data.apps as app}
        <a href="https://google.com">
            <img
                src={app.icon}
                alt={ts(app.name)}
                class="object-cover h-20 w-20 rounded-2xl p-2 bg-white"
            />
            <div class="mt-2">{ts(app.name)}</div>
        </a>
    {/each}
</div>
