import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
    const status = Number(url.searchParams.get('status')) ?? 500;
    const message = url.searchParams.get('message') ?? 'Unknown error';
    error(status, { message });
}) satisfies PageServerLoad;
