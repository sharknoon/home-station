import { scheduleTasks } from '$lib/server/tasks';
import db from '$lib/server/db';
import { redirect, type Handle } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';

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

	// we can pass `event` because we used the SvelteKit middleware
	event.locals.auth = auth.handleRequest(event);

	// Only allow unauthenticated access to /setup and /login
	if (!event.url.pathname.startsWith('/setup') && !event.url.pathname.startsWith('/login')) {
		const session = await event.locals.auth.validate();
		if (!session) return redirect(303, '/login');
	}

	return await resolve(event);
};
