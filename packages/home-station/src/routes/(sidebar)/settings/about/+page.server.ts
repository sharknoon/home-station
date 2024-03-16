import { getVersion } from '$lib/server/webserver';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    return { caddyVersion: await getVersion() };
}) satisfies PageServerLoad;
