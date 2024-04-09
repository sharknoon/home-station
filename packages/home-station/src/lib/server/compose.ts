import { containerEngine } from '$lib/server/containerengines';
import { exec } from '$lib/server/terminal';
import { throttle } from '$lib/server/utils';
import { stripAnsi } from '$lib/utils';

export async function listStacks(): Promise<string[]> {
    const stacks = new Set<string>();
    const containers = await containerEngine.listContainers({ all: true });
    for (const container of containers) {
        const stack = container.Labels['com.docker.compose.project'];
        if (stack) stacks.add(stack);
    }
    return Array.from(stacks);
}

export async function up(
    cwd: string,
    projectName: string,
    composeFiles?: string[],
    progress?: (progress: number) => void
): Promise<void> {
    const customComposeFiles = composeFiles ? composeFiles.flatMap((c) => ['-f', c]) : [];
    const customProjectName = projectName ? ['-p', projectName] : [];
    const throttledProgress = throttle((p: number) => progress?.(p), 250);
    await exec(
        'docker',
        ['compose', ...customComposeFiles, ...customProjectName, 'up', '-d', '--remove-orphans'],
        {
            cwd,
            dataCallback: (data) => {
                if (!progress) return;
                const currentProgress = getPullProgress(projectName, data);
                if (currentProgress !== undefined) {
                    throttledProgress(currentProgress);
                }
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
        { cwd, dataCallback: process.stdout.write }
    );
}

/**
 * This function converts the textual data from the terminal to an overall progress
 * An example of the data is:
 *  fdad3543d514 Downloading [>                                                  ]       0B/2.161MB
 * @param projectName the project name of the compose project, used as the key in the progress map
 * @param data The data from the terminal
 */
function getPullProgress(projectName: string, data: string): number | undefined {
    data = stripAnsi(data);
    console.log("'" + data + "'");
    return undefined;
}
