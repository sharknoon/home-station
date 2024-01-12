import type { LayoutServerLoad } from './$types';
import { appDataPath, isAppDataVolumeMounted } from '$lib/server/utils';

// Yes this is a global state for all requests from any user
const dataVolumeMounted = await isAppDataVolumeMounted();

export const load = (async () => {
	return { dataVolumeMounted, appDataPath };
}) satisfies LayoutServerLoad;
