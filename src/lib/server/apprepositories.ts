import fs from 'node:fs/promises';
import {
    getRemoteInfo2,
    pull,
    clone,
    type AuthCallback,
    type ProgressCallback
} from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import path from 'node:path';
import yaml from 'js-yaml';
import db from '$lib/server/db';
import { appRepositories, availableApps } from '$lib/server/schema';
import { exists, isValidUrl } from '$lib/server/utils';
import { getAppDataPath } from '$lib/server/appdata';
import { type LocalizedString } from '$lib/i18n';
import { eq } from 'drizzle-orm';
import logger from '$lib/server/logger';

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

type AvailableApp = typeof availableApps.$inferInsert;
type AppRepository = typeof appRepositories.$inferInsert;

const appDataPath = await getAppDataPath();
const appReposPath = path.join(appDataPath, 'appRepositories');
await fs.mkdir(appReposPath, { recursive: true });

/**
 * Returns the path to the local cloned app repository
 * @param appRepository The apprepository object from the database
 * @returns The path to the local cloned app repository
*/
export function getAppRepositoryPath(appRepository: AppRepository): string {
    return path.join(appReposPath, appRepository.id);
}

export function getAppPath(app: AvailableApp): string {
    return path.join(appReposPath, app.appRepositoryId, 'apps', app.id);
}

function createAppRepositoryId(url: string): string {
    return url
        .replace('https://', '')
        .replace('http://', '')
        .replace(/\.git$/, "")
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase();
}

/**
 * Adds a new app repository to the database and tests if the credentials are valid (if provided).
 * The promise is rejected, if the credentials are invalid.
 * @param url The git repository URL of the app repository
 * @param username An optional git username
 * @param password An optional git password or token
 */
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

    // Test if credentials are valid
    const validCredentials = await testCredentials(url, username, password);
    if (!validCredentials) {
        throw new Error('Invalid credentials');
    }

    const id = createAppRepositoryId(url);

    await db.insert(appRepositories).values({ id, url, username, password }).onConflictDoNothing();
}

/**
 * Deletes an app repository from the database and removes the local cloned repository
 * @param id The id of the app repository to delete
 */
export async function deleteAppRepository(id: string): Promise<void> {
    const deletedAppRepository = await db
        .delete(appRepositories)
        .where(eq(appRepositories.id, id))
        .returning();
    // For loop unnecessary, but it's easier and more safe to implement than deletedAppRepository[0]
    for (const appRepository of deletedAppRepository) {
        const appRepoPath = getAppRepositoryPath(appRepository);
        await fs.rm(appRepoPath, { recursive: true, force: true });
    }
}

/**
 * Updates the available apps by pulling the app repositories and parsing the app.yml files
 * @param progress An optional callback that is called with the progress of the update
 */
export async function updateAvailableApps(
    progress: (progress: number | undefined) => void
): Promise<void> {
    const appRepos = await db.query.appRepositories.findMany();
    const apps: AvailableApp[] = [];
    for (const appRepo of appRepos) {
        const appIds = await pullAppRepository(appRepo, progress);
        for (const appId of appIds) {
            try {
                const appRepoPath = getAppRepositoryPath(appRepo);
                const appYamlPath = path.join(appRepoPath, 'apps', appId, 'app.yml');
                const app = await loadAppFromFiles(appYamlPath);
                apps.push({
                    appRepositoryId: appRepo.id,
                    ...app
                });
            } catch (e) {
                logger.warn(e);
            }
        }
    }
    await db.delete(availableApps);
    await db.insert(availableApps).values(apps);
}

/**
 * Pulls the apps from the app repository and returns the appIds
 */
async function pullAppRepository(
    appRepository: AppRepository,
    progress: (progress: number | undefined) => void
): Promise<string[]> {
    const appRepoPath = getAppRepositoryPath(appRepository);

    const onAuth: AuthCallback = () => ({
        username: appRepository.username ?? undefined,
        password: appRepository.password ?? undefined
    });
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
        logger.info(`Pulling "${appRepository.url}" to "${appRepoPath}"`);
        await pull({ fs, http, dir: appRepoPath, onAuth, onProgress, author });
    } else {
        logger.info(`Cloning "${appRepository.url}" to "${appRepoPath}"`);
        await clone({ fs, http, dir: appRepoPath, url: appRepository.url, onAuth, onProgress });
    }

    // Load the apps from the files
    try {
        const appsPath = path.join(appRepoPath, 'apps');
        return await fs.readdir(appsPath);
    } catch {
        logger.warn(`No "apps" directory found in "${appRepoPath}"! Skipping...`);
        return [];
    }
}

/**
 * Parses an app from the app.yml file
 * @param appYamlPath path to the app.yml file
 * @returns A promise that resolves to the app object
 */
async function loadAppFromFiles(appYamlPath: string): Promise<App> {
    if (!(await exists(appYamlPath))) {
        throw new Error(`No app.yml found in "${appYamlPath}! Skipping..."`);
    }

    const appYaml = await fs.readFile(appYamlPath, 'utf8');
    return yaml.load(appYaml) as App;
}

/**
 * Tests if the provided git repsitory is accessible. If it is public, no credentials are necessary.
 * @param url The git repository URL to test against
 * @param username An optional username
 * @param password An optional password or token
 * @returns A promise that resolves to true if the credentials are valid, false otherwise
 */
function testCredentials(url: string, username?: string, password?: string): Promise<boolean> {
    return new Promise((resolve) => {
        getRemoteInfo2({
            http,
            onAuth: username && password ? () => ({ username, password }) : undefined,
            onAuthFailure: () => resolve(false),
            onAuthSuccess: () => resolve(true),
            url
        });
    });
}
