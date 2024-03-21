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
import { db } from '$lib/server/db';
import { marketplaces, marketplaceApps } from '$lib/server/schema';
import { exists } from '$lib/server/utils';
import { getAppDataPath } from '$lib/server/appdata';
import { eq } from 'drizzle-orm';
import { logger } from '$lib/server/logger';
import { rcompare } from 'semver';
import Ajv from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import { isValidUrl } from '$lib/utils';
import type { AppConfiguration } from '$lib/schemas/app.schema';
import schema from '$lib/schemas/app.schema.json';

export type MarketplaceApp = typeof marketplaceApps.$inferInsert;
export type Marketplace = typeof marketplaces.$inferInsert;

const APPDATA_PATH = await getAppDataPath();
const MARKETPLACES_PATH = path.join(APPDATA_PATH, 'marketplaces');
await fs.mkdir(MARKETPLACES_PATH, { recursive: true });

/**
 * Returns the path to the local cloned marketplace repository
 * @param marketplaceUrl The url to the marketplace repository
 * @returns The path to the local cloned marketplace repository
 */
export function getMarketplacePath(marketplaceUrl: string): string {
    const dirName = getDirectoryNameFromUrl(marketplaceUrl);
    return path.join(MARKETPLACES_PATH, dirName);
}

/**
 * Returns the path to a specific app in the local cloned marketplace repository
 * @param marketplaceUrl The url to the marketplace repository
 * @param appUuid The uuid of the app
 * @returns The path to the app in the local cloned marketplace repository
 */
export function getMarketplaceAppPath(marketplaceUrl: string, appUuid: string): string {
    const dirName = getDirectoryNameFromUrl(marketplaceUrl);
    return path.join(MARKETPLACES_PATH, dirName, 'apps', appUuid);
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
 * @param marketplaceUrl The url to the marketplace repository
 * @param appUuid The uuid of the app
 * @returns A promise that resolves to the latest version of the app, or undefined if no versions are found.
 */
export async function getLatestVersion(marketplaceUrl: string, appUuid: string): Promise<string> {
    const versions = await getVersionsOfApp(marketplaceUrl, appUuid);
    return versions.sort(rcompare)[0];
}

/**
 * Checks if a given version is valid for an app in a marketplace.
 * @param marketplaceUrl - The URL of the marketplace.
 * @param appUuid - The UUID of the app.
 * @param version - The version to check.
 * @returns A promise that resolves to a boolean indicating if the version is valid.
 */
export async function isValidVersion(
    marketplaceUrl: string,
    appUuid: string,
    version: string
): Promise<true> {
    const versions = await getVersionsOfApp(marketplaceUrl, appUuid);
    if (versions.includes(version)) {
        return true;
    } else {
        throw new Error(
            `Version "${version}" not found for "${appUuid}" in "${marketplaceUrl}. Available versions: ${versions.join(', ')}"`
        );
    }
}

async function getVersionsOfApp(marketplaceUrl: string, appUuid: string): Promise<string[]> {
    const versionsPath = path.join(getMarketplaceAppPath(marketplaceUrl, appUuid), 'versions');
    let versions: string[] = [];
    try {
        versions = await fs.readdir(versionsPath);
    } catch {
        throw new Error(
            `No "versions" directory found in "${getMarketplaceAppPath(marketplaceUrl, appUuid)}"!`
        );
    }
    if (versions.length === 0) {
        throw new Error(`No versions found for "${appUuid}" in "${marketplaceUrl}"!`);
    }
    return versions;
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
        const marketplacePath = getMarketplacePath(marketplace.gitRemoteUrl);
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
        const marketplacePath = getMarketplacePath(marketplace.gitRemoteUrl);
        const appUuids = await loadAppUuids(path.join(marketplacePath, 'apps'));
        for (const appUuid of appUuids) {
            try {
                const appYamlPath = path.join(marketplacePath, 'apps', appUuid, 'app.yml');
                const appYaml = await parseAppYaml(appYamlPath);
                const app = await convertAppYaml(appYaml, marketplace.gitRemoteUrl);
                apps.push(app);
            } catch (e) {
                logger.warn(
                    `App "${appUuid}" in "${marketplace.gitRemoteUrl}" could not be parsed: ${e}`
                );
            }
        }
    }
    await db.delete(marketplaceApps);
    if (apps.length > 0) {
        await db.insert(marketplaceApps).values(apps);
    }
}

