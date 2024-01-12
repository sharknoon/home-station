import type { PageServerLoad } from './$types';
import { appDataPath } from '$lib/server/utils';
import db from '$lib/server/db';

export const load = (async () => {
	const apps = await db.query.availableApps.findMany();
	return { apps, appDataPath };
}) satisfies PageServerLoad;
