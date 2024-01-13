import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) return redirect(302, '/login');
	return {
		userId: session.user.userId,
		username: session.user.username
	};
}) satisfies LayoutServerLoad;
