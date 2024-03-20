import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { marketplaceApps } from '$lib/server/schema';
import { redirect } from '@sveltejs/kit';
import { getInstalledApps } from '$lib/server/apps';

export const load = (async ({ params }) => {
    const app = await db.query.marketplaceApps.findFirst({
        where: eq(marketplaceApps.uuid, params.uuid)
    });
    if (!app) {
        redirect(302, '/discover');
    }
    const installedApps = await getInstalledApps();

    return { app, installedApps };
}) satisfies PageServerLoad;
