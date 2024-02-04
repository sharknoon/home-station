import { writable, type Writable } from 'svelte/store';
import cron, { CronJob } from 'cron';
import { updateAvailableApps } from '$lib/server/apprepositories';
import { dev } from '$app/environment';
import { throttle } from '$lib/server/utils';
import { deleteExpiredSessions } from '$lib/server/auth';

export type Task = {
	/** NEVER change this ID, it is used to identify the task in the database */
	id: 'update-available-apps' | 'delete-expired-sessions' | 'test';
	schedule: string;
	runImmediately?: boolean;
	/** Do not call this directly, use executeTask() instead */
	handler: (progressCallback: (progress: number | undefined) => void) => Promise<void>;
	stats: Writable<TaskStats>;
};

export type TaskStats = {
	/** Undefined = Indeterminate */
	progress: number | undefined;
	running: boolean;
	lastExecution: Date | undefined;
	lastDuration: number | undefined;
	nextExecution: Date;
};

export const tasks: Task[] = [
	{
		// t('tasks.update-available-apps') This is for i18next to automatically create a locale file entry
		id: 'update-available-apps',
		schedule: '*/30 * * * *',
		runImmediately: true,
		handler: updateAvailableApps,
		stats: getDefaultStats('*/30 * * * *')
	},
	{
		// t('tasks.delete-expired-sessions') This is for i18next to automatically create a locale file entry
		id: 'delete-expired-sessions',
		schedule: '0 0 1 * *',
		runImmediately: false,
		handler: deleteExpiredSessions,
		stats: getDefaultStats('0 0 1 * *')
	}
];

function getDefaultStats(schedule: string): Writable<TaskStats> {
	return writable({
		progress: 0,
		running: false,
		lastExecution: undefined,
		lastDuration: undefined,
		nextExecution: cron.sendAt(schedule).toJSDate()
	});
}

// Test the task execution and the progress callback
if (dev) {
	tasks.push({
		// t('tasks.test') This is for i18next to automatically create a locale file entry
		id: 'test',
		schedule: '0 0 1 * *',
		runImmediately: false,
		handler: async (progressCallback) => {
			for (let i = 0; i < 100; i++) {
				await new Promise((resolve) => setTimeout(resolve, 100));
				progressCallback((i + 1) / 100);
			}
		},
		stats: writable({
			progress: 0,
			running: false,
			lastExecution: undefined,
			lastDuration: undefined,
			nextExecution: cron.sendAt('0 0 1 * *').toJSDate()
		})
	});
}

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

/**
 * This function executes a task. It is either called automatically by a cron job or
 * manually by the user. You can either await for the task to finish or run it in parallel
 * with other tasks.
 * @param task The task to execute
 */
export async function executeTask(task: Task): Promise<void> {
	const { id, schedule, handler, stats } = task;
	console.info(`Starting task "${id}"`);
	stats.update((stats) => ({ ...stats, progress: 0, running: true }));
	const lastExecution = new Date();
	try {
		await handler(throttle((p) => stats.update((s) => ({ ...s, progress: p }))));
	} catch (error) {
		console.error(`Error running task "${id}":`, error);
	}
	const lastDuration = new Date().getTime() - lastExecution.getTime();
	stats.update(() => ({
		progress: 1,
		running: false,
		lastExecution,
		lastDuration,
		nextExecution: cron.sendAt(schedule).toJSDate()
	}));
	// TODO switch to Intl version as soon as it is released: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DurationFormat/format
	console.info(`Completed task "${id}" in ${lastDuration}ms`);
}
