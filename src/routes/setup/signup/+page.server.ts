import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { systems, users } from '$lib/server/schema';
import { auth } from '$lib/server/auth';
import type { SystemTheme } from '$lib/theme';

export const load = (async () => {
	const system = await db.query.systems.findFirst();
	if (system?.currentSetupStep !== 0) {
		return redirect(303, '/setup');
	}
	return {};
}) satisfies PageServerLoad;

export const actions = {
	signup: async ({ request, locals }) => {
		const data = await request.formData();

		const username = data.get('username')?.toString();
		const password = data.get('password')?.toString();
		const language = data.get('language')?.toString() ?? 'en';
		const theme = (data.get('theme')?.toString() ?? 'system') as SystemTheme;

		if (!username || username.length < 4 || username.length > 31) {
			return fail(400, { username, invalid: true });
		}

		if (!password || password.length < 6 || password.length > 255) {
			return fail(400, { password: 'password', invalid: true });
		}

		const usernameExists = !!(await db.query.users.findFirst({
			where: eq(users.username, username.toLowerCase())
		}));
		if (usernameExists) {
			return fail(400, { username, exists: true });
		}

		try {
			console.log(1);
			const user = await auth.createUser({
				key: {
					providerId: 'username', // auth method
					providerUserId: username.toLowerCase(), // unique id when using "username" auth method
					password // hashed by Lucia
				},
				attributes: {
					username,
					language,
					theme
				}
			});
			console.log(2);
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});
			console.log(3);
			locals.auth.setSession(session); // set session cookie
			console.log(4);
			await db.update(systems).set({ currentSetupStep: 1 }).where(eq(systems.id, 1));
		} catch (e) {
			console.log(e);
			return fail(500, {
				message: 'An unknown error occurred'
			});
		}
		console.log(6);
		return redirect(303, '/setup/container');
	}
} satisfies Actions;
