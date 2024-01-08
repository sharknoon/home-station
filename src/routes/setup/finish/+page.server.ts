import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import prisma from '$lib/server/prisma';
import { detectDomains } from '$lib/server/network';

export const load = (async () => {
	const system = await prisma.system.findFirst();
	if (system?.currentSetupStep !== 2) {
		return redirect(303, '/setup');
	}

	const detectedDomains = await detectDomains();

	return { detectedDomains };
}) satisfies PageServerLoad;
