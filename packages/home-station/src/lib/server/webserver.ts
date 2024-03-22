import { logger } from '$lib/server/logger';

export async function init() {
    try {
        logger.info('Connecting to webserver');

        // Test the connection to traefik
        const response = await fetch('http://localhost/api/overview');
        if (response.status !== 200) {
            throw new Error(`${response.status} ${await response.text()}`);
        }

        logger.info('Connected to webserver');
    } catch (error) {
        logger.error('Error connecting to webserver: ' + String(error));
        logger.error('Shutting down home station...');
        process.exit(1);
    }
}

/**
 * Retrieves the version of the web server.
 * @returns A promise that resolves to a object representing the version, the codename and the release date.
 */
export async function getVersion(): Promise<{
    Version: string;
    Codename: string;
    startDate: string;
}> {
    const response = await fetch('http://localhost/api/version');
    return await response.json();
}
