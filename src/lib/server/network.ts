import net from 'node:net';
import dns from 'node:dns/promises';

export async function getPublicIp(): Promise<string> {
    return new Promise((resolve, reject) => {
        const socket = net.connect({ port: 80, host: 'google.com' });
        socket.on('connect', () => {
            if (!socket.localAddress) {
                reject('Socket has no local address, to which an remote socket can connect to');
            } else {
                resolve(socket.localAddress);
            }
            socket.end();
        });
        socket.on('error', reject);
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
