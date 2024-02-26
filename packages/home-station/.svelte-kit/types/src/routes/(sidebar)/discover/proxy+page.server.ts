// @ts-nocheck
import type { Actions, PageServerLoad } from './$types';
import db from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import { deleteMarketplace, getMarketplaceAppPath } from '$lib/server/marketplaces';
import { marketplaceApps, containerEngines, apps } from '$lib/server/schema';
import { and, eq } from 'drizzle-orm';
import DockerodeCompose from 'dockerode-compose';
import { getEngine } from '$lib/server/containerengines';
import { join } from 'node:path';

export const load = (async () => {
    const marketplaceApps = await db.query.marketplaceApps.findMany({
        with: { marketplace: { columns: { id: true, gitRemoteUrl: true } } }
    });
    const marketplaces = await db.query.marketplaces.findMany({
        columns: { gitPassword: false }
    });
    const containerEngines = await db.query.containerEngines.findMany({
        columns: { id: true, name: true, type: true }
    });
    return { marketplaceApps, marketplaces, containerEngines };
}) satisfies PageServerLoad;

export const actions = {
    deleteRepository: async ({ request }: import('./$types').RequestEvent) => {
        const data = await request.formData();
        const id = data.get('id')?.toString();

        if (!id) {
            return fail(400, { id, invalid: true });
        }

        // TODO check if the repository is used by an app

        await deleteMarketplace(id);
    },
    installApp: async ({ request }: import('./$types').RequestEvent) => {
        // Get necessary data
        const data = await request.formData();
        const appId = data.get('appId')?.toString() ?? '';
        const marketplaceId = data.get('marketplaceId')?.toString() ?? '';
        const containerEngineId = parseInt(data.get('containerEngineId')?.toString() ?? '');

        // Validation
        if (!appId) {
            return fail(400, { appId, invalid: true });
        }
        if (!marketplaceId) {
            return fail(400, { marketplaceId, invalid: true });
        }
        if (!containerEngineId) {
            return fail(400, { containerEngineId, invalid: true });
        }
        const marketplaceApp = await db.query.marketplaceApps.findFirst({
            where: and(
                eq(marketplaceApps.appId, appId),
                eq(marketplaceApps.marketplaceId, marketplaceId)
            )
        });
        if (!marketplaceApp) {
            return fail(400, { appId, notFound: true });
        }
        const containerEngine = await db.query.containerEngines.findFirst({
            where: eq(containerEngines.id, containerEngineId)
        });
        if (!containerEngine) {
            return fail(400, { containerEngineId, notFound: true });
        }

        // Install the app
        await db
            .insert(apps)
            .values({
                appId: marketplaceApp.appId,
                marketplaceId: marketplaceApp.marketplaceId,
                containerEngineId: containerEngine.id,
                installedAt: Date.now()
            })
            .onConflictDoNothing();
        const dockerode = await getEngine(containerEngine);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const dockerodeCompose = new DockerodeCompose(
            dockerode,
            join(getMarketplaceAppPath(marketplaceApp), 'compose.yml'),
            `${marketplaceApp.marketplaceId}_${marketplaceApp.appId}`
        );

        //dockerodeCompose.up();

        console.debug(appId, marketplaceId, containerEngineId);
        // TODO check if the repository and container engine exist

        // TODO create app
    }
};
;null as any as Actions;