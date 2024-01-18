<script lang="ts">
	import { getModalStore, ProgressRadial } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();
</script>

{#if $modalStore[0]}
	<div class="card variant-ghost p-4">
		<ProgressRadial width="w-12" />
	</div>
{/if}
