import fs from 'node:fs/promises';
import git, { type AuthCallback, type ProgressCallback } from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import path from 'node:path';
import yaml from 'js-yaml';
import db from '$lib/server/db';
import { appRepositories, availableApps } from '$lib/server/schema';
import { exists, getAppDataDirectory, isValidUrl } from './utils';

export type App = {
	id: string;
	name: string;
	description: string;
	icon: string;
	banner?: string;
	links: {
		repository: string;
		website?: string;
		custom?: {
			name: string;
			url: string;
		}[];
	};
	publishedAt: string;
	developer: string;
	category: 'File Transfer - Web-based File Managers';
	config?: {
		id: string;
		name: string;
		description: string;
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
	}[];
	http: {
		port: number;
		description: string;
		subdomain: string;
	}[];
	messages?: {
		'post-install'?: string;
	};
};

const appReposPath = path.join(await getAppDataDirectory(), 'appRepositories');
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
		apps.push(
			...appsInRepo.map((app) => {
				const dbApp: typeof availableApps.$inferInsert = {
					appId: app.id,
					appRepositoryId: id,
					name: app.name,
					description: app.description,
					icon: app.icon,
					banner: app.banner,
					links: app.links,
					publishedAt: app.publishedAt,
					developer: app.developer,
					category: app.category
				};
				return dbApp;
			})
		);
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
		//updateLabel(event.phase)
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

	progress(1);
	return apps;
}

async function loadAppFromFiles(appPath: string): Promise<App> {
	if (await exists(path.join(appPath, 'app.yml'))) {
		const appYaml = await fs.readFile(path.join(appPath, 'app.yml'), 'utf8');
		const app = yaml.load(appYaml) as App;
		app.icon = path.join(appPath, app.icon);
		if (app.banner) app.banner = path.join(appPath, app.banner);
		return app;
	} else {
		console.warn(`No app.yml found in "${appPath}! Skipping..."`);
		throw new Error(`No app.yml found in "${appPath}! Skipping..."`);
	}
}
