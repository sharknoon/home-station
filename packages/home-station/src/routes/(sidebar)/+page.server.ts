import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { lucia } from '$lib/server/auth';
import { getInstalledApps } from '$lib/server/apps';

export const load: PageServerLoad = async () => {
    const apps = (await getInstalledApps()).map((app) => ({
        id: app.id,
        name: app.name,
        marketplaceUrl: app.marketplaceUrl,
        icon: app.icon,
        status: app.status
    }));
    return { apps };
};

export const actions = {
    logout: async ({ locals, cookies }) => {
        if (!locals.session) {
            return fail(401);
        }
        await lucia.invalidateSession(locals.session.id);
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies.set(sessionCookie.name, sessionCookie.value, {
            path: '.',
            ...sessionCookie.attributes
        });
        redirect(302, '/login');
    }
} satisfies Actions;
