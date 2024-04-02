import { getMarketplaceAppPath, type MarketplaceApp } from '$lib/server/marketplaces';
import path from 'node:path';
import { inArray } from 'drizzle-orm';
import { down, up } from '$lib/server/compose';
import { db } from '$lib/server/db';
import { containerEngine } from '$lib/server/containerengines';
import { marketplaceApps } from '$lib/server/schema';
import { writable } from 'svelte/store';
import { sendNotification } from '$lib/server/notifications';
import { ts } from '$lib/i18n';
import { logger } from './logger';

/**
 * Installs an app from the marketplace.
 * @param app - The app to be installed
 * @param progress - Optional callback to track the installation progress.
 * @throws If the app cannot be installed.
 * @returns A promise that resolves when the app is installed successfully.
 */
export async function installApp(
    app: MarketplaceApp,
    progress?: (progress: number) => void
): Promise<void> {
    const composePath = path.join(
        getMarketplaceAppPath(app.marketplaceUrl, app.id),
        'versions',
        app.latestVersion
    );
    const projectName = generateProjectName(app.id, app.latestVersion);
    await up(composePath, projectName, undefined, progress);
    await refreshInstalledApps();
    const postInstallMessage = app.messages?.postInstall;
    if (postInstallMessage) {
        sendNotification('info', ts(postInstallMessage), -1);
    }
}

/**
 * Uninstalls an app from the server.
 * @param app - The app to be uninstalled
 * @returns A Promise that resolves when the app is successfully uninstalled.
 */
export async function uninstallApp(app: InstalledApp): Promise<void> {
    const composePath = path.join(
        getMarketplaceAppPath(app.marketplaceUrl, app.id),
        'versions',
        app.installedVersion
    );
    const projectName = generateProjectName(app.id, app.installedVersion);
    await down(composePath, undefined, projectName, false);
    await refreshInstalledApps();
}

export type InstalledApp = MarketplaceApp & {
    status: 'running' | 'stopped' | 'error';
    installedVersion: string;
    // Can be an empty array if an app doesn't provide a http site (e.g. gameservers)
    launchOptions: {
        title: string;
        hostname: string;
        port: number;
        subdomain: string;
    }[];
};

export const installedApps = writable<InstalledApp[]>(await getInstalledApps());

async function refreshInstalledApps() {
    const apps = await getInstalledApps();
    installedApps.set(apps);
}

async function getInstalledApps(): Promise<InstalledApp[]> {
    if (!containerEngine) return [];
    const containers = await containerEngine.listContainers({ all: true });

    const appContainers = containers
        .filter((c) => (c.Labels['home-station.app']?.length ?? 0) > 0)
        .map((c) => {
            const id = c.Labels['home-station.app'];
            const installedVersion = c.Labels['home-station.version'];
            let status;
            switch (c.State) {
                case 'running':
                    status = 'running';
                    break;
                case 'created':
                case 'paused':
                case 'restarting':
                case 'exited':
                    status = 'stopped';
                    break;
                case 'dead':
                default:
                    status = 'error';
                    break;
            }
            const hostname = c.Id.substring(0, 12);
            const launchOptionsMap = new Map<
                string,
                { title: string; hostname: string; port: number; subdomain: string }
            >();
            const defaultTarget = { title: '', hostname, port: 0, subdomain: '' };
            for (const [key, value] of Object.entries(c.Labels).filter(([key]) =>
                key.startsWith('home-station.http.')
            )) {
                const match = key.match(/home-station\.http\.([a-z0-9_-]+)\.(.+)/);
                if (!match) {
                    logger.warn(`Invalid http label "${key}" for app "${id}"`);
                    continue;
                }
                const [, targetId, property] = match;
                const target = launchOptionsMap.get(targetId) ?? defaultTarget;
                switch (property) {
                    case 'title':
                        target.title = value;
                        break;
                    case 'port':
                        target.port = parseInt(value);
                        break;
                    case 'subdomain':
                        target.subdomain = value;
                        break;
                }
                launchOptionsMap.set(targetId, target);
            }
            const launchOptions = Array.from(launchOptionsMap.values());

            return { id, installedVersion, status, launchOptions };
        })
        .filter((a) => a !== undefined) as {
        id: string;
        installedVersion: string;
        status: InstalledApp['status'];
        launchOptions: { title: string; hostname: string; port: number; subdomain: string }[];
    }[];

    if (appContainers.length === 0) return [];

    const appRecords = await db
        .select()
        .from(marketplaceApps)
        .where(
            inArray(
                marketplaceApps.id,
                appContainers.map((a) => a.id)
            )
        );
    const apps = appRecords.map((app) => {
        const containers = appContainers.filter((c) => c.id === app.id);

        const status = getAppStatus(containers.map((c) => c.status));
        const installedVersion =
            containers.find((c) => c.installedVersion)?.installedVersion ?? '0.0.0';
        const launchOptions = containers.flatMap((c) => c.launchOptions);

        return {
            ...app,
            status,
            installedVersion,
            launchOptions
        };
    });
    return apps;
}

function generateProjectName(appId: string, appVersion: string): string {
    const [scope, name] = appId.toLowerCase().split(':');
    const newScope = scope.substring(1).replace(/[^a-z0-9]/g, '_');
    const newVersion = appVersion.toLowerCase().replace(/[^a-z0-9]/g, '_');
    return `${newScope}-${name}-${newVersion}`;
}

function getAppStatus(status: InstalledApp['status'][]): InstalledApp['status'] {
    if (status.includes('error')) return 'error';
    if (status.includes('running')) return 'running';
    if (status.includes('stopped')) return 'stopped';
    return 'error';
}
