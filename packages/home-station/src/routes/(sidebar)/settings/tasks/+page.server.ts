import type { Actions, PageServerLoad } from './$types';
import { tasks, executeTask } from '$lib/server/tasks';
import { get } from 'svelte/store';
import { fail } from '@sveltejs/kit';

export const load = (async () => {
    return {
        tasks: tasks.map((task) => {
            const stats = get(task.stats);
            return {
                id: task.id,
                schedule: task.schedule,
                stats: {
                    progress: stats.progress,
                    running: stats.running,
                    lastExecution: stats.lastExecution,
                    lastDuration: stats.lastDuration,
                    nextExecution: stats.nextExecution
                }
            };
        })
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    async runTask({ request }) {
        const formData = await request.formData();
        const id = formData.get('id');
        if (!id) {
            return fail(400, { error: 'No task ID provided' });
        }
        const task = tasks.find((task) => task.id === id);
        if (!task) {
            return fail(404, { error: `Task with ID "${id}" not found` });
        }
        executeTask(task);
    }
};
