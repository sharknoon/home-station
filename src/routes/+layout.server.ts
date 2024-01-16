import type { LayoutServerLoad } from './$types';
import { appDataPath, isAppDataVolumeMounted } from '$lib/server/utils';

// Yes this is a global state for all requests from any user
const dataVolumeMounted = await isAppDataVolumeMounted();

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();
	const language = session?.user?.language;
	const theme = session?.user?.theme;
	return { language, theme, dataVolumeMounted, appDataPath };
}) satisfies LayoutServerLoad;
