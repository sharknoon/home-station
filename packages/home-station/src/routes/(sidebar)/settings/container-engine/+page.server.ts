import type { PageServerLoad } from './$types';
import { containerEngine } from '$lib/server/containerengines';

type ContainerEngineStats = {
    numberOfCPUs?: number;
    totalMemory?: number;
    numberOfStacks?: number;
    numberOfContainers?: number;
    numberOfImages?: number;
    numberOfVolumes?: number;
    up?: boolean;
};

export const load = (async () => {
    const stats: ContainerEngineStats = {
        numberOfCPUs: 0,
        totalMemory: 0,
        numberOfStacks: 0,
        numberOfContainers: 0,
        numberOfImages: 0,
        numberOfVolumes: 0,
        up: false
    };
    try {
        const info = await containerEngine.info();
        const volumes = await containerEngine.listVolumes();
        const stacks = (await containerEngine.listContainers({ all: true }))
            .filter((container) => container.Labels?.['com.docker.compose.project'])
            .map((container) => container.Labels?.['com.docker.compose.project'])
            .filter((value, index, self) => self.indexOf(value) === index);
        stats.numberOfCPUs = info?.NCPU ?? 0;
        stats.totalMemory = info?.MemTotal ?? 0;
        stats.numberOfStacks = stacks?.length ?? 0;
        stats.numberOfContainers = info?.Containers ?? 0;
        stats.numberOfImages = info?.Images ?? 0;
        stats.numberOfVolumes = volumes?.Volumes?.length ?? 0;
        stats.up = true;
    } catch {
        stats.up = false;
    }

    return { stats };
}) satisfies PageServerLoad;
