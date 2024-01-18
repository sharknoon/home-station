import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { eq } from 'drizzle-orm';
import db from '$lib/server/db';
import { auth } from '$lib/server/auth';
import { containerEngines, users } from '$lib/server/schema';
import { detectDomains } from '$lib/server/network';
import {
	getEngines,
	refreshEngines,
	testLocalConnection,
	testRemoteConnection
} from '$lib/server/containerengines';

export const load = (async () => {
	const hasUsers = !!(await db.query.users.findFirst());
	if (hasUsers) {
		return redirect(303, '/');
	}
	const detectedDomains = await detectDomains();
	return { detectedDomains };
}) satisfies PageServerLoad;

export const actions = {
	signup: async ({ request, locals }) => {
		const data = await request.formData();

		// User data
		const username = data.get('username')?.toString();
		const password = data.get('password')?.toString();
		const language = data.get('language')?.toString();

		console.log(username, password, language);

		// User data validation
		if (!username || !/[a-zA-Z0-9_]{4,31}/.test(username)) {
			return fail(400, { username, invalid: true });
		}
		if (!password || password.length < 8 || password.length > 255) {
			return fail(400, { password: 'password', invalid: true });
		}
		if (!language || !['en', 'de'].includes(language)) {
			return fail(400, { language, invalid: true });
		}
		const usernameExists = !!(await db.query.users.findFirst({
			where: eq(users.username, username.toLowerCase())
		}));
		if (usernameExists) {
			return fail(400, { username, exists: true });
		}

		try {
			// User setup
			const user = await auth.createUser({
				key: {
					providerId: 'username', // auth method
					providerUserId: username.toLowerCase(), // unique id when using "username" auth method
					password // hashed by Lucia
				},
				attributes: {
					username,
					language
				}
			});
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});
			locals.auth.setSession(session); // set session cookie
		} catch (e) {
			return fail(500, {
				message: 'An unknown error occurred'
			});
		}
		return redirect(303, '/');
	},
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
			await refreshEngines();
			const engine = getEngines()[0];
			if (!engine) {
				return fail(500, {
					message: 'An unknown error occurred'
				});
			}
			return { type: 'local', success: true, hostname: (await engine.info())?.Name };
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
			await refreshEngines();
			const engine = getEngines()[0];
			if (!engine) {
				return fail(500, {
					message: 'An unknown error occurred'
				});
			}
			return { type: 'remote', success: true, hostname: (await engine.info())?.Name };
		} catch (e) {
			return { type: 'remote', error: String(e) };
		}
	}
} satisfies Actions;
