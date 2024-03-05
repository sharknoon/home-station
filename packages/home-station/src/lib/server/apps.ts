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
    const latestVersion = await getLatestVersion(app);
    if (!latestVersion) return;
    const composePath = path.join(getMarketplaceAppPath(app), 'versions', latestVersion);
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

/**
 * Retrieves the list of installed apps from docker.
 * It looks for the `home-station.enable: true` label of containers.
 * @returns A promise that resolves to an array of MarketplaceApp objects representing the installed apps.
 */
export async function getInstalledApps(): Promise<MarketplaceApp[]> {
    const engines = await db.query.containerEngines.findMany();
    const containers: Dockerode.ContainerInfo[] = [];
    for (const engine of engines) {
        const dockerode = await getEngine(engine);
        const containersOfThisEngine = await dockerode.listContainers({ all: true });
        containers.push(...containersOfThisEngine);
    }
    const appIds = containers
        .filter((c) => c.Labels['home-station.enable'] === 'true')
        .map((a) => a.Labels['home-station.app'])
        .map((appId) => {
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
                return undefined;
            }
            return { marketplace: marketplaceUrl, id };
        })
        .filter((a) => a !== undefined) as { marketplace: string; id: string }[];
    if (appIds.length > 0) {
        const apps = await db
            .select()
            .from(marketplaceApps)
            .where(
                and(
                    inArray(
                        marketplaceApps.marketplaceUrl,
                        appIds.map((a) => a.marketplace)
                    ),
                    inArray(
                        marketplaceApps.id,
                        appIds.map((a) => a.id)
                    )
                )
            );
        return apps;
    }
    return [];
}
