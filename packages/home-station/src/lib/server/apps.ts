import {
    getLatestVersion,
    getMarketplaceAppPath,
    isValidVersion,
    type MarketplaceApp
} from '$lib/server/marketplaces';
import path from 'node:path';
import { inArray } from 'drizzle-orm';
import { down, up } from '$lib/server/compose';
import { db } from '$lib/server/db';
import { containerEngine } from '$lib/server/containerengines';
import { marketplaceApps } from '$lib/server/schema';
import { addReverseProxy } from './webserver';

/**
 * Installs an app from the marketplace.
 * @param marketplaceUrl - The URL of the marketplace where the app is located.
 * @param appUuid - The UUID of the app to install.
 * @param version - The version of the app to install. If not provided, the latest version will be installed.
 * @param progress - Optional callback to track the installation progress.
 * @throws If the app cannot be installed.
 * @returns A promise that resolves when the app is installed successfully.
 */
export async function installApp(
    app: MarketplaceApp,
    progress?: (progress: number) => void
): Promise<void> {
    const { marketplaceUrl, uuid, version } = app;
    let versionToInstall;
    if (version) {
        await isValidVersion(marketplaceUrl, uuid, version);
        versionToInstall = version;
    } else {
        versionToInstall = await getLatestVersion(marketplaceUrl, uuid);
    }
    const composePath = path.join(
        getMarketplaceAppPath(marketplaceUrl, uuid),
        'versions',
        versionToInstall
    );
    await up(composePath, undefined, uuid, progress);
    for (const http of app.http ?? []) {
        await addReverseProxy(http.subdomain, uuid, http.port);
    }
}

/**
 * Uninstalls an app from the server.
 * @param marketplaceUrl - The URL of the marketplace where the app was installed from.
 * @param appUuid - The UUID of the app to uninstall.
 * @param version - The version of the app to uninstall.
 * @returns A Promise that resolves when the app is successfully uninstalled.
 */
export async function uninstallApp(
    marketplaceUrl: string,
    appUuid: string,
    version: string
): Promise<void> {
    const composePath = path.join(
        getMarketplaceAppPath(marketplaceUrl, appUuid),
        'versions',
        version
    );
    await down(composePath, undefined, appUuid, false);
}

export type InstalledApp = MarketplaceApp & {
    status: 'running' | 'stopped' | 'error';
    installedVersion: string;
};

/**
 * Retrieves the list of installed apps from docker.
 * It looks for the `home-station.enable: true` label of containers.
 * @returns A promise that resolves to an array of MarketplaceApp objects representing the installed apps.
 * @type InstalledApp The same as MarketplaceApp, but with an additional `status` property.
 */
export async function getInstalledApps(): Promise<InstalledApp[]> {
    const containers = await containerEngine.listContainers({ all: true });

    const appContainers = containers
        .filter((c) => c.Labels['home-station.enable'] === 'true')
        .map((a) => [a.Labels['home-station.app'], a.Labels['home-station.app-version'], a.State])
        .map(([uuid, version, s]) => {
            let state;
            switch (s) {
                case 'running':
                    state = 'running';
                    break;
                case 'created':
                case 'paused':
                case 'restarting':
                case 'exited':
                    state = 'stopped';
                    break;
                case 'dead':
                default:
                    state = 'error';
                    break;
            }
            return { uuid, version, state };
        })
        .filter((a) => a !== undefined) as {
        uuid: string;
        version: string;
        state: InstalledApp['status'];
    }[];

    if (appContainers.length === 0) return [];

    const appRecords = await db
        .select()
        .from(marketplaceApps)
        .where(
            inArray(
                marketplaceApps.uuid,
                appContainers.map((a) => a.uuid)
            )
        );
    return appRecords.map((app) => {
        const container = appContainers.find((c) => c.uuid === app.uuid);
        return {
            ...app,
            status: container?.state ?? 'error',
            installedVersion: container?.version ?? '0.0.0'
        };
    });
}
