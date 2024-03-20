import Docker from 'dockerode';
import type Dockerode from 'dockerode';
import { logger } from '$lib/server/logger';

export let containerEngine: Dockerode;

export async function init() {
    logger.info('Connecting to container engine');
    containerEngine = new Docker();
    const pong = await containerEngine.ping();
    if (pong.toString('utf-8') !== 'OK') {
        throw new Error('Docker ping did not return OK: ' + pong.toString('utf-8'));
    }
    const network = await containerEngine.listNetworks();
    if (!network.find((n) => n.Name === 'home-station')) {
        logger.info('Creating container engine network home-station');
        await containerEngine.createNetwork({ Name: 'home-station' });
    }
}

export async function testConnection(): Promise<{ success: boolean; errors?: string[] }> {
    try {
        const result: Buffer = await containerEngine.ping();
        const ping = result.toString('utf-8');
        if (ping !== 'OK') {
            return { success: false, errors: ['Docker ping did not return OK: ' + ping] };
        }
        return { success: true };
    } catch (err) {
        if (err instanceof AggregateError) {
            return { success: false, errors: err.errors.map((e) => String(e)) };
        }
        if (err instanceof Error) {
            return { success: false, errors: [err.message] };
        }
        return { success: false, errors: [String(err)] };
    }
}
