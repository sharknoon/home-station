<script lang="ts">
	import type { availableApps } from '$lib/server/schema';

	type App = typeof availableApps.$inferSelect;

	export let app: App;
</script>

<div class="card variant-filled shadow-2xl p-4">
    ID: {app?.appId}
</div>
