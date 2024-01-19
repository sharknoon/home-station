import type { LayoutServerLoad } from './$types';
import { isAppDataPersistent } from '$lib/server/utils';

// Yes this is a global state for all requests from any user
const appDataPersistent = await isAppDataPersistent();

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();
	const language = session?.user?.language;
	const theme = session?.user?.theme;
	return { language, theme, appDataPersistent };
}) satisfies LayoutServerLoad;
