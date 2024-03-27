const API_URL = 'http://localhost:8080/api';

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
