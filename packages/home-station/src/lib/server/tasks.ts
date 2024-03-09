import cron, { CronJob } from 'cron';
import { updateMarketplaceApps } from '$lib/server/marketplaces';
import { dev } from '$app/environment';
import { throttle } from '$lib/server/utils';
import { lucia } from '$lib/server/auth';
import logger from '$lib/server/logger';
import { writable, type Writable } from 'svelte/store';
import { dispatchEvent } from '$lib/server/events';

export type Task = {
    /** NEVER change this ID, it is used to identify the task in the database */
    id: 'update-marketplace-apps' | 'delete-expired-sessions' | 'test';
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
        // t('tasks.update-marketplace-apps') This is for i18next to automatically create a locale file entry
        id: 'update-marketplace-apps',
        schedule: '*/30 * * * *',
        runImmediately: true,
        handler: updateMarketplaceApps,
        stats: getDefaultStats('*/30 * * * *')
    },
    {
        // t('tasks.delete-expired-sessions') This is for i18next to automatically create a locale file entry
        id: 'delete-expired-sessions',
        schedule: '0 0 1 * *',
        runImmediately: false,
        handler: lucia.deleteExpiredSessions,
        stats: getDefaultStats('0 0 1 * *')
    }
];

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
        stats: getDefaultStats('0 0 1 * *')
    });
}

function getDefaultStats(schedule: string): Writable<TaskStats> {
    return writable({
        progress: 0,
        running: false,
        lastExecution: undefined,
        lastDuration: undefined,
        nextExecution: cron.sendAt(schedule).toJSDate()
    });
}

export async function scheduleTasks(): Promise<void> {
    for (const task of tasks) {
        // Update the stats in the UI
        task.stats.subscribe((stats) => dispatchEvent('updateStats', { id: task.id, stats }));
        logger.info(`Scheduling task "${task.id}" to run on schedule "${task.schedule}"`);
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
    logger.info(`Starting task "${id}"`);
    stats.update((stats) => ({ ...stats, progress: 0, running: true }));
    const lastExecution = new Date();
    try {
        await handler(throttle((p) => stats.update((s) => ({ ...s, progress: p }))));
    } catch (error) {
        logger.error(`Error running task "${id}":`, error);
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
    logger.info(`Completed task "${id}" in ${lastDuration}ms`);
}
