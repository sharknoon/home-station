import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	refreshEngines,
	testLocalConnection,
	testRemoteConnection
} from '$lib/server/containerengine';
import db from '$lib/server/db';
import { containerEngines, systems } from '$lib/server/schema';

export const load = (async () => {
	const system = await db.query.systems.findFirst();
	if (system?.currentSetupStep !== 1) {
		return redirect(303, '/setup');
	}
	return {};
}) satisfies PageServerLoad;

export const actions = {
	async connectLocal({ request }) {
		try {
			const data = await request.formData();

			const name = data.get('name')?.toString();
			let socketPath = data.get('socketPath')?.toString();

			if (!name) {
				return fail(400, { type: 'local', name, missing: true });
			}
			if (!socketPath) socketPath = undefined;

			await testLocalConnection(socketPath);
			await db
				.insert(containerEngines)
				.values({
					id: 1,
					name,
					type: 'local',
					socketPath,
					host: undefined,
					ca: undefined,
					cert: undefined,
					key: undefined
				})
				.onConflictDoUpdate({
					target: containerEngines.id,
					set: {
						name,
						type: 'local',
						socketPath,
						host: undefined,
						ca: undefined,
						cert: undefined,
						key: undefined
					}
				});
			return { type: 'local', success: true };
		} catch (e) {
			return { type: 'local', error: String(e) };
		}
	},
	async connectRemote({ request }) {
		try {
			const data = await request.formData();

			const name = data.get('name')?.toString();
			const host = data.get('host')?.toString();
			let ca = await (data.get('ca') as File | null)?.text();
			let cert = await (data.get('cert') as File | null)?.text();
			let key = await (data.get('key') as File | null)?.text();

			if (!name) {
				return fail(400, { type: 'remote', name, missing: true });
			}
			if (!host) {
				return fail(400, { type: 'remote', host, missing: true });
			}
			if (!ca) ca = undefined;
			if (!cert) cert = undefined;
			if (!key) key = undefined;

			await testRemoteConnection(host, ca, cert, key);
			await db
				.insert(containerEngines)
				.values({
					id: 1,
					name,
					type: 'remote',
					socketPath: undefined,
					host,
					ca,
					cert,
					key
				})
				.onConflictDoUpdate({
					target: containerEngines.id,
					set: {
						name,
						type: 'remote',
						socketPath: undefined,
						host,
						ca,
						cert,
						key
					}
				});
			return { type: 'remote', success: true };
		} catch (e) {
			return { type: 'remote', error: String(e) };
		}
	},
	async proceed() {
		const containerEngine = await db.query.containerEngines.findFirst();
		if (!containerEngine) {
			return fail(400, { containerEngine: 'containerEngine', missing: true });
		}
		await refreshEngines();
		await db
			.insert(systems)
			.values({ id: 1, currentSetupStep: 2 })
			.onConflictDoUpdate({ target: systems.id, set: { currentSetupStep: 2 } });
		return redirect(303, '/setup/finish');
	}
} satisfies Actions;
