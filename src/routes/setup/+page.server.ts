import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { eq } from 'drizzle-orm';
import db from '$lib/server/db';
import { auth } from '$lib/server/auth';
import { containerEngines, users } from '$lib/server/schema';

export const load = (async () => {
	const hasUsers = !!(await db.query.users.findFirst());
	if (hasUsers) {
		return redirect(303, '/');
	}
	return {};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();

		// User data
		const username = data.get('username')?.toString();
		const password = data.get('password')?.toString();
		const language = data.get('language')?.toString();
		const theme = data.get('theme')?.toString();

		// Container engine data
		const name = data.get('name')?.toString();
		const type = data.get('type')?.toString();
		const socketPath = data.get('socketPath')?.toString();
		const host = data.get('host')?.toString();
		const ca = await (data.get('ca') as File | null)?.text();
		const cert = await (data.get('cert') as File | null)?.text();
		const key = await (data.get('key') as File | null)?.text();

		console.log(username, password, language, theme, name, type, socketPath, host, ca, cert, key);

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
		if (!theme || !['light', 'dark'].includes(theme)) {
			return fail(400, { theme, invalid: true });
		}
		const usernameExists = !!(await db.query.users.findFirst({
			where: eq(users.username, username.toLowerCase())
		}));
		if (usernameExists) {
			return fail(400, { username, exists: true });
		}

		// Container engine data validation
		if (!name) {
			return fail(400, { name, missing: true });
		}
		if (!type || !['local', 'remote'].includes(type)) {
			return fail(400, { type, missing: true });
		}
		if (type === 'remote' && !host) {
			return fail(400, { host, missing: true });
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
					language,
					theme: theme as 'light' | 'dark'
				}
			});
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});
			locals.auth.setSession(session); // set session cookie

			// Container engine setup
			const containerEngineData = {
				name,
				type: type as 'local' | 'remote',
				socketPath: socketPath ?? undefined,
				host: host ?? undefined,
				ca: ca ?? undefined,
				cert: cert ?? undefined,
				key: key ?? undefined
			};
			await db
				.insert(containerEngines)
				.values({ id: 1, ...containerEngineData })
				.onConflictDoUpdate({ target: containerEngines.id, set: containerEngineData });
		} catch (e) {
			return fail(500, {
				message: 'An unknown error occurred'
			});
		}
		return redirect(303, '/');
	}
} satisfies Actions;
