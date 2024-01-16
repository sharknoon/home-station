import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { testLocalConnection, testRemoteConnection } from '$lib/server/containerengines';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	if (data.type === 'remote') {
		const host = data.host?.toString();
		const ca: string | undefined = data.ca ? data.ca.text() : undefined;
		const cert: string | undefined = data.cert ? data.cert.text() : undefined;
		const key: string | undefined = data.key ? data.key.text() : undefined;

		if (!host) {
			error(400, 'Missing host');
		}

		try {
			await testRemoteConnection(host, ca, cert, key);
			return json({ success: true });
		} catch (e) {
			return json({ error: String(e) });
		}
	} else if (data.type === 'local') {
		const socketPath: string | undefined = data.socketPath?.toString() ?? undefined;

		try {
			await testLocalConnection(socketPath);
			return json({ success: true });
		} catch (e) {
			return json({ error: String(e) });
		}
	} else {
		error(400, 'Invalid type');
	}
};
