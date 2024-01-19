import { writable, type Writable } from 'svelte/store';
import cron, { CronJob } from 'cron';
import { updateAvailableApps } from '$lib/server/apprepositories';

export type Task = {
	id: 'update-available-apps' | 'test'; // Never change this ID, it is used to identify the task in the database
	schedule: string;
	runImmediately?: boolean;
	handler: (progressCallback: (progress: number | undefined) => void) => Promise<void>;
	stats: Writable<{
		progress: number | undefined; // Undefined = Indeterminate
		running: boolean;
		lastExecution: Date | undefined;
		lastDuration: number | undefined;
		nextExecution: Date;
	}>;
};

export const tasks: Task[] = [
	{
		// t('tasks.update-available-apps') This is for i18next to automatically create a locale file entry
		id: 'update-available-apps', // Never change this ID, it is used to identify the task in the database
		schedule: '*/30 * * * *',
		runImmediately: true,
		handler: updateAvailableApps, // Do not call this directly, use executeTask() instead
		stats: writable({
			progress: 0,
			running: false,
			lastExecution: undefined,
			lastDuration: undefined,
			nextExecution: cron.sendAt('*/30 * * * *').toJSDate()
		})
	}
];

export async function scheduleTasks(): Promise<void> {
	for (const task of tasks) {
		console.info(`Scheduling task "${task.id}" to run on schedule "${task.schedule}"`);
		const job = new CronJob(task.schedule, async () => await executeTask(task));
		job.start();
		if (task.runImmediately) {
			await executeTask(task);
		}
	}
}

export async function executeTask(task: Task): Promise<void> {
	const { id, schedule, handler, stats } = task;
	console.info(`Starting task "${id}"`);
	stats.update((stats) => ({ ...stats, progress: 0, running: true }));
	const lastExecution = new Date();
	try {
		// Remove the await to run tasks in parallel
		await handler((p) => stats.update((s) => ({ ...s, progress: p })));
	} catch (error) {
		console.error(`Error running task "${id}":`, error);
	}
	const lastDuration = new Date().getTime() - lastExecution.getTime();
	stats.update((stats) => ({
		...stats,
		progress: 1,
		running: false,
		lastExecution,
		lastDuration,
		nextExecution: cron.sendAt(schedule).toJSDate()
	}));
	// TODO switch to Intl version as soon as it is released: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DurationFormat/format
	console.info(`Completed task "${id}" in ${lastDuration}ms`);
}
