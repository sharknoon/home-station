import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import db from '$lib/server/db';

export const load = (async () => {
	const system = await db.query.systems.findFirst();
	switch (system?.currentSetupStep) {
		case 2:
			return redirect(303, '/setup/finish');
		case 1:
			return redirect(303, '/setup/container');
		case 0:
		default:
			return redirect(303, '/setup/signup');
	}
}) satisfies PageServerLoad;
