import { getVersion } from '$lib/server/webserver';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    return { traefikVersion: await getVersion() };
}) satisfies PageServerLoad;
