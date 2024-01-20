import fs from 'node:fs/promises';
import { PUBLIC_CONTAINERIZED } from '$env/static/public';
import path from 'node:path';

/**
 * Checks if a path exists
 * @param path A path to a folder or a file e.g. /path/to/my/file.png
 * @returns true if the path exists, false otherwise
 */
export async function exists(path: string): Promise<boolean> {
	try {
		await fs.access(path, fs.constants.F_OK);
		return true;
	} catch {
		return false;
	}
}

/**
 * Checks if a url is valid
 * @param url A url e.g. https://example.com
 * @returns true if the url is valid, false otherwise
 */
export function isValidUrl(url: string): boolean {
	try {
		return Boolean(new URL(url));
	} catch {
		return false;
	}
}

// This is the main app path. In a container it must be mounted as a volume
let appDataPath: string;
// Default appdata directory path in a container
const containerAppDataPath = '/app/data';
// Default fallback appdata directory path in a container
const fallbackContainerAppDataPath = '/app/tmp';

if (PUBLIC_CONTAINERIZED === 'true') {
	appDataPath = containerAppDataPath;
	if (!(await exists(appDataPath))) {
		console.warn(
			"Running in container, but the data directory isn't mounted. Using fallback path!"
		);
		console.warn('-----------------------------------------------------');
		console.warn('| ALL DATA WILL BE LOST WHEN THE SERVER STOPS!      |');
		console.warn('| Please mount the "/app/data" directory like this: |');
		console.warn('| docker run -v /path/to/data:/app/data ...         |');
		console.warn('-----------------------------------------------------');
		appDataPath = fallbackContainerAppDataPath;
		await fs.mkdir(appDataPath, { recursive: true });
	}
	console.info(`Running in container, using "${appDataPath}" as data directory`);
} else {
	let homePath;
	switch (process.platform) {
		case 'win32':
			homePath = process.env.APPDATA;
			break;
		default:
			homePath = process.env.HOME;
	}
	if (!homePath) {
		console.error(
			'Could not find app-data/home directory path. Please make sure that the environment variable "HOME" (macOS/Linux) or "APPDATA" (Windows) is set.'
		);
		process.exit(1);
	}
	appDataPath = path.join(homePath, '.home-station');
	await fs.mkdir(appDataPath, { recursive: true });
	console.info(`Running on "${process.platform}", using "${appDataPath}" as data directory`);
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
