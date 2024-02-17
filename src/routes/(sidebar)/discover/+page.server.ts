import type { Actions, PageServerLoad } from './$types';
import db from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import { deleteAppRepository, getAppPath } from '$lib/server/apprepositories';
import { availableApps, containerEngines } from '$lib/server/schema';
import { and, eq } from 'drizzle-orm';
import DockerodeCompose from 'dockerode-compose';
import { getEngine } from '$lib/server/containerengines';
import { join } from 'node:path';

export const load = (async () => {
    const apps = await db.query.availableApps.findMany({
        with: { appRepository: { columns: { id: true, url: true } } }
    });
    const appRepositories = await db.query.appRepositories.findMany({
        columns: { password: false }
    });
    const containerEngines = await db.query.containerEngines.findMany({
        columns: { id: true, name: true, type: true }
    });
    return { apps, appRepositories, containerEngines };
}) satisfies PageServerLoad;

export const actions: Actions = {
    deleteRepository: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id')?.toString();

        if (!id) {
            return fail(400, { id, invalid: true });
        }

        // TODO check if the repository is used by an app

        await deleteAppRepository(id);
    },
    installApp: async ({ request }) => {
        const data = await request.formData();
        const appId = data.get('appId')?.toString() ?? '';
        const appRepositoryId = data.get('appRepositoryId')?.toString() ?? '';
        const containerEngineId = parseInt(data.get('containerEngineId')?.toString() ?? '');

        if (!appId) {
            return fail(400, { appId, invalid: true });
        }
        if (!appRepositoryId) {
            return fail(400, { appRepositoryId, invalid: true });
        }
        if (!containerEngineId) {
            return fail(400, { containerEngineId, invalid: true });
        }

        const app = await db.query.availableApps.findFirst({
            where: and(
                eq(availableApps.id, appId),
                eq(availableApps.appRepositoryId, appRepositoryId)
            )
        });
        if (!app) {
            return fail(400, { appId, notFound: true });
        }

        const containerEngine = await db.query.containerEngines.findFirst({
            where: eq(containerEngines.id, containerEngineId)
        });
        if (!containerEngine) {
            return fail(400, { containerEngineId, notFound: true });
        }

        
        const dockerode = await getEngine(containerEngine);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const dockerodeCompose = new DockerodeCompose(
            dockerode,
            join(getAppPath(app), "compose.yml"),
            `${app.appRepositoryId}_${app.id}`
        );

        //dockerodeCompose.up();

        console.debug(appId, appRepositoryId, containerEngineId);
        // TODO check if the repository and container engine exist

        // TODO create app
    }
};
