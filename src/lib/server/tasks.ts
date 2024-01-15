import { get, writable, type Writable } from 'svelte/store';
import cron, { CronJob } from 'cron';
import { updateAvailableApps } from '$lib/server/apprepositories';

export type Task = {
	id: 'update-available-apps'; // Never change this ID, it is used to identify the task in the database
	name: string;
	schedule: string;
	scheduleDescription: string;
	runImmediately?: boolean;
	handler: (progress?: Writable<number>) => Promise<void>;
	progress: Writable<number>;
	running: Writable<boolean>;
	lastExecution: Writable<Date | undefined>;
	lastDuration: Writable<number | undefined>;
	nextExecution: Writable<Date>;
};

export const tasks: Task[] = [
	{
		id: 'update-available-apps', // Never change this ID, it is used to identify the task in the database
		name: 'Update available apps from app repositories',
		schedule: '*/30 * * * *',
		scheduleDescription: 'every 30 minutes',
		runImmediately: true,
		handler: updateAvailableApps, // Do not call this directly, use executeTask() instead
		progress: writable(0),
		running: writable(false),
		lastExecution: writable(),
		lastDuration: writable(),
		nextExecution: writable(cron.sendAt('*/30 * * * *').toJSDate())
	}
];

export async function scheduleTasks(): Promise<void> {
	for (const task of tasks) {
		console.info(`Scheduling task "${task.name}" to run on schedule "${task.schedule}"`);
		const job = new CronJob(task.schedule, async () => await executeTask(task));
		job.start();
		if (task.runImmediately) {
			await executeTask(task);
		}
	}
}

export async function executeTask(task: Task): Promise<void> {
	const { name, schedule, handler, progress, running, lastExecution, lastDuration, nextExecution } =
		task;
	console.info(`Starting task "${name}"`);
	running.set(true);
	const lastExecutionDate = new Date();
	try {
		// Remove the await to run tasks in parallel
		await handler(progress);
	} catch (error) {
		console.error(`Error running task "${name}":`, error);
	}
	running.set(false);
	lastExecution.set(lastExecutionDate);
	lastDuration.set(new Date().getTime() - lastExecutionDate.getTime());
	nextExecution.set(cron.sendAt(schedule).toJSDate());
	// TODO switch to Intl version as soon as it is released: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DurationFormat/format
	console.info(
		`Completed task "${name}" in ${get(lastDuration)}ms`
	);
}
