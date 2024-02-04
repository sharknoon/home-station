import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import db from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { users } from '$lib/server/schema';
import { Argon2id } from 'oslo/password';
import { lucia } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) return redirect(302, '/');
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const username = formData.get('username')?.toString();
		const password = formData.get('password')?.toString();
		// basic check
		if (!username || username.length < 4 || username.length > 31) {
			return fail(400, { incorrect: true });
		}
		if (!password || password.length < 6 || password.length > 255) {
			return fail(400, { incorrect: true });
		}
		const existingUser = await db.query.users.findFirst({
			where: eq(users.username, username.toLowerCase())
		});
		// Hash a fake password if the user does not exist in order to not reveal to the attacker, that this username doesn't exist
		const validPassword = await new Argon2id().verify(
			existingUser?.hashedPassword ??
				'$argon2id$v=19$m=19456,t=2,p=1$nY1Tl/Dm4W6xqpedJCf+NA$5qRkCHPRwuZtgy7lGcSRoRASxHq/j1JZ6czHwPWsxbA',
			password
		);
		if (!validPassword || !existingUser) {
			return fail(400, { incorrect: true });
		}
		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		return redirect(302, '/');
	}
};
