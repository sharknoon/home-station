import { redirect } from '@sveltejs/kit';
import { generateState } from 'arctic';
import { bitbucket } from '$lib/server/auth';
import { dev } from '$app/environment';

import type { RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent): Promise<Response> {
	const state = generateState();
	const url = await bitbucket.createAuthorizationURL(state, {
		scopes: ['account']
	});

	event.cookies.set('bitbucket_oauth_state', state, {
		path: '/',
		secure: !dev,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	redirect(302, url.toString());
}
