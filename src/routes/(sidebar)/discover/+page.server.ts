import type { PageServerLoad } from './$types';
import db from '$lib/server/db';

export const load = (async () => {
	const apps = await db.query.availableApps.findMany();
	return { apps };
}) satisfies PageServerLoad;
