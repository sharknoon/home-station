import { logger } from '$lib/server/logger';
import { exec } from '$lib/server/terminal';
import { stripAnsi } from '$lib/utils';

export async function init() {
    try {
        logger.info('Starting webserver');
        if (await isCaddyRunning()) {
            logger.info('Webserver already running');
            return;
        }
        await exec('caddy', 'start');
        logger.info('Webserver started');
    } catch (error) {
        logger.error('Error starting webserver: ' + error);
        logger.error('Shutting down home station...');
        process.exit(1);
    }
}

async function isCaddyRunning(): Promise<boolean> {
    return new Promise((resolve) => {
        fetch('http://localhost:2019/config/')
            .then((response) => resolve(response.ok))
            .catch(() => resolve(false));
    });
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
    return stripAnsi(version).split('\n')[0] ?? "";
}

export async function addReverseProxyEntry(from: string, to: string) {

    // TODO
    console.log('addReverseProxyEntry', from, to);
}