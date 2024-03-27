import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { marketplaceApps } from '$lib/server/schema';
import { redirect } from '@sveltejs/kit';
import { installedApps } from '$lib/server/apps';
import { get } from 'svelte/store';

export const load = (async ({ params }) => {
    const app = await db.query.marketplaceApps.findFirst({
        where: eq(marketplaceApps.uuid, params.uuid)
    });
    if (!app) {
        redirect(302, '/discover');
    }

    return { app, installedApps: get(installedApps) };
}) satisfies PageServerLoad;
