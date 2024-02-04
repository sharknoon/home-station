import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	return {
		userId: locals.user?.id,
		username: locals.user?.username
	};
}) satisfies LayoutServerLoad;
