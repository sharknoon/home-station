<script lang="ts">
	import { Box, Cpu, Database, Layers, List, MemoryStick } from 'lucide-svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h2 class="h2 mb-4">Container engines</h2>

<section class="flex flex-col gap-4">
	{#each data.containerEngines as containerEngine}
		<div class="card p-4 space-y-1">
			<div><span class="badge variant-filled">{containerEngine.type}</span></div>
			<div class="flex gap-2 items-center">
				<h2 class="h2">{containerEngine.name}</h2>
				{#if containerEngine.up}
					<span class="relative flex h-3 w-3 pt-1">
						<span
							class="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400-500-token opacity-75"
						/>
						<span class="relative inline-flex rounded-full h-3 w-3 bg-success-400-500-token" />
					</span>
				{:else}
					<span class="rounded-full h-3 w-3 bg-error-400-500-token pt-1" />
				{/if}
			</div>
			<div class="flex gap-8">
				<div><Layers class="inline-block mr-2" />{containerEngine.numberOfStacks} stacks</div>
				<div><Box class="inline-block mr-2" />{containerEngine.numberOfContainers} containers</div>
				<div><Database class="inline-block mr-2" />{containerEngine.numberOfVolumes} volumes</div>
				<div><List class="inline-block mr-2" />{containerEngine.numberOfImages} images</div>
				<div><Cpu class="inline-block mr-2" />{containerEngine.numberOfCPUs} CPU</div>
				<div>
					<MemoryStick class="inline-block mr-2" />{(
						(containerEngine.totalMemory ?? 0) /
						1000 /
						1000 /
						1000
					).toFixed(1)} GB RAM
				</div>
			</div>
		</div>
	{/each}
</section>
