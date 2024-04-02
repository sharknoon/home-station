import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { marketplaceApps } from '$lib/server/schema';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ params }) => {
    const appId = params.id;
    const app = await db.query.marketplaceApps.findFirst({
        where: eq(marketplaceApps.id, appId)
    });

    if (!app) {
        return redirect(303, '/');
    }
    return { app };
}) satisfies PageServerLoad;
