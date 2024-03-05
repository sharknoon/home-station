import { join } from 'path';
import { getEngine, type ContainerEngine } from '$lib/server/containerengines';
import db from '$lib/server/db';
import { exec } from '$lib/server/terminal';
import { throttle } from '$lib/server/utils';

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
        [
            'compose',
            '--progress',
            'plain',
            ...customComposeFile,
            ...customProjectName,
            'up',
            '-d',
            '--remove-orphans'
        ],
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

const dataPerComposeFile = new Map<string, string>();

// A map of progress for each layer of each compose file
// Map<composeFile, Map<layerHash, [state, current, total]>>
const pullProgressPerLayer = new Map<
    string,
    Map<string, ['download' | 'extract', number, number]>
>();

/**
 * This function converts the textuak data from the terminal to an overall progress
 * An example of the data is:
 *  fdad3543d514 Downloading [>                                                  ]       0B/2.161MB
 * @param composeFile the path to the compose file, used as the key in the progress map
 * @param data The data from the terminal
 */
function getPullProgress(composeFile: string, data: string): number | undefined {
    // Remove ANSI escape codes
    //data = stripAnsi(data);

    // If it has finished downloading, exit early
    if (data.toLowerCase().includes('pulled')) return 1;

    // sometimes one line is split over multiple data events, so we have to wait until we have the full line
    const newData = (dataPerComposeFile.get(composeFile) ?? '') + data;
    let lines;
    if (newData.includes('\r\n')) {
        lines = newData.split('\r\n');
        console.log('All Lines: ' + lines);
        dataPerComposeFile.set(composeFile, lines.pop()!);
        console.log('New Lines: ' + lines);
        console.log('Last line: ' + dataPerComposeFile.get(composeFile));
    } else if (newData.includes('\n')) {
        lines = newData.split('\n');
        dataPerComposeFile.set(composeFile, lines.pop()!);
    } else {
        dataPerComposeFile.set(composeFile, newData);
        return;
    }

    for (const line of lines) {
        console.log('Line: ' + line);

        const match = line.match(
            /([0-9a-f]{12,}).*?(\w+).*?([0-9.]+)([a-zA-Z]+)\/([0-9.]+)([a-zA-Z]+)/
        );
        if (!match) return undefined;

        const layerHash = match[1];
        const status = match[2].toLowerCase();
        let current = parseFloat(match[3]);
        const currentUnit = match[4].toLowerCase();
        let total = parseFloat(match[5]);
        const totalUnit = match[6].toLowerCase();

        // The unit of progress and total can differ, therefore we need to convert them to the same unit, bytes
        switch (currentUnit) {
            case 'kb':
                current *= 1024;
                break;
            case 'mb':
                current *= 1024 * 1024;
                break;
            case 'gb':
                current *= 1024 * 1024 * 1024;
                break;
            case 'tb':
                current *= 1024 * 1024 * 1024 * 1024;
                break;
            case 'pb':
                current *= 1024 * 1024 * 1024 * 1024 * 1024;
                break;
        }
        switch (totalUnit) {
            case 'kb':
                total *= 1024;
                break;
            case 'mb':
                total *= 1024 * 1024;
                break;
            case 'gb':
                total *= 1024 * 1024 * 1024;
                break;
            case 'tb':
                total *= 1024 * 1024 * 1024 * 1024;
                break;
            case 'pb':
                total *= 1024 * 1024 * 1024 * 1024 * 1024;
                break;
        }

        console.log(`${current} / ${total}`);

        let state: 'download' | 'extract';
        if (status.includes('download')) {
            state = 'download';
        } else if (status.includes('extract')) {
            state = 'extract';
        } else {
            return;
        }

        const composeFileProgress =
            pullProgressPerLayer.get(composeFile) ??
            new Map<string, ['download' | 'extract', number, number]>();
        composeFileProgress.set(layerHash, [state, current, total]);
        pullProgressPerLayer.set(composeFile, composeFileProgress);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_, layers] of pullProgressPerLayer) {
        let currentDownloading = 0;
        let currentExtracting = 0;
        let totalDownloading = 0;
        let totalExtracting = 0;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, [state, c, t]] of layers) {
            if (state === 'download') {
                currentDownloading += c;
                totalDownloading += t;
            } else {
                currentExtracting += c;
                totalExtracting += t;
            }
        }

        // Assume that downloading takes 3 times as long as extracting
        const current = currentDownloading * 3 + currentExtracting;
        const total = totalDownloading * 3 + totalExtracting;

        return current / total;
    }
}
