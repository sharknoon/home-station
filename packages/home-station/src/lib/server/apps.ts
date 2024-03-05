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
        .map((a) => {
            const parts = a?.split('|') ?? [];
            let marketplace = 'https://github.com/home-station-org/apps.git';
            let id;
            if (parts.length == 2) {
                id = parts[0];
            } else if (parts.length == 3) {
                marketplace = parts[0];
                if (!marketplace.endsWith('.git')) marketplace += '.git';
                id = parts[1];
            } else {
                logger.warn(
                    `Invalid or missing app label: "${a}" An app label should be in the format "id|version" or "marketplace|id|version"`
                );
                return undefined;
            }
            return { marketplace, id };
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
