import dns from 'node:dns/promises';
import http from 'node:http';

/**
 * Returns the public IP address of this server
 * @returns The public IP address
 */
export async function getPublicIp(): Promise<string> {
    return new Promise((resolve, reject) => {
        http.get({ host: 'api.ipify.org', port: 80, path: '/' }, (resp) => {
            resp.on('data', (ip) => {
                resolve(String(ip));
            });
            resp.on('error', reject);
        });
    });
}

/**
 * Returns a list of hostnames and domains that point to this server
 * @returns A string array of hostnames and domains
 */
export async function detectHostnames(): Promise<string[]> {
    try {
        return await dns.reverse(await getPublicIp());
    } catch (error) {
        return [];
    }
}
