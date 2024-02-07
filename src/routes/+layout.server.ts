import type { LayoutServerLoad } from './$types';
import { getAppDataPersistency } from '$lib/server/utils';

// Yes this is a global state for all requests from any user
const appDataPersistency = await getAppDataPersistency();

export const load = (async ({ locals, request }) => {
    const user = locals.user;
    const url = request.url;
    return { user, url, appDataPersistency };
}) satisfies LayoutServerLoad;
