import { PUBLIC_CONTAINERIZED } from '$env/static/public';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment';
import path from 'node:path';
import fs from 'node:fs/promises';
import os from 'node:os';
import { exists } from '$lib/server/utils';
import { logger } from '$lib/server/logger';

const TESTING = env.NODE_ENV === 'test';

// This is the main data path. In a container it must be mounted as a volume
let dataPath: string;
// Default data directory path in a container
const CONTAINER_DATA_PATH = '/data';

if (PUBLIC_CONTAINERIZED === 'true') {
    dataPath = CONTAINER_DATA_PATH;
    if (!(await exists(dataPath))) {
        if (!building) {
            logger.warn(
                "Running in container, but the data directory isn't mounted. Using a temporary fallback path!"
            );
            logger.warn('-----------------------------------------------------');
            logger.warn('| ALL DATA WILL BE LOST WHEN THE SERVER STOPS!      |');
            logger.warn('| Please mount the "/data" directory like this:     |');
            logger.warn('| docker run -v /path/to/data:/data ...             |');
            logger.warn('-----------------------------------------------------');
        }
        dataPath = os.tmpdir();
        await fs.mkdir(dataPath, { recursive: true });
    }
    logger.info(`Running in container, using "${dataPath}" as data directory`);
} else {
    if (!TESTING) {
        dataPath = path.join(os.homedir(), '.home-station');
    } else {
        dataPath = path.join(os.tmpdir(), '.home-station');
    }
    await fs.mkdir(dataPath, { recursive: true });
    logger.info(`Running on "${process.platform}", using "${dataPath}" as data directory`);
}

/**
 * Checks if the application data is stored in a persistent manner. This is the case when the app
 * is running in a container and the data directory is mounted as a volume. If this is not
 * running in a container, the data is always persistent.
 * @returns An object containing the following information:
 * - isPersistent: true if the data is persistent, false otherwise
 * - defaultDataPath: The default data path, this is also the current data path if mounted correctly
 * - currentDataPath: The current data path, can be a temporary path if not mounted correctly
 */
export async function getDataPersistency(): Promise<{
    isPersistent: boolean;
    defaultDataPath: string;
    currentDataPath: string;
}> {
    if (PUBLIC_CONTAINERIZED === 'true') {
        return {
            isPersistent: await exists(CONTAINER_DATA_PATH),
            defaultDataPath: CONTAINER_DATA_PATH,
            currentDataPath: dataPath
        };
    } else {
        return {
            isPersistent: true,
            defaultDataPath: dataPath,
            currentDataPath: dataPath
        };
    }
}

/**
 * Gets the path to the data directory to store application data like the database, cloned marketplace repositories, etc.
 * @returns The path to the data directory
 */
export async function getDataPath(): Promise<string> {
    return dataPath;
}
