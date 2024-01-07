import prisma from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { testLocalConnection } from '$lib/server/containerengine';

export const load = (async () => {
	const system = await prisma.system.findFirst();
	if (system?.currentSetupStep !== 1) {
		return redirect(303, '/setup');
	}
	return {};
}) satisfies PageServerLoad;

export const actions = {
	async connectLocally() {
		return testLocalConnection()
			.then(() => {
				return { success: true };
			})
			.catch((err) => {
				return { error: err.toString() };
			});
	}
} satisfies Actions;
