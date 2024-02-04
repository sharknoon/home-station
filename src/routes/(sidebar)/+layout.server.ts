import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, request }) => {
    return {
        userId: locals.user?.id,
        username: locals.user?.username,
        url: request.url
    };
}) satisfies LayoutServerLoad;
