import fs from 'node:fs/promises';
import git, { type AuthCallback, type ProgressCallback } from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import path from 'node:path';
import yaml from 'js-yaml';
import db from '$lib/server/db';
import { appRepositories, availableApps } from '$lib/server/schema';
import { exists, getAppDataPath, isValidUrl } from './utils';
import { type LocalizedString } from '$lib/i18n';

export type App = {
	id: string;
	name: LocalizedString;
	description: LocalizedString;
	icon: string;
	banner?: string;
	links: AppLinks;
	publishedAt: string;
	developer: string;
	category: 'File Transfer - Web-based File Managers';
	config?: AppConfig[];
	http: AppHttp[];
	messages?: AppMessages;
};

export type AppLinks = {
	repository: string;
	website?: string;
	custom?: CustomAppLinks[];
};

export type CustomAppLinks = {
	id: string;
	name: LocalizedString;
	url: string;
};

export type AppConfig = {
	id: string;
	name: LocalizedString;
	description: LocalizedString;
	type:
		| 'string'
		| 'boolean'
		| 'number'
		| 'select'
		| 'range'
		| 'color'
		| 'date'
		| 'datetime'
		| 'email'
		| 'month'
		| 'password'
		| 'telephone'
		| 'time'
		| 'url'
		| 'week';
	required: boolean;
	default?: string;
	environment?: string;
	'form-validation'?: string;
	'value-validation'?: string;
};

export type AppHttp = {
	port: number;
	description: LocalizedString;
	subdomain: string;
};

export type AppMessages = {
	'post-install'?: LocalizedString;
};

const appDataPath = await getAppDataPath();
const appReposPath = path.join(appDataPath, 'appRepositories');
await fs.mkdir(appReposPath, { recursive: true });

export async function createAppRepository(
	url: string,
	username?: string,
	password?: string
): Promise<void> {
	url = url.trim();
	if (url.endsWith('/')) url = url.slice(0, url.lastIndexOf('/'));
	if (!url.endsWith('.git')) url += '.git';

	if (!isValidUrl(url)) {
		throw new Error('Invalid URL (example: "https://github.com/<user>/<repo>")');
	}

	await db.insert(appRepositories).values({ url, username, password });
}

export async function updateAvailableApps(
	progress: (progress: number | undefined) => void
): Promise<void> {
	const appRepos = await db.query.appRepositories.findMany();
	const apps: (typeof availableApps.$inferInsert)[] = [];
	for (const { id, url, username, password } of appRepos) {
		const appsInRepo = await fetchAppRepository(
			url,
			progress,
			username ?? undefined,
			password ?? undefined
		);
		const dbApps = appsInRepo.map((app) => {
			const dbApp: typeof availableApps.$inferInsert = {
				appRepositoryId: id,
				...app
			};
			return dbApp;
		});
		apps.push(...dbApps);
	}
	// https://github.com/drizzle-team/drizzle-orm/issues/1728
	// TODO As long as mass-upserting isn't supported, we do it like this:
	await db.delete(availableApps);
	await db.insert(availableApps).values(apps);
}

export async function fetchAppRepository(
	url: string,
	progress: (progress: number | undefined) => void,
	username?: string,
	password?: string
): Promise<App[]> {
	// Create a folder for the app repo if it doesn't exist
	const appRepoPath = path.join(
		appReposPath,
		url
			.replace('https://', '')
			.replace(/[^a-z0-9]/gi, '_')
			.toLowerCase()
	);

	const onAuth: AuthCallback = () => ({ username, password });
	const onProgress: ProgressCallback = (event) => {
		if (event.total) {
			progress(event.loaded / event.total);
		} else {
			progress(undefined);
		}
	};
	const author = { name: 'Home Station' };

	// If the app repo was already cloned, pull the latest changes
	const appRepoExists = await exists(path.join(appRepoPath, '.git'));
	if (appRepoExists) {
		console.info(`Pulling "${url}" to "${appRepoPath}"`);
		await git.pull({ fs, http, dir: appRepoPath, onAuth, onProgress, author });
	} else {
		console.info(`Cloning "${url}" to "${appRepoPath}"`);
		await git.clone({ fs, http, dir: appRepoPath, url, onAuth, onProgress });
	}

	// Load the apps from the files
	const apps: App[] = [];
	const appsPath = path.join(appRepoPath, 'apps');
	for (const appName of await fs.readdir(appsPath)) {
		try {
			const app = await loadAppFromFiles(path.join(appsPath, appName));
			apps.push(app);
		} catch {
			/* empty */
		}
	}

	return apps;
}

async function loadAppFromFiles(appPath: string): Promise<App> {
	if (await exists(path.join(appPath, 'app.yml'))) {
		const appYaml = await fs.readFile(path.join(appPath, 'app.yml'), 'utf8');
		return yaml.load(appYaml) as App;
	} else {
		console.warn(`No app.yml found in "${appPath}! Skipping..."`);
		throw new Error(`No app.yml found in "${appPath}! Skipping..."`);
	}
}
