import { writable, type Writable } from 'svelte/store';
import cron, { CronJob } from 'cron';
import { updateAvailableApps } from '$lib/server/apprepositories';

const tasks: {
	name: string;
	schedule: string;
	scheduleDescription: string;
	runImmediately?: boolean;
	handler: (progress?: Writable<number>) => Promise<void>;
	progress: Writable<number>;
	running: Writable<boolean>;
	lastExecution: Writable<Date | undefined>;
	nextExecution: Writable<Date>;
}[] = [
	{
		name: 'Update available apps from app repositories',
		schedule: '*/30 * * * *',
		scheduleDescription: 'Every 30 minutes',
		runImmediately: true,
		handler: updateAvailableApps,
		progress: writable(0),
		running: writable(false),
		lastExecution: writable(),
		nextExecution: writable(cron.sendAt('*/30 * * * *').toJSDate())
	}
];

export async function scheduleTasks(): Promise<void> {
	for (const {
		name,
		schedule,
		runImmediately,
		handler,
		progress,
		running,
		lastExecution,
		nextExecution
	} of tasks) {
		console.info(`Scheduling task "${name}" to run on schedule "${schedule}"`);
		const onTick = async () => {
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
			nextExecution.set(cron.sendAt(schedule).toJSDate());
			console.info(`Completed task "${name}"`);
		};
		const job = new CronJob(schedule, onTick);
		job.start();
		if (runImmediately) {
			await onTick();
		}
	}
}
