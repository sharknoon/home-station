import { db } from '$lib/server/db';
import { redirect, type Handle } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';
import { sequence } from '@sveltejs/kit/hooks';
import { init as initContainerEngine } from '$lib/server/containerengines';
import { init as initWebserver } from '$lib/server/webserver';
import { init as initTasks } from '$lib/server/tasks';
import { logger } from '$lib/server/logger';

// These functions run once on startup
let thrownError: unknown = undefined;
try {
    // Creates the home-station network if it does not exist
    await initContainerEngine();
    // Start the webserver to serve the apps with https support on subdomains
    await initWebserver();
    // Schedule the tasks
    await initTasks();
} catch (err) {
    thrownError = err;
}

// This hook sends server initialization errors to the +error page
const init = (async ({ event, resolve }) => {
    if (thrownError !== undefined && !event.url.pathname.startsWith('/error')) {
        logger.error(thrownError);
        return redirect(
            302,
            `/error?status=500&message=${encodeURIComponent((thrownError as Error)?.message)}`
        );
    }
    return await resolve(event);
}) satisfies Handle;

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
    if (
        !hasUsers &&
        !event.url.pathname.startsWith('/setup') &&
        !event.url.pathname.startsWith('/error')
    ) {
        return redirect(303, '/setup');
    }

    // Only allow unauthenticated access to /setup, /login and /error
    if (
        !event.url.pathname.startsWith('/setup') &&
        !event.url.pathname.startsWith('/login') &&
        !event.url.pathname.startsWith('/error')
    ) {
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

export const handle = sequence(init, authentication, authorization, theme);
