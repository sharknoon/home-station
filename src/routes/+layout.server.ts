import type { LayoutServerLoad } from './$types';
import { getAppDataPersistency } from '$lib/server/utils';

// Yes this is a global state for all requests from any user
const appDataPersistency = await getAppDataPersistency();

export const load = (async ({ locals }) => {
    const language = locals.user?.language;
    const theme = locals.user?.theme;
    return { language, theme, appDataPersistency };
}) satisfies LayoutServerLoad;
