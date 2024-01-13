import Docker from 'dockerode';
import db from '$lib/server/db';

let engines: Docker[] = await loadEngines();

async function loadEngines() {
	const engines = await db.query.containerEngines.findMany();
	return engines
		.map((e) => {
			switch (e?.type) {
				case 'local':
					if (!e.socketPath) return new Docker();
					return new Docker({ socketPath: e.socketPath });
				case 'remote':
					return new Docker({
						host: e.host ?? '', // Is required for type remote
						ca: e.ca ?? undefined,
						cert: e.cert ?? undefined,
						key: e.key ?? undefined
					});
				default:
					return undefined;
			}
		})
		.filter((e) => e !== undefined) as Docker[];
}

export async function refreshEngines() {
	engines = await loadEngines();
}

export function getEngines(): Docker[] {
	return engines;
}

export async function testLocalConnection(socketPath?: string): Promise<void> {
	try {
		const docker = socketPath ? new Docker({ socketPath }) : new Docker();
		const result: Buffer = await docker.ping();
		const ping = result.toString('utf-8');
		if (ping !== 'OK') {
			return Promise.reject('Docker ping did not return OK: ' + ping);
		}
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
): Promise<void> {
	try {
		const docker = new Docker({ host: url, ca, cert, key });
		const result: Buffer = await docker.ping();
		const ping = result.toString('utf-8');
		if (ping !== 'OK') {
			return Promise.reject('Docker ping did not return OK: ' + ping);
		}
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
