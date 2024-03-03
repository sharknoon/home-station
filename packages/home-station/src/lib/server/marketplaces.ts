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
import { marketplaces, marketplaceApps } from '$lib/server/schema';
import { exists, isValidUrl } from '$lib/server/utils';
import { getAppDataPath } from '$lib/server/appdata';
import { type LocalizedString } from '$lib/i18n';
import { eq } from 'drizzle-orm';
import logger from '$lib/server/logger';

export type RemoteMarketplaceApp = {
    id: string;
    name: LocalizedString;
    description: LocalizedString;
    icon: string;
    banner?: string;
    links: Links;
    publishedAt: string;
    developer: string;
    category: 'File Transfer - Web-based File Managers';
    config?: Config[];
    http: Http[];
    messages?: Messages;
};

export type Links = {
    repository: string;
    website?: string;
    custom?: CustomLinks[];
};

export type CustomLinks = {
    id: string;
    name: LocalizedString;
    url: string;
};

export type Config = {
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

export type Http = {
    port: number;
    description: LocalizedString;
    subdomain: string;
};

export type Messages = {
    'post-install'?: LocalizedString;
};

export type MarketplaceApp = typeof marketplaceApps.$inferInsert;
export type Marketplace = typeof marketplaces.$inferInsert;

const appDataPath = await getAppDataPath();
const marketplacesPath = path.join(appDataPath, 'marketplaces');
await fs.mkdir(marketplacesPath, { recursive: true });

/**
 * Returns the path to the local cloned marketplace repository
 * @param marketplace The marketplace object from the database
 * @returns The path to the local cloned marketplace repository
 */
export function getMarketplacePath(marketplace: Marketplace): string {
    const dirName = getDirectoryNameFromUrl(marketplace.gitRemoteUrl);
    return path.join(marketplacesPath, dirName);
}

/**
 * Returns the path to a specific app in the local cloned marketplace repository
 * @param app The app object from the database
 * @returns The path to the app in the local cloned marketplace repository
 */
export function getMarketplaceAppPath(app: MarketplaceApp): string {
    const dirName = getDirectoryNameFromUrl(app.marketplaceUrl);
    return path.join(marketplacesPath, dirName, 'apps', app.id);
}

function getDirectoryNameFromUrl(url: string): string {
    return url
        .replace('https://', '')
        .replace('http://', '')
        .replace(/\.git$/, '')
        .replace(/[^a-z0-9]/gi, '-')
        .toLowerCase();
}

/**
 * Adds a new marketplace repository to the database and tests if the credentials are valid (if provided).
 * The promise is rejected, if the credentials are invalid.
 * @param gitRemoteUrl The git remote URL of the marketplace repository
 * @param gitUsername An optional git username
 * @param gitPassword An optional git password or token
 */
export async function createMarketplace(
    gitRemoteUrl: string,
    gitUsername?: string,
    gitPassword?: string
): Promise<void> {
    gitRemoteUrl = gitRemoteUrl.trim();
    if (gitRemoteUrl.endsWith('/'))
        gitRemoteUrl = gitRemoteUrl.slice(0, gitRemoteUrl.lastIndexOf('/'));

    if (!isValidUrl(gitRemoteUrl)) {
        throw new Error('Invalid URL (example: "https://github.com/<user>/<repo>")');
    }

    // Test if credentials are valid
    const validCredentials = await testCredentials(gitRemoteUrl, gitUsername, gitPassword);
    if (!validCredentials) {
        throw new Error('Invalid credentials');
    }

    await db
        .insert(marketplaces)
        .values({ gitRemoteUrl, gitUsername, gitPassword })
        .onConflictDoUpdate({
            target: marketplaces.gitRemoteUrl,
            set: { gitRemoteUrl, gitUsername, gitPassword }
        });
}

/**
 * Deletes an marketplace from the database and removes the local cloned repository
 * @param url The url of the marketplace to delete
 */
export async function deleteMarketplace(url: string): Promise<void> {
    const deletedMarketplace = await db
        .delete(marketplaces)
        .where(eq(marketplaces.gitRemoteUrl, url))
        .returning();
    // For loop unnecessary, but it's easier and more safe to implement than deletedMarketplace[0]
    for (const marketplace of deletedMarketplace) {
        const marketplacePath = getMarketplacePath(marketplace);
        await fs.rm(marketplacePath, { recursive: true, force: true });
    }
}

/**
 * Updates the marketplace apps by pulling the marketplace repositories and parsing the app.yml files
 * @param progress An optional callback that is called with the progress of the update
 */
export async function updateMarketplaceApps(
    progress: (progress: number | undefined) => void
): Promise<void> {
    const marketplaces = await db.query.marketplaces.findMany();
    const apps: MarketplaceApp[] = [];
    for (const marketplace of marketplaces) {
        const appIds = await pullMarketplaceRepository(marketplace, progress);
        for (const appId of appIds) {
            try {
                const marketplacePath = getMarketplacePath(marketplace);
                const appYamlPath = path.join(marketplacePath, 'apps', appId, 'app.yml');
                const app = await loadAppFromFiles(appYamlPath);
                apps.push({
                    marketplaceUrl: marketplace.gitRemoteUrl,
                    ...app
                });
            } catch (e) {
                logger.warn(e);
            }
        }
    }
    await db.delete(marketplaceApps);
    await db.insert(marketplaceApps).values(apps);
}

/**
 * Pulls the apps from the marketplace repository and returns the appIds
 */
async function pullMarketplaceRepository(
    marketplace: Marketplace,
    progress: (progress: number | undefined) => void
): Promise<string[]> {
    const marketplacePath = getMarketplacePath(marketplace);

    const onAuth: AuthCallback = () => ({
        username: marketplace.gitUsername ?? undefined,
        password: marketplace.gitPassword ?? undefined
    });
    const onProgress: ProgressCallback = (event) => {
        if (event.total) {
            progress(event.loaded / event.total);
        } else {
            progress(undefined);
        }
    };
    const author = { name: 'Home Station' };

    // If the marketplace repo was already cloned, pull the latest changes
    const repoExists = await exists(path.join(marketplacePath, '.git'));
    if (repoExists) {
        logger.info(`Pulling "${marketplace.gitRemoteUrl}" to "${marketplacePath}"`);
        await pull({ fs, http, dir: marketplacePath, onAuth, onProgress, author });
    } else {
        logger.info(`Cloning "${marketplace.gitRemoteUrl}" to "${marketplacePath}"`);
        await clone({
            fs,
            http,
            dir: marketplacePath,
            url: marketplace.gitRemoteUrl,
            onAuth,
            onProgress
        });
    }

    // Load the apps from the files
    try {
        const appsPath = path.join(marketplacePath, 'apps');
        return await fs.readdir(appsPath);
    } catch {
        logger.warn(`No "apps" directory found in "${marketplacePath}"! Skipping...`);
        return [];
    }
}

/**
 * Parses an app from the app.yml file
 * @param appYamlPath path to the app.yml file
 * @returns A promise that resolves to the app object
 */
async function loadAppFromFiles(appYamlPath: string): Promise<RemoteMarketplaceApp> {
    if (!(await exists(appYamlPath))) {
        throw new Error(`No app.yml found in "${appYamlPath}! Skipping..."`);
    }

    const appYaml = await fs.readFile(appYamlPath, 'utf8');
    return yaml.load(appYaml) as RemoteMarketplaceApp;
}

/**
 * Tests if the provided git repsitory is accessible. If it is public, no credentials are necessary.
 * @param url The git repository URL to test against
 * @param username An optional username
 * @param password An optional password or token
 * @returns A promise that resolves to true if the credentials are valid, false otherwise
 */
async function testCredentials(
    url: string,
    username?: string,
    password?: string
): Promise<boolean> {
    return new Promise((resolve) => {
        getRemoteInfo2({
            http,
            onAuth: username && password ? () => ({ username, password }) : undefined,
            onAuthFailure: () => resolve(false),
            onAuthSuccess: () => resolve(true),
            url
        })
            .catch(() => resolve(false))
            .then(() => resolve(true));
    });
}
