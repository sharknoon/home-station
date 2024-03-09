import type { Actions, PageServerLoad } from './$types';
import db from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import { deleteMarketplace } from '$lib/server/marketplaces';
import { marketplaceApps, containerEngines } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { getInstalledApps, installApp } from '$lib/server/apps';
import { dispatchEvent } from '$lib/server/events';

export const load = (async () => {
    const marketplaceApps = await db.query.marketplaceApps.findMany({
        with: { marketplace: { columns: { gitRemoteUrl: true } } }
    });
    const marketplaces = await db.query.marketplaces.findMany({
        columns: { gitPassword: false }
    });
    const containerEngines = await db.query.containerEngines.findMany({
        columns: { id: true, name: true, type: true }
    });
    const installedApps = (await getInstalledApps()).map((app) => app.uuid);
    return { marketplaceApps, marketplaces, containerEngines, installedApps };
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
        const containerEngineId = parseInt(data.get('containerEngineId')?.toString() ?? '');

        // Validation
        if (!appUuid) {
            return fail(400, { appUuid, invalid: true });
        }
        if (!containerEngineId) {
            return fail(400, { containerEngineId, invalid: true });
        }
        const marketplaceApp = await db.query.marketplaceApps.findFirst({
            where: eq(marketplaceApps.uuid, appUuid)
        });
        if (!marketplaceApp) {
            return fail(400, { appUuid, notFound: true });
        }
        const containerEngine = await db.query.containerEngines.findFirst({
            where: eq(containerEngines.id, containerEngineId)
        });
        if (!containerEngine) {
            return fail(400, { containerEngineId, notFound: true });
        }

        // TODO check if the repository and container engine exist

        // TODO create app

        dispatchEvent('appStatus', { appUuid, status: 'installing', progress: 0 });

        await installApp(marketplaceApp, (progress) =>
            dispatchEvent('appStatus', { appUuid, status: 'installing', progress })
        );

        dispatchEvent('appStatus', { appUuid, status: 'installed', progress: 1 });
    }
};
