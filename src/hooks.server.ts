import { scheduleTasks } from '$lib/server/tasks';
import db from '$lib/server/db';
import { redirect, type Handle } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';
import { sequence } from '@sveltejs/kit/hooks';

// These functions run on Startup
await scheduleTasks();

const authentication = (async ({ event, resolve }) => {
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		// sveltekit types deviates from the de-facto standard
		// you can use 'as any' too
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
}) satisfies Handle;

const authorization = (async ({ event, resolve }) => {
	// Check if the initial setup is completed
	const hasUsers = !!(await db.query.users.findFirst());
	if (!hasUsers && !event.url.pathname.startsWith('/setup')) {
		return redirect(303, '/setup');
	}

	// Only allow unauthenticated access to /setup and /login
	if (!event.url.pathname.startsWith('/setup') && !event.url.pathname.startsWith('/login')) {
		if (!event.locals.user) return redirect(303, '/login');
	}

	return await resolve(event);
}) satisfies Handle;

export const handle = sequence(authentication, authorization);
