import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import db from '$lib/server/db';
import { hash } from 'bcrypt';
import { system, users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

type Theme = typeof users.$inferSelect["theme"];

export const load = (async () => {
	const system = await db.query.system.findFirst();
	if (system?.currentSetupStep !== 0) {
		return redirect(303, '/setup');
	}
	return {};
}) satisfies PageServerLoad;

export const actions = {
	signup: async ({ request }) => {
		const data = await request.formData();

		const username = data.get('username')?.toString();
		const password1 = data.get('password1')?.toString();
		const password2 = data.get('password2')?.toString();
		const theme = (data.get('theme')?.toString() ?? "system") as Theme;

		if (password1 !== password2) {
			return fail(400, { password: 'password', mismatch: true });
		}

		if (!username) {
			return fail(400, { username, missing: true });
		}
		if (!password1) {
			return fail(400, { password: 'password', missing: true });
		}

		const password = await hash(password1, 10);

		const usernameExists = !!(await db.query.users.findFirst({
			where: eq(users.username, username)
		}));
		if (usernameExists) {
			return fail(400, { username, exists: true });
		}

		await db.insert(users).values({ username, password, theme });
		await db.update(system).set({ currentSetupStep: 1 }).where(eq(system.id, 1));
		return redirect(303, '/setup/container');
	}
} satisfies Actions;
