import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { lucia } from '$lib/server/auth';
import { getInstalledApps, uninstallApp } from '$lib/server/apps';
import { dispatchEvent } from '$lib/server/events';

export const load: PageServerLoad = async () => {
    const apps = (await getInstalledApps()).map((app) => ({
        marketplaceUrl: app.marketplaceUrl,
        uuid: app.uuid,
        version: app.installedVersion,
        icon: app.icon,
        name: app.name,
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
    },
    uninstallApp: async ({ request }) => {
        const data = await request.formData();
        const marketplaceUrl = data.get('marketplaceUrl')?.toString();
        const appUuid = data.get('appUuid')?.toString();
        const version = data.get('version')?.toString();
        if (!marketplaceUrl || !appUuid || !version) {
            return fail(400);
        }
        try {
            await uninstallApp(marketplaceUrl, appUuid, version);
        } catch (e) {
            dispatchEvent('notification', {
                level: 'error',
                // i18n.t('notification.app-uninstallation-error', { error: String(e) })
                i18nKey: 'notification.app-uninstallation-error',
                data: { error: String(e) }
            });
        }
    }
} satisfies Actions;
