import { auth } from '$lib/server/auth';
import { LuciaError } from 'lucia';
import { fail, redirect } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) return redirect(302, '/');
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const username = formData.get('username')?.toString();
		const password = formData.get('password')?.toString();
		// basic check
		if (!username || username.length < 4 || username.length > 31) {
			return fail(400, { username, invalid: true });
		}
		if (!password || password.length < 6 || password.length > 255) {
			return fail(400, { password: 'password', invalid: true });
		}
		try {
			// find user by key
			// and validate password
			const key = await auth.useKey('username', username.toLowerCase(), password);
			const session = await auth.createSession({
				userId: key.userId,
				attributes: {}
			});
			locals.auth.setSession(session); // set session cookie
		} catch (e) {
			if (
				e instanceof LuciaError &&
				(e.message === 'AUTH_INVALID_KEY_ID' || e.message === 'AUTH_INVALID_PASSWORD')
			) {
				// user does not exist
				// or invalid password
				return fail(400, {
					message: 'Incorrect username or password'
				});
			}
			return fail(500, {
				message: 'An unknown error occurred'
			});
		}
		return redirect(302, '/');
	}
};
