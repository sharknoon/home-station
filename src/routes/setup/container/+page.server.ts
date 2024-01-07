import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { testLocalConnection, testRemoteConnection } from '$lib/server/containerengine';
import prisma from '$lib/server/prisma';

export const load = (async () => {
	const system = await prisma.system.findFirst();
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
			await prisma.containerEngine.upsert({
				where: { id: 1 },
				create: {
					id: 1,
					name,
					type: 'local',
					socketPath,
					host: undefined,
					ca: undefined,
					cert: undefined,
					key: undefined
				},
				update: {
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
			await prisma.containerEngine.upsert({
				where: { id: 1 },
				create: { id: 1, name, type: 'remote', socketPath: undefined, host, ca, cert, key },
				update: { name, type: 'remote', socketPath: undefined, host, ca, cert, key }
			});
			return { type: 'remote', success: true };
		} catch (e) {
			return { type: 'remote', error: String(e) };
		}
	},
	async proceed() {
		const containerEngine = await prisma.containerEngine.findFirst();
		if (!containerEngine) {
			return fail(400, { containerEngine: 'containerEngine', missing: true });
		}
		await prisma.system.upsert({
			where: { id: 1 },
			create: { currentSetupStep: 2 },
			update: { currentSetupStep: 2 }
		});
		return redirect(303, '/setup/finish');
	}
} satisfies Actions;
