import type { LayoutServerLoad } from './$types';
import { getDataPersistency } from '$lib/server/data';

// Yes this is a global state for all requests from any user
const dataPersistency = await getDataPersistency();

export const load = (async ({ locals, request }) => {
    const user = locals.user;
    const url = request.url;
    return { user, url, dataPersistency };
}) satisfies LayoutServerLoad;
