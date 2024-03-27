<script lang="ts">
    import type { MarketplaceApp } from '$lib/server/marketplaces';
    import { getModalStore } from '@skeletonlabs/skeleton';

    const modalStore = getModalStore();

    const http = $modalStore[0].meta as MarketplaceApp['http'];

    // TODO
</script>
