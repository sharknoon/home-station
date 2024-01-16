import type { Actions, PageServerLoad } from './$types';
import { tasks, executeTask } from '$lib/server/tasks';
import { get } from 'svelte/store';
import { fail } from '@sveltejs/kit';

export const load = (async () => {
	return {
		tasks: tasks.map((task) => ({
			id: task.id,
			name: task.name,
			schedule: task.schedule,
			scheduleDescription: task.scheduleDescription,
			running: get(task.running),
			lastExecution: get(task.lastExecution),
			lastDuration: get(task.lastDuration),
			nextExecution: get(task.nextExecution)
		}))
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
