import { getVersion } from '$lib/server/proxy';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    return { traefikVersion: await getVersion() };
}) satisfies PageServerLoad;
