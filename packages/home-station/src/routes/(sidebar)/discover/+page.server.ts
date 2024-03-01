import type { Actions, PageServerLoad } from './$types';
import db from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import { deleteMarketplace, getMarketplaceAppPath } from '$lib/server/marketplaces';
import { marketplaceApps, containerEngines } from '$lib/server/schema';
import { and, eq } from 'drizzle-orm';
import { up } from '$lib/server/compose';

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
    return { marketplaceApps, marketplaces, containerEngines };
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
        const id = data.get('id')?.toString() ?? '';
        const marketplaceUrl = data.get('marketplaceUrl')?.toString() ?? '';
        const containerEngineId = parseInt(data.get('containerEngineId')?.toString() ?? '');

        // Validation
        if (!id) {
            return fail(400, { id, invalid: true });
        }
        if (!marketplaceUrl) {
            return fail(400, { marketplaceUrl, invalid: true });
        }
        if (!containerEngineId) {
            return fail(400, { containerEngineId, invalid: true });
        }
        const marketplaceApp = await db.query.marketplaceApps.findFirst({
            where: and(
                eq(marketplaceApps.id, id),
                eq(marketplaceApps.marketplaceUrl, marketplaceUrl)
            )
        });
        if (!marketplaceApp) {
            return fail(400, { id, notFound: true });
        }
        const containerEngine = await db.query.containerEngines.findFirst({
            where: eq(containerEngines.id, containerEngineId)
        });
        if (!containerEngine) {
            return fail(400, { containerEngineId, notFound: true });
        }

        console.debug(id, marketplaceUrl, containerEngineId);
        // TODO check if the repository and container engine exist

        // TODO create app

        await up(getMarketplaceAppPath(marketplaceApp));
    }
};
