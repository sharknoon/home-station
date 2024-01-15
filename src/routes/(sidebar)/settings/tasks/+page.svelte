<script lang="ts">
	import type { PageData } from './$types';
	import { intlFormatDistance, intervalToDuration, formatDuration } from 'date-fns';

	import { i18n } from '$lib/i18n';
	import { RefreshCw } from 'lucide-svelte';

	export let data: PageData;
</script>

<h2 class="h2 font-semibold mb-4">Scheduled Tasks</h2>

<div class="table-container">
	<!-- Native Table Element -->
	<table class="table table-hover">
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
					<td>{task.name}</td>
					<td class="capitalize">{task.scheduleDescription}</td>
					<td class="capitalize">
						{task.lastExecution
							? intlFormatDistance(task.lastExecution, new Date(), { locale: $i18n.language })
							: 'Never'}
					</td>
					<td>
						<!-- TODO switch to Intl version as soon as it is released: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DurationFormat/format -->
						{task.lastDuration ? task.lastDuration + ' Milliseconds' : 'N/A'}
					</td>
					<td class="capitalize">
						{task.nextExecution
							? intlFormatDistance(task.nextExecution, new Date(), { locale: $i18n.language })
							: 'Never'}
					</td>
					<td>
						<form method="post">
							<button
								type="submit"
								formaction="?/runTask"
								class="btn btn-sm variant-filled bg-initial"
								disabled={task.running}
							>
								<RefreshCw class="h-4 w-4 {task.running ? 'animate-spin' : ''}" />
							</button>
						</form>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
