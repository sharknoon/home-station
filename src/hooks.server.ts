import { scheduleTasks } from '$lib/server/tasks';
import db from '$lib/server/db';
import { redirect, type Handle } from '@sveltejs/kit';

// These functions run on Startup
await scheduleTasks();

export const handle: Handle = async ({ event, resolve }) => {
	// Check if the initial setup is completed
	const system = await db.query.systems.findFirst();
	if (!system?.setupComplete && !event.url.pathname.startsWith('/setup')) {
		return redirect(303, '/setup');
	}
	// Don't allow the user to access the setup pages if the setup is already completed
	if (system?.setupComplete && event.url.pathname.startsWith('/setup')) {
		return redirect(303, '/');
	}

	return await resolve(event);
};
