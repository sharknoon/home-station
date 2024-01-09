import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { detectDomains } from '$lib/server/network';
import { getEngines } from '$lib/server/containerengine';
import db from '$lib/server/db';

export const load = (async () => {
	const system = await db.query.systems.findFirst();
	if (system?.currentSetupStep !== 2) {
		return redirect(303, '/setup');
	}

	const detectedDomains = await detectDomains();

	const engine = getEngines()[0];

	const version = JSON.stringify(await engine.version());
	const containers = (await engine.listContainers({ all: true })).length;
	const images = (await engine.listImages()).length;
	const volumes = (await engine.listVolumes()).Volumes.length;

	return { detectedDomains, version, containers, images, volumes };
}) satisfies PageServerLoad;
