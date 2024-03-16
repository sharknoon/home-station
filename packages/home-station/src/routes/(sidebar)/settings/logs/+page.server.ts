import type { PageServerLoad } from './$types';
import { logs } from '$lib/server/logger';

export const load = (async () => {
    return { logs: JSON.stringify(logs) };
}) satisfies PageServerLoad;
