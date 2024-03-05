import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { lucia } from '$lib/server/auth';

export const actions: Actions = {
	logout: async ({ cookies, locals }) => {
		if (!locals.session) {
			return fail(401);
		}
		await lucia.invalidateSession(locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		redirect(302, '/login');
	}
};
