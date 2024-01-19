import { scheduleTasks } from '$lib/server/tasks';
import db from '$lib/server/db';
import { redirect, type Handle } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';

// These functions run on Startup
await scheduleTasks();

export const handle: Handle = async ({ event, resolve }) => {
	// Check if the initial setup is completed
	const hasUsers = !!(await db.query.users.findFirst());
	if (!hasUsers && !event.url.pathname.startsWith('/setup')) {
		return redirect(303, '/setup');
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
