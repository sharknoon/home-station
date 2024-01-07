import Docker from 'dockerode';

export async function testLocalConnection(): Promise<void> {
	try {
		const docker = new Docker();
		const result: Buffer = await docker.ping();
		const ping = result.toString('utf-8');
		if (ping !== 'OK') {
			return Promise.reject('Docker ping did not return OK: ' + ping);
		}
	} catch (err) {
		return Promise.reject("Couldn't connect to Docker: " + err);
	}
}
