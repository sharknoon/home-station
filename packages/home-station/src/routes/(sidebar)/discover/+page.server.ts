import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import { deleteMarketplace } from '$lib/server/marketplaces';
import { marketplaceApps } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { installedApps, installApp } from '$lib/server/apps';
import { dispatchEvent } from '$lib/server/events';
import { i18n, ts } from '$lib/i18n';
import { get } from 'svelte/store';
import { sendNotification } from '$lib/server/notifications';

export const load = (async () => {
    const marketplaceApps = await db.query.marketplaceApps.findMany({
        with: { marketplace: { columns: { gitRemoteUrl: true } } }
    });
    const marketplaces = await db.query.marketplaces.findMany({
        columns: { gitPassword: false }
    });
    return { marketplaceApps, marketplaces, installedApps: get(installedApps) };
}) satisfies PageServerLoad;

export const actions: Actions = {
    deleteRepository: async ({ request }) => {
        const data = await request.formData();
        const url = data.get('url')?.toString();

        if (!url) {
            return fail(400, { url, invalid: true });
        }

        // TODO check if the repository is used by an app

        await deleteMarketplace(url);
    },
    installApp: async ({ request }) => {
        // Get necessary data
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
            await installApp(app.marketplaceUrl, app.id, app.version, (progress) =>
                dispatchEvent('appStatus', { appId, status: 'installing', progress })
            );
        } catch (e) {
            sendNotification(
                'error',
                get(i18n).t('notification.app-installation-error', { error: String(e) })
            );
        }

        dispatchEvent('appStatus', { appId, status: 'installed', progress: 1 });
        const postInstallMessage = app.messages?.postInstall;
        if (postInstallMessage) {
            sendNotification('info', ts(postInstallMessage));
        }
    }
};
