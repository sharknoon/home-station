import { join } from 'path';
import { getEngine, type ContainerEngine } from '$lib/server/containerengines';
import db from '$lib/server/db';
import { exec } from '$lib/server/terminal';
import { stripAnsi, throttle } from '$lib/server/utils';

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

export async function up(
    cwd: string,
    composeFile?: string,
    projectName?: string,
    progress?: (progress: number) => void
): Promise<void> {
    const customComposeFile = composeFile ? ['-f', composeFile] : [];
    const customProjectName = projectName ? ['-p', projectName] : [];
    const id = join(cwd, composeFile ?? 'compose.yml');
    const throttledProgress = throttle((p: number) => progress?.(p), 250);
    await exec(
        'docker',
        ['compose', ...customComposeFile, ...customProjectName, 'up', '-d', '--remove-orphans'],
        cwd,
        (data) => {
            if (!progress) return;
            const currentProgress = getPullProgress(id, data);
            if (currentProgress !== undefined) {
                throttledProgress(currentProgress);
            }
        }
    );
}

export async function down(
    cwd: string,
    composeFile?: string,
    projectName?: string,
    removeVolumes?: boolean
): Promise<void> {
    const customComposeFile = composeFile ? ['-f', composeFile] : [];
    const customProjectName = projectName ? ['-p', projectName] : [];
    const removeVolumesFlag = removeVolumes ? ['-v'] : [];
    await exec(
        'docker',
        [
            'compose',
            ...customComposeFile,
            ...customProjectName,
            'down',
            '--rmi',
            'all',
            '--remove-orphans',
            ...removeVolumesFlag
        ],
        cwd,
        (data) => process.stdout.write(data)
    );
}

/**
 * This function converts the textual data from the terminal to an overall progress
 * An example of the data is:
 *  fdad3543d514 Downloading [>                                                  ]       0B/2.161MB
 * @param composeFile the path to the compose file, used as the key in the progress map
 * @param data The data from the terminal
 */
function getPullProgress(composeFile: string, data: string): number | undefined {
    data = stripAnsi(data);
    console.log("'" + data + "'");
    return undefined;
}
