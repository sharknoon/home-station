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

// This is the main app directory. In a container it must be mounted as a volume
let appDataDirectory: string;
if (PUBLIC_CONTAINERIZED === 'true') {
	appDataDirectory = '/app/data';
	if (!(await exists(appDataDirectory))) {
		console.warn(
			"Running in container, but the data directory isn't mounted. Using fallback path!"
		);
		console.warn('-----------------------------------------------------');
		console.warn('| ALL DATA WILL BE LOST WHEN THE SERVER STOPS!      |');
		console.warn('| Please mount the "/app/data" directory like this: |');
		console.warn('| docker run -v /path/to/data:/app/data ...         |');
		console.warn('-----------------------------------------------------');
		appDataDirectory = '/app/tmp';
		await fs.mkdir(appDataDirectory, { recursive: true });
	}
	console.info(`Running in container, using "${appDataDirectory}" as data directory`);
} else {
	let homeDirectory;
	switch (process.platform) {
		case 'win32':
			homeDirectory = process.env.APPDATA;
			break;
		default:
			homeDirectory = process.env.HOME;
	}
	if (!homeDirectory) {
		console.error(
			'Could not find app-data/home directory. Please make sure that the environment variable "HOME" (macOS/Linux) or "APPDATA" (Windows) is set.'
		);
		process.exit(1);
	}
	appDataDirectory = path.join(homeDirectory, '.home-station');
	await fs.mkdir(appDataDirectory, { recursive: true });
	console.info(`Running on "${process.platform}", using "${appDataDirectory}" as data directory`);
}

/**
 * Checks if the app data is stored in a persistent manner. This is the case when the app 
 * is running in a container and the data directory is mounted as a volume. If this is not
 * running in a container, the data is always persistent.
 * @returns true if the app data is persistent, false otherwise
 */
export async function isAppDataPersistent(): Promise<boolean> {
	if (PUBLIC_CONTAINERIZED === 'true') {
		return await exists('/app/data');
	} else {
		return true;
	}
}

/**
 * Gets the path to the app data directory to store application data like the database, cloned app repositories, etc.
 * @returns The path to the app data directory
 */
export async function getAppDataPath(): Promise<string> {
	return appDataDirectory;
}
