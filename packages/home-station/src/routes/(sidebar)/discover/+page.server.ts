import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import { deleteMarketplace } from '$lib/server/marketplaces';
import { marketplaceApps } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { getInstalledApps, installApp } from '$lib/server/apps';
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
    const installedApps = await getInstalledApps();
    return { marketplaceApps, marketplaces, installedApps };
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
        const appUuid = data.get('appUuid')?.toString() ?? '';
        
        // Validation
        if (!appUuid) {
            return fail(400, { appUuid, invalid: true });
        }
        const marketplaceApp = await db.query.marketplaceApps.findFirst({
            where: eq(marketplaceApps.uuid, appUuid)
        });
        if (!marketplaceApp) {
            return fail(400, { appUuid, notFound: true });
        }

        dispatchEvent('appStatus', { appUuid, status: 'installing', progress: 0 });

        try {
            await installApp(
                marketplaceApp,
                (progress) =>
                    dispatchEvent('appStatus', { appUuid, status: 'installing', progress })
            );
        } catch (e) {
            sendNotification(
                'error',
                get(i18n).t('notification.app-installation-error', { error: String(e) })
            );
        }

        dispatchEvent('appStatus', { appUuid, status: 'installed', progress: 1 });
        const postInstallMessage = marketplaceApp.messages?.postInstall;
        if (postInstallMessage) {
            sendNotification('info', ts(postInstallMessage));
        }
    }
};
