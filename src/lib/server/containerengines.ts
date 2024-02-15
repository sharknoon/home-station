import Docker from 'dockerode';
import type { containerEngines } from './schema';

type ContainerEngine = typeof containerEngines.$inferSelect;

export async function getEngine(engine: ContainerEngine): Promise<Docker> {
    switch (engine?.type ?? 'local') {
        case 'local':
            if (!engine.socketPath) return new Docker();
            return new Docker({ socketPath: engine.socketPath });
        case 'remote':
            return new Docker({
                host: engine.host ?? '', // Is required for type remote
                ca: engine.ca ?? undefined,
                cert: engine.cert ?? undefined,
                key: engine.key ?? undefined
            });
    }
}

export async function testLocalConnection(socketPath?: string): Promise<Docker> {
    try {
        const docker = socketPath ? new Docker({ socketPath }) : new Docker();
        const result: Buffer = await docker.ping();
        const ping = result.toString('utf-8');
        if (ping !== 'OK') {
            return Promise.reject('Docker ping did not return OK: ' + ping);
        }
        return docker;
    } catch (err) {
        if (err instanceof AggregateError) {
            const errors = err.errors.map((e) => String(e)).join(', ');
            return Promise.reject("Couldn't connect to Docker: " + errors);
        }
        if (err instanceof Error) {
            return Promise.reject("Couldn't connect to Docker: " + err.message);
        }
        return Promise.reject("Couldn't connect to Docker: " + err);
    }
}

export async function testRemoteConnection(
    url: string,
    ca?: string,
    cert?: string,
    key?: string
): Promise<Docker> {
    try {
        const docker = new Docker({ host: url, ca, cert, key });
        const result: Buffer = await docker.ping();
        const ping = result.toString('utf-8');
        if (ping !== 'OK') {
            return Promise.reject('Docker ping did not return OK: ' + ping);
        }
        return docker;
    } catch (err) {
        if (err instanceof AggregateError) {
            const errors = err.errors.map((e) => String(e)).join(', ');
            return Promise.reject("Couldn't connect to Docker: " + errors);
        }
        if (err instanceof Error) {
            return Promise.reject("Couldn't connect to Docker: " + err.message);
        }
        return Promise.reject("Couldn't connect to Docker: " + err);
    }
}
