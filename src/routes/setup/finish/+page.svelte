<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;
</script>

Domains: {data.detectedDomains}
<br>
Version: {data.version}
<br>
Containers: {data.containers}
<br>
Images: {data.images}
<br>
Volumes: {data.volumes}