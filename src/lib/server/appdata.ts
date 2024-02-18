import { PUBLIC_CONTAINERIZED } from '$env/static/public';
import { building } from '$app/environment';
import path from 'node:path';
import fs from 'node:fs/promises';
import os from 'node:os';
import { exists } from '$lib/server/utils';
import logger from '$lib/server/logger';

const testing = process.env.NODE_ENV === 'test';

// This is the main app path. In a container it must be mounted as a volume
let appDataPath: string;
// Default appdata directory path in a container
const containerAppDataPath = '/app/data';
// Default fallback appdata directory path in a container
const fallbackContainerAppDataPath = '/app/tmp';

if (PUBLIC_CONTAINERIZED === 'true') {
    appDataPath = containerAppDataPath;
    if (!(await exists(appDataPath))) {
        if (!building) {
            logger.warn(
                "Running in container, but the data directory isn't mounted. Using fallback path!"
            );
            logger.warn('-----------------------------------------------------');
            logger.warn('| ALL DATA WILL BE LOST WHEN THE SERVER STOPS!      |');
            logger.warn('| Please mount the "/app/data" directory like this: |');
            logger.warn('| docker run -v /path/to/data:/app/data ...         |');
            logger.warn('-----------------------------------------------------');
        }
        appDataPath = fallbackContainerAppDataPath;
        await fs.mkdir(appDataPath, { recursive: true });
    }
    logger.info(`Running in container, using "${appDataPath}" as data directory`);
} else {
    if (!testing) {
        appDataPath = path.join(os.homedir(), '.home-station');
    } else {
        appDataPath = path.join(os.tmpdir(), '.home-station');
    }
    await fs.mkdir(appDataPath, { recursive: true });
    logger.info(`Running on "${process.platform}", using "${appDataPath}" as data directory`);
}

/**
 * Checks if the app data is stored in a persistent manner. This is the case when the app
 * is running in a container and the data directory is mounted as a volume. If this is not
 * running in a container, the data is always persistent.
 * @returns An object containing the following information:
 * - isPersistent: true if the app data is persistent, false otherwise
 * - defaultAppDataPath: The default app data path, this is also the current app data path if mounted correctly
 * - currentAppDataPath: The current app data path, can be a temporary path if not mounted correctly
 */
export async function getAppDataPersistency(): Promise<{
    isPersistent: boolean;
    defaultAppDataPath: string;
    currentAppDataPath: string;
}> {
    if (PUBLIC_CONTAINERIZED === 'true') {
        return {
            isPersistent: await exists(containerAppDataPath),
            defaultAppDataPath: containerAppDataPath,
            currentAppDataPath: appDataPath
        };
    } else {
        return {
            isPersistent: true,
            defaultAppDataPath: appDataPath,
            currentAppDataPath: appDataPath
        };
    }
}

/**
 * Gets the path to the app data directory to store application data like the database, cloned app repositories, etc.
 * @returns The path to the app data directory
 */
export async function getAppDataPath(): Promise<string> {
    return appDataPath;
}
