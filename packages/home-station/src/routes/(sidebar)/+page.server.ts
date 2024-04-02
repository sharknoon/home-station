import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { get } from 'svelte/store';
import { eq } from 'drizzle-orm';
import { lucia } from '$lib/server/auth';
import { installApp, installedApps, uninstallApp } from '$lib/server/apps';
import { i18n } from '$lib/i18n';
import { sendNotification } from '$lib/server/notifications';
import { db } from '$lib/server/db';
import { marketplaceApps } from '$lib/server/schema';
import { dispatchEvent } from '$lib/server/events';

export const load: PageServerLoad = async () => {
    const apps = get(installedApps).map((app) => ({
        marketplaceUrl: app.marketplaceUrl,
        id: app.id,
        version: app.installedVersion,
        icon: app.icon,
        name: app.name,
        status: app.status,
        launchOptions: app.launchOptions
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
    installApp: async ({ request }) => {
        const data = await request.formData();
        const appId = data.get('appId')?.toString() ?? '';

        // Validation
        if (!appId) {
            return fail(400, { appId, invalid: true });
        }
        const app = await db.query.marketplaceApps.findFirst({
            where: eq(marketplaceApps.id, appId)
        });
        if (!app) {
            return fail(400, { appId, notFound: true });
        }

        dispatchEvent('appStatus', { appId, status: 'installing', progress: 0 });

        try {
            await installApp(app, (progress) =>
                dispatchEvent('appStatus', { appId, status: 'installing', progress })
            );
        } catch (e) {
            sendNotification(
                'error',
                get(i18n).t('notification.app-installation-error', { error: String(e) })
            );
        }

        dispatchEvent('appStatus', { appId, status: 'installed', progress: 1 });
    },
    uninstallApp: async ({ request }) => {
        const data = await request.formData();
        const appId = data.get('appId')?.toString();

        // Validation
        if (!appId) {
            return fail(400, { appId, invalid: true });
        }
        const app = get(installedApps).find((app) => app.id === appId);
        if (!app) {
            return fail(400, { appId, notFound: true });
        }

        try {
            await uninstallApp(app);
        } catch (e) {
            sendNotification(
                'error',
                get(i18n).t('notification.app-uninstallation-error', { error: String(e) })
            );
        }
    }
} satisfies Actions;
