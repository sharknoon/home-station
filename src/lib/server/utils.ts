import fs from 'node:fs/promises';

export async function exists(path: string): Promise<boolean> {
	try {
		await fs.access(path, fs.constants.F_OK);
		return true;
	} catch {
		return false;
	}
}

export function isValidUrl(url: string): boolean {
	try {
		return Boolean(new URL(url));
	} catch {
		return false;
	}
}

// This is the mein data directory. It must be mounted as a volume
export const appDataPath = '/app/data';
// In case the appPath isn't mounted, use this fallback path
export const fallbackAppDataPath = '/app/tmp';

export async function isAppDataVolumeMounted(): Promise<boolean> {
	return await exists(appDataPath);
}

export async function getAppDataDirectory(): Promise<string> {
	if (await isAppDataVolumeMounted()) {
		return appDataPath;
	} else {
		return fallbackAppDataPath;
	}
}
