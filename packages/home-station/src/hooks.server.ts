import { db } from '$lib/server/db';
import { redirect, type Handle } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';
import { sequence } from '@sveltejs/kit/hooks';
import { init as initWebserver } from '$lib/server/webserver';
import { init as initTasks } from '$lib/server/tasks';

// These functions run on Startup
// Start the webserver to serve the apps with https support on subdomains
await initWebserver();
// Schedule the tasks
await initTasks();

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

const theme = (async ({ event, resolve }) => {
    return await resolve(event, {
        transformPageChunk: ({ html }) => {
            return html.replace('%theme%', event.locals.user?.theme || 'skeleton');
        }
    });
}) satisfies Handle;

export const handle = sequence(authentication, authorization, theme);
