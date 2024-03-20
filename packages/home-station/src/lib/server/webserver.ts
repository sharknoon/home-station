import { logger } from '$lib/server/logger';
import { exec } from '$lib/server/terminal';
import { stripAnsi } from '$lib/utils';
import { getInstalledApps } from '$lib/server/apps';

export type CaddyConfiguration = {
    apps?: {
        http?: {
            servers?: {
                [name: string]: {
                    '@id'?: string;
                    listen?: string[];
                    routes?: {
                        match?: {
                            host: string[];
                        }[];
                        handle?: {
                            handler: 'reverse_proxy';
                            upstreams?: {
                                dial: string;
                            }[];
                        };
                    }[];
                };
            };
        };
    };
};

export async function init() {
    try {
        logger.info('Connecting to webserver');

        // Test the connection to caddy
        const response = await fetch('http://localhost:2019/config');
        if (response.status !== 200) {
            throw new Error(`${response.status} ${await response.text()}`);
        }

        // Configure caddy for all apps
        const installedApps = await getInstalledApps();
        for (const app of installedApps) {
            for (const http of app.http ?? []) {
                await addReverseProxyUpstream(http.subdomain, app.uuid, http.port);
            }
        }

        logger.info('Webserver connected');
    } catch (error) {
        logger.error('Error connecting to webserver: ' + error);
        logger.error('Shutting down home station...');
        process.exit(1);
    }
}

/**
 * Retrieves the version of the web server.
 * @returns A promise that resolves to a string representing the version.
 */
export async function getVersion(): Promise<string> {
    let version = '';
    await exec('caddy', 'version', undefined, (data) => {
        version += data;
    });
    return stripAnsi(version).split('\n')[0] ?? '';
}

export async function addReverseProxyUpstream(subdomain: string, host: string, port: number) {
    await fetch('http://localhost:2019/id/home_station/routes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            match: [{ host: [`${subdomain}.localhost`] }],
            handle: [
                {
                    handler: 'reverse_proxy',
                    upstreams: [{ dial: `${host}:${port}` }]
                }
            ]
        })
    });
}
