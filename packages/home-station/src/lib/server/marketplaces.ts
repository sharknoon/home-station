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
import { rcompare } from 'semver';

export type AppYaml = {
    id: string;
    name: LocalizedString;
    description: LocalizedString;
    icon: string;
    banner?: string;
    links: Links;
    publishedAt: string;
    developer: string;
    category: 'productivity';
    license: string;
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
 * Retrieves the latest version of a marketplace app. It uses semver comparisons to get the latest version.
 * @see https://github.com/npm/node-semver?tab=readme-ov-file#comparison
 * @param app - The marketplace app to retrieve the latest version for.
 * @returns A promise that resolves to the latest version of the app, or undefined if no versions are found.
 */
export async function getLatestVersion(app: MarketplaceApp): Promise<string | undefined> {
    const versionsPath = path.join(getMarketplaceAppPath(app), 'versions');
    let versions: string[] = [];
    try {
        versions = await fs.readdir(versionsPath);
    } catch {
        logger.warn(`No "versions" directory found in "${getMarketplaceAppPath(app)}"!`);
        return undefined;
    }
    if (versions.length === 0) {
        logger.warn(`No versions found in "${versionsPath}"!`);
        return undefined;
    }
    return versions.sort(rcompare)[0];
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
        await pullMarketplaceRepository(marketplace, progress);
        const marketplacePath = getMarketplacePath(marketplace);
        const appIds = await loadAppIds(path.join(marketplacePath, 'apps'));
        for (const appId of appIds) {
            try {
                const appYamlPath = path.join(marketplacePath, 'apps', appId, 'app.yml');
                const appYaml = await parseAppYaml(appYamlPath);
                const app = await convertAppYaml(appYaml, marketplace.gitRemoteUrl);
                apps.push(app);
            } catch (e) {
                logger.warn(e);
            }
        }
    }
    await db.delete(marketplaceApps);
    await db.insert(marketplaceApps).values(apps);
}

/**
 * Converts an `app.yml` to a MarketplaceApp. This involves resolving files and setting the marketplaceUrl.
 */
async function convertAppYaml(appYaml: AppYaml, marketplaceUrl: string): Promise<MarketplaceApp> {
    const icon = await resolveFile(
        appYaml.icon,
        path.join(getMarketplacePath({ gitRemoteUrl: marketplaceUrl }), 'apps', appYaml.id)
    );
    if (!icon) {
        logger.warn(`No icon found for "${appYaml.id}" in "${marketplaceUrl}"!`);
    }

    const banner = await resolveFile(
        appYaml.banner,
        path.join(getMarketplacePath({ gitRemoteUrl: marketplaceUrl }), 'apps', appYaml.id)
    );

    return {
        ...appYaml,
        marketplaceUrl,
        icon: icon ?? '',
        banner
    };
}

/**
 * Resolves a file to a local path or a URL
 * @param file The file to be resolved, either a URL or a relative path to a local file
 * @param cwd The current working directory for relative paths
 * @returns The resolved file as a absolute path (does exist!), a URL or undefined if the file cannot be resolved
 */
export async function resolveFile(
    file: string | undefined,
    cwd: string
): Promise<string | undefined> {
    // Check if there even is a file (sometimes the field is optional)
    if (!file) return undefined;
    // Return URLs directly
    if (isValidUrl(file)) {
        return file;
    }
    // Assume the file is a relative path to a local file
    const filePath = path.join(cwd, file);
    if (await exists(filePath)) {
        return path.relative(await getAppDataPath(), filePath).replace(/\\/g, '/');
    }
    // Either a wrong URL or a non-existing file
    logger.warn(`"${file}" is not a valid URL or cannot be found in "${cwd}"`);
    return undefined;
}

/**
 * Pulls the apps from the marketplace repository and returns the appIds
 */
async function pullMarketplaceRepository(
    marketplace: Marketplace,
    progress: (progress: number | undefined) => void
) {
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
}

/**
 * Loads the app Ids from a marketplace apps directory.
 *
 * @param appsPath The path to the apps directory inside a marketplace.
 * @returns An array of app Ids (the folder names).
 */
async function loadAppIds(appsPath: string): Promise<string[]> {
    try {
        return await fs.readdir(appsPath);
    } catch {
        logger.warn(`No "apps" directory found in "${appsPath}"! Skipping...`);
        return [];
    }
}

/**
 * Parses an app from the app.yml file
 * @param appYamlPath path to the app.yml file
 * @returns A promise that resolves to the app object
 */
async function parseAppYaml(appYamlPath: string): Promise<AppYaml> {
    if (!(await exists(appYamlPath))) {
        throw new Error(`No app.yml found in "${appYamlPath}! Skipping..."`);
    }

    const appYaml = await fs.readFile(appYamlPath, 'utf8');
    return yaml.load(appYaml) as AppYaml;
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
