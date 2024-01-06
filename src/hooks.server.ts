import prisma from '$lib/server/prisma';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Check if the initial setup is completed
	const system = await prisma.system.findFirst();
	if (!system?.setupComplete && !event.url.pathname.startsWith('/setup')) {
		return redirect(303, '/setup');
	}
    // Don't allow the user to access the setup pages if the setup is already completed
	if (system?.setupComplete && event.url.pathname.startsWith('/setup')) {
		return redirect(303, '/');
	}

	const response = await resolve(event);
	return response;
};