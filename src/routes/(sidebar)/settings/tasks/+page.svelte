<script lang="ts">
	import type { PageData } from './$types';
	import { intlFormatDistance } from 'date-fns';
	import { i18n } from '$lib/i18n';
	import { RefreshCw } from 'lucide-svelte';
	import cronstrue from 'cronstrue';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { ProgressBar } from '@skeletonlabs/skeleton';

	export let data: PageData;

	onMount(() => {
		const evtSource = new EventSource('/settings/tasks/events');
		evtSource.onerror = (e) => console.error(e);
		evtSource.addEventListener('updateStats', () => invalidateAll());
	});

	setInterval(() => {
		data.tasks = data.tasks;
	}, 1000);
</script>

<h2 class="h2 mb-4">Scheduled Tasks</h2>

<div class="table-container">
	<table class="table table-hover [&_td]:!align-middle">
		<thead>
			<tr>
				<th>Name</th>
				<th>Interval</th>
				<th>Last Execution</th>
				<th>Last Duration</th>
				<th>Next Execution</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each data.tasks as task}
				<tr>
					<td>{$i18n.t('tasks.' + task.id)}</td>
					<td class="capitalize">
						{cronstrue.toString(task.schedule, { locale: $i18n.language })}
					</td>
					<td class="capitalize">
						{task.stats.lastExecution
							? intlFormatDistance(task.stats.lastExecution, new Date(), { locale: $i18n.language })
							: '-'}
					</td>
					<td>
						<!-- TODO switch to Intl version as soon as it is released: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DurationFormat/format -->
						{task.stats.lastDuration
							? `${task.stats.lastDuration} ${$i18n.t('tasks.milliseconds')}`
							: '-'}
					</td>
					<td class="capitalize">
						{task.stats.nextExecution
							? intlFormatDistance(task.stats.nextExecution, new Date(), { locale: $i18n.language })
							: '-'}
					</td>
					<td class="flex items-center justify-end gap-2">
						{#if task.stats.running}
							<ProgressBar value={task.stats.progress} max={1} />
						{/if}
						<form method="post" use:enhance>
							<input type="hidden" name="id" value={task.id} />
							<button
								type="submit"
								formaction="?/runTask"
								class="btn btn-sm variant-filled bg-initial"
								disabled={task.stats.running}
							>
								<RefreshCw class="h-4 w-4 {task.stats.running ? 'animate-spin' : ''}" />
							</button>
						</form>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
