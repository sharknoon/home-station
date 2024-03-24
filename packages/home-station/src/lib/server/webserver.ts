import { logger } from '$lib/server/logger';

const API_URL = 'http://localhost:8080/api';

export async function init() {
    logger.info('Connecting to webserver');
    // Test the connection to traefik
    const response = await fetch(API_URL + '/overview');
    if (response.status !== 200) {
        throw new Error(
            'Error connecting to webserver: ' + response.status + ' ' + response.statusText
        );
    }
    logger.info('Connected to webserver');
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
    const response = await fetch(API_URL + '/version');
    return await response.json();
}
