import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    const domainsAndHostnames = await db.query.hostnames.findMany();
    return { domainsAndHostnames };
}) satisfies PageServerLoad;
