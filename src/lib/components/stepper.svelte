<script lang="ts">
	import Box from './box.svelte';

	export let steps: { title: string }[] = [];
	export let currentStep = 0;
</script>

<Box>
	<div class="grid" style="grid-template-columns: repeat({steps.length}, minmax(0, 1fr));">
		{#each steps as step, i}
			<div class="flex items-center gap-4 relative px-6 py-4 text-sm font-semibold text-gray-400">
				<div
					class="rounded-full border-2 {currentStep === i
						? 'border-emerald-700 text-white'
						: 'border-gray-200'} {i < currentStep
						? 'bg-emerald-700 text-gray-200'
						: ''} min-w-10 min-h-10 flex items-center justify-center"
				>
					{#if i < currentStep}
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-6 w-6">
							<path
								d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"
								fill="currentColor"
							>
							</path>
						</svg>
					{:else}
						{i + 1}
					{/if}
				</div>
				<span class="grow" class:text-white={currentStep === i}>{step.title}</span>
				{#if i < steps.length - 1}
					<svg
						class="absolute top-0 right-0 h-full text-gray-600"
						viewBox="0 0 22 80"
						fill="none"
						preserveAspectRatio="none"
					>
						<path
							d="M0 -2L20 40L0 82"
							vector-effect="non-scaling-stroke"
							stroke="currentcolor"
							stroke-linejoin="round"
						>
						</path>
					</svg>
				{/if}
			</div>
		{/each}
	</div>
</Box>
