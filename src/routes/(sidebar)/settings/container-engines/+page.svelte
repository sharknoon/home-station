<script lang="ts">
	import { Box, Cpu, Database, Layers, List, MemoryStick } from 'lucide-svelte';
	import type { PageData } from './$types';
	import i18n from '$lib/i18n';

	export let data: PageData;
</script>

<h2 class="h2 mb-4">{$i18n.t('settings.container-engines.container-engines')}</h2>

<section class="flex flex-col gap-4">
	{#each data.containerEngines as containerEngine}
		<div class="card p-4 space-y-1">
			<div class="badge variant-filled">
				{#if containerEngine.type === 'local'}
					{$i18n.t('settings.container-engines.local')}
				{:else}
					{$i18n.t('settings.container-engines.remote')}
				{/if}
			</div>
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
				<div>
					<Layers class="inline-block mr-2" />
					{$i18n.t('settings.container-engines.number-of-stacks', {
						count: containerEngine.numberOfStacks
					})}
				</div>
				<div>
					<Box class="inline-block mr-2" />
					{$i18n.t('settings.container-engines.number-of-containers', {
						count: containerEngine.numberOfContainers
					})}
				</div>
				<div>
					<Database class="inline-block mr-2" />
					{$i18n.t('settings.container-engines.number-of-volumes', {
						count: containerEngine.numberOfVolumes
					})}
				</div>
				<div>
					<List class="inline-block mr-2" />
					{$i18n.t('settings.container-engines.number-of-images', {
						count: containerEngine.numberOfImages
					})}
				</div>
				<div>
					<Cpu class="inline-block mr-2" />
					{$i18n.t('settings.container-engines.number-of-Cpus', {
						count: containerEngine.numberOfCPUs
					})}
				</div>
				<div>
					<MemoryStick class="inline-block mr-2" />
					{$i18n.t('settings.container-engines.total-memory', {
						value: ((containerEngine.totalMemory ?? 0) / 1000 / 1000 / 1000).toFixed(1)
					})}
				</div>
			</div>
		</div>
	{/each}
</section>
