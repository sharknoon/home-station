import { getEngine, type ContainerEngine } from '$lib/server/containerengines';
import db from '$lib/server/db';
import { exec } from './terminal';

export async function listStacks(engine?: ContainerEngine): Promise<string[]> {
    const engines = engine ? [engine] : await db.query.containerEngines.findMany();
    const stacks = new Set<string>();
    for (const engine of engines) {
        const docker = await getEngine(engine);
        const containers = await docker.listContainers({ all: true });
        for (const container of containers) {
            const stack = container.Labels['com.docker.compose.project'];
            if (stack) stacks.add(stack);
        }
    }
    return Array.from(stacks);
}

export async function up(cwd: string, composeFile?: string): Promise<void> {
    console.log('up', cwd, composeFile);
    const composeFiles = composeFile ? ['-f', composeFile] : [];
    await exec('docker', ['compose', '--progress', 'plain', ...composeFiles, 'up', '-d'], cwd);
}
