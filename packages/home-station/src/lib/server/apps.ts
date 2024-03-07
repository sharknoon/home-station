import {
    getLatestVersion,
    getMarketplaceAppPath,
    type MarketplaceApp
} from '$lib/server/marketplaces';
import path from 'node:path';
import { and, inArray } from 'drizzle-orm';
import type Dockerode from 'dockerode';
import { up } from '$lib/server/compose';
import db from '$lib/server/db';
import { getEngine } from '$lib/server/containerengines';
import logger from '$lib/server/logger';
import { marketplaceApps } from '$lib/server/schema';

/**
 * Installs an app from the marketplace.
 * @param app - The app to install.
 * @param progress - Optional callback to track the installation progress.
 * @returns A promise that resolves when the app is installed successfully.
 */
export async function installApp(
    app: MarketplaceApp,
    progress?: (progress: number) => void
): Promise<void> {
    const latestVersion = await getLatestVersion(app.marketplaceUrl, app.id);
    if (!latestVersion) return;
    const composePath = path.join(
        getMarketplaceAppPath(app.marketplaceUrl, app.id),
        'versions',
        latestVersion
    );
    await up(composePath, undefined, app.id, progress);
}

/**
 * Uninstalls an app from the server.
 * @param app - The app to uninstall.
 * @returns A Promise that resolves when the app is successfully uninstalled.
 */
export async function uninstallApp(app: MarketplaceApp): Promise<void> {
    const engines = await db.query.containerEngines.findMany();
    for (const engine of engines) {
        const dockerode = await getEngine(engine);
        const containers = await dockerode.listContainers({ all: true });
        for (const container of containers) {
            // TODO move to separate function
            const appId = container.Labels['home-station.app'];
            const parts = appId?.split('|') ?? [];
            let marketplaceUrl = 'https://github.com/home-station-org/apps.git';
            let id;
            if (parts.length == 2) {
                id = parts[0];
            } else if (parts.length == 3) {
                marketplaceUrl = parts[0];
                if (!marketplaceUrl.endsWith('.git')) marketplaceUrl += '.git';
                id = parts[1];
            } else {
                logger.warn(
                    `Invalid or missing app id label: "${appId}" An app id should be in the format "id|version" or "marketplace|id|version"`
                );
                continue;
            }

            if (marketplaceUrl === app.marketplaceUrl && id === app.id) {
                await dockerode.getContainer(container.Id).remove({ force: true });
            }
        }
    }
}

type InstalledApp = MarketplaceApp & {
    status: 'running' | 'stopped' | 'error';
};

/**
 * Retrieves the list of installed apps from docker.
 * It looks for the `home-station.enable: true` label of containers.
 * @returns A promise that resolves to an array of MarketplaceApp objects representing the installed apps.
 * @type InstalledApp The same as MarketplaceApp, but with an additional `status` property.
 */
export async function getInstalledApps(): Promise<InstalledApp[]> {
    const engines = await db.query.containerEngines.findMany();
    const containers: Dockerode.ContainerInfo[] = [];
    for (const engine of engines) {
        const dockerode = await getEngine(engine);
        const containersOfThisEngine = await dockerode.listContainers({ all: true });
        containers.push(...containersOfThisEngine);
    }
    const appContainers = containers
        .filter((c) => c.Labels['home-station.enable'] === 'true')
        .map((a) => [a.Labels['home-station.app'], a.State])
        .map(([id, s]) => {
            const { marketplaceUrl, appId } = parseAppIdentifier(id);
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
            return { marketplaceUrl, appId, state };
        })
        .filter((a) => a !== undefined) as {
        marketplaceUrl: string;
        appId: string;
        state: InstalledApp['status'];
    }[];

    if (appContainers.length === 0) return [];

    const appRecords = await db
        .select()
        .from(marketplaceApps)
        .where(
            and(
                inArray(
                    marketplaceApps.marketplaceUrl,
                    appContainers.map((a) => a.marketplaceUrl)
                ),
                inArray(
                    marketplaceApps.id,
                    appContainers.map((a) => a.appId)
                )
            )
        );
    return appRecords.map((app) => {
        const container = appContainers.find(
            (c) => c.marketplaceUrl === app.marketplaceUrl && c.appId === app.id
        );
        return {
            ...app,
            status: container?.state ?? 'error'
        };
    });
}

/**
 * Parses the app identifier and returns an object with the marketplace URL, app ID, and version.
 * @param identifier - The app identifier in the format "id|version" or "marketplace|id|version".
 * @returns An object with the marketplace URL, app ID, and version.
 */
export function parseAppIdentifier(identifier: string): {
    marketplaceUrl?: string;
    appId?: string;
    version?: string;
} {
    const parts = identifier?.split('|') ?? [];
    let marketplaceUrl;
    let appId;
    let version;
    if (parts.length == 2) {
        marketplaceUrl = 'https://github.com/home-station-org/apps.git';
        appId = parts[0];
        version = parts[1];
    } else if (parts.length == 3) {
        marketplaceUrl = parts[0];
        if (!marketplaceUrl.endsWith('.git')) marketplaceUrl += '.git';
        appId = parts[1];
        version = parts[2];
    } else {
        logger.warn(
            `Invalid or missing app id label: "${identifier}" An app id should be in the format "id|version" or "marketplace|id|version"`
        );
    }
    return { marketplaceUrl, appId, version };
}
