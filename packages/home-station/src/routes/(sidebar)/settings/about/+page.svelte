<script lang="ts">
    import type { PageData } from './$types';
    import { intlFormatDistance } from 'date-fns';
    import { i18n } from '$lib/i18n';

    export let data: PageData;

    // Redeclare the variables here to prevent "'__COMMIT_HASH__' is not definedsvelte(missing-declaration)" error
    // eslint-disable-next-line no-undef
    let REPOSITORY_URL = __REPOSITORY_URL__;
    // eslint-disable-next-line no-undef
    let NPM_PACKAGE_VERSION = __NPM_PACKAGE_VERSION__;
    // eslint-disable-next-line no-undef
    let COMMIT_HASH = __COMMIT_HASH__;
    // eslint-disable-next-line no-undef
    let BUILD_DATE = __BUILD_DATE__;
</script>

<div class="flex flex-col justify-center items-center h-full">
    <h1 class="h1 leading-8 mb-8">
        <span
            class="bg-gradient-to-br from-primary-500 to-secondary-500 bg-clip-text text-transparent box-decoration-clone font-bold"
        >
            {$i18n.t('brand.title')}
        </span>
    </h1>
    <div>{$i18n.t('settings.about.version')}: <code>{NPM_PACKAGE_VERSION}</code></div>
    <div>
        {$i18n.t('settings.about.commit')}: {#if COMMIT_HASH !== 'unknown'}
            <a href="{REPOSITORY_URL}/commit/{COMMIT_HASH}">
                <code>{COMMIT_HASH.substring(0, 7)}</code>
            </a>
        {:else}
            {$i18n.t('settings.about.unkown')}
        {/if}
    </div>
    <div>
        {$i18n.t('settings.about.build-date')}: {BUILD_DATE} ({intlFormatDistance(
            BUILD_DATE,
            new Date(),
            {
                locale: $i18n.language
            }
        )})
    </div>
    <div>
        {$i18n.t('settings.about.traefik')}:
        <code>
            {data.traefikVersion.Version} ({data.traefikVersion.Codename}) {data.traefikVersion
                .startDate} ({intlFormatDistance(data.traefikVersion.startDate, new Date(), {
                locale: $i18n.language
            })})
        </code>
    </div>
</div>
