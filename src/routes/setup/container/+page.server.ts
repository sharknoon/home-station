import prisma from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const system = await prisma.system.findFirst();
	if (system?.currentSetupStep !== 1) {
		return redirect(303, '/setup');
	}
	return {};
}) satisfies PageServerLoad;