/**
 * Converts an `app.yml` to a MarketplaceApp. This involves resolving files and setting the marketplaceUrl.
 */
async function convertAppYaml(
    appYaml: AppConfiguration,
    marketplaceUrl: string
): Promise<MarketplaceApp> {
    let version = '0.0.0';
    try {
        version = await getLatestVersion(marketplaceUrl, appYaml.uuid);
    } catch (error) {
        logger.warn(error);
    }

    let icon = await resolveFile(
        appYaml.icon,
        path.join(getMarketplacePath(marketplaceUrl), 'apps', appYaml.uuid)
    );
    if (!icon) {
        logger.warn(
            `No icon found for "${appYaml.uuid}" (${appYaml.name.en}) in "${marketplaceUrl}"!`
        );
        icon = '';
    }

    const banner = await resolveFile(
        appYaml.banner,
        path.join(getMarketplacePath(marketplaceUrl), 'apps', appYaml.uuid)
    );

    const screenshots = (
        await Promise.all(
            (appYaml.screenshots ?? []).map((screenshot) =>
                resolveFile(
                    screenshot,
                    path.join(getMarketplacePath(marketplaceUrl), 'apps', appYaml.uuid)
                )
            )
        )
    ).filter((screenshot) => screenshot) as string[];

    return {
        ...appYaml,
        marketplaceUrl,
        version,
        icon,
        banner,
        screenshots
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
        return '/' + path.relative(await getAppDataPath(), filePath).replace(/\\/g, '/');
    }
    // Either a wrong URL or a non-existing file
    logger.warn(`"${file}" is not a valid URL or cannot be found in "${cwd}"`);
    return undefined;
}

/**
 * Pulls the apps from the marketplace repository
 */
async function pullMarketplaceRepository(
    marketplace: Marketplace,
    progress: (progress: number | undefined) => void
) {
    const marketplacePath = getMarketplacePath(marketplace.gitRemoteUrl);

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
    let repoExists = await exists(path.join(marketplacePath, '.git'));
    if (repoExists) {
        try {
            logger.info(`Pulling "${marketplace.gitRemoteUrl}" to "${marketplacePath}"`);
            await pull({ fs, http, dir: marketplacePath, onAuth, onProgress, author });
        } catch (e) {
            // In case the repository contents were altered and the pull fails, we need to remove the directory before cloning again
            await fs.rm(marketplacePath, { recursive: true, force: true });
            repoExists = false;
        }
    }
    if (!repoExists) {
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
 * Loads the app Uuids from a marketplace apps directory.
 *
 * @param appsPath The path to the apps directory inside a marketplace.
 * @returns An array of app Uuids (the folder names).
 */
async function loadAppUuids(appsPath: string): Promise<string[]> {
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
async function parseAppYaml(appYamlPath: string): Promise<AppConfiguration> {
    if (!(await exists(appYamlPath))) {
        throw new Error(`No app.yml found in "${appYamlPath}! Skipping..."`);
    }
    const appYaml = await fs.readFile(appYamlPath, 'utf8');
    const yamlContent = yaml.load(appYaml);

    const ajv = new Ajv();
    addFormats(ajv);
    const validate = ajv.compile<AppConfiguration>(schema);
    const validAppYaml = validate(yamlContent);
    if (!validAppYaml) {
        throw new Error(`Invalid app.yml in "${appYamlPath}": ${validate.errors?.map((e) => JSON.stringify(e)).join('\n')}`);
    }
    return yamlContent;
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
