import type { PageServerLoad } from './$types';
import db from '$lib/server/db';
import { testLocalConnection, testRemoteConnection } from '$lib/server/containerengines';
import type { containerEngines } from '$lib/server/schema';

type ContainerEngine = typeof containerEngines.$inferInsert & {
	numberOfCPUs?: number;
	totalMemory?: number;
	numberOfStacks?: number;
	numberOfContainers?: number;
	numberOfImages?: number;
	numberOfVolumes?: number;
	up?: boolean;
};

export const load = (async () => {
	const containerEngines: ContainerEngine[] = await db.query.containerEngines.findMany();
	for (const engine of containerEngines) {
		try {
			let docker;
			if (engine.host) {
				docker = await testRemoteConnection(
					engine.host,
					engine.ca ?? undefined,
					engine.cert ?? undefined,
					engine.key ?? undefined
				);
			} else {
				docker = await testLocalConnection(engine.socketPath ?? undefined);
			}
			const info = await docker.info();
			const volumes = await docker.listVolumes();
			const stacks = (await docker.listContainers({ all: true }))
				.filter((container) => container.Labels?.['com.docker.compose.project'])
				.map((container) => container.Labels?.['com.docker.compose.project'])
				.filter((value, index, self) => self.indexOf(value) === index);
			engine.up = true;
			engine.numberOfCPUs = info?.NCPU ?? 0;
			engine.totalMemory = info?.MemTotal ?? 0;
			engine.numberOfStacks = stacks?.length ?? 0;
			engine.numberOfContainers = info?.Containers ?? 0;
			engine.numberOfImages = info?.Images ?? 0;
			engine.numberOfVolumes = volumes?.Volumes?.length ?? 0;
		} catch {
			engine.up = false;
		}
	}

	return { containerEngines };
}) satisfies PageServerLoad;
