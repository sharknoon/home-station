import type { PageServerLoad } from './$types';
import db from '$lib/server/db';

export const load = (async () => {
    const apps = await db.query.availableApps.findMany({
        with: { appRepository: { columns: { url: true } } }
    });
    const appRepositories = await db.query.appRepositories.findMany({
        columns: { password: false }
    });
    return { apps, appRepositories };
}) satisfies PageServerLoad;
