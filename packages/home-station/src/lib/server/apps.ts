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
import { writable } from 'svelte/store';
import { sendNotification } from '$lib/server/notifications';
import { ts } from '$lib/i18n';

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
    let versionToInstall;
    if (app.version) {
        await isValidVersion(app.marketplaceUrl, app.id, app.version);
        versionToInstall = app.version;
    } else {
        versionToInstall = await getLatestVersion(app.marketplaceUrl, app.id);
    }
    const composePath = path.join(
        getMarketplaceAppPath(app.marketplaceUrl, app.id),
        'versions',
        versionToInstall
    );
    const projectName = generateProjectName(app.id, app.version);
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
export async function uninstallApp(
    app: MarketplaceApp
): Promise<void> {
    const composePath = path.join(
        getMarketplaceAppPath(app.marketplaceUrl, app.id),
        'versions',
        app.version
    );
    const projectName = generateProjectName(app.id, app.version);
    await down(composePath, undefined, projectName, false);
    await refreshInstalledApps();
}

export type InstalledApp = MarketplaceApp & {
    status: 'running' | 'stopped' | 'error';
    installedVersion: string;
    hostname: string;
};

export const installedApps = writable<InstalledApp[]>(await getInstalledApps());

async function refreshInstalledApps() {
    const apps = await getInstalledApps();
    installedApps.set(apps);
}

async function getInstalledApps(): Promise<InstalledApp[]> {
    const containers = await containerEngine.listContainers({ all: true });

    const appContainers = containers
        .filter((c) => c.Labels['home-station.enable'] === 'true')
        .map((a) => [
            a.Labels['home-station.app'],
            a.Labels['home-station.app-version'],
            a.State,
            a.Names[0]
        ])
        .map(([id, version, s, name]) => {
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
            const hostname = name.startsWith('/') ? name.substring(1) : name;
            return { id, version, state, hostname };
        })
        .filter((a) => a !== undefined) as {
        id: string;
        version: string;
        state: InstalledApp['status'];
        hostname: string;
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
        const container = appContainers.find((c) => c.id === app.id);
        return {
            ...app,
            status: container?.state ?? 'error',
            installedVersion: container?.version ?? '0.0.0',
            hostname: container?.hostname ?? ''
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
