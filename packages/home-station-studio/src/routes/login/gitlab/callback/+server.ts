import { OAuth2RequestError } from 'arctic';
import { generateId } from 'lucia';
import { gitlab, lucia } from '$lib/server/auth';

import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { and, eq } from 'drizzle-orm';
import { oauthAccounts, users } from '$lib/server/schema';
import logger from '$lib/server/logger';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('gitlab_oauth_state') ?? null;

	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const tokens = await gitlab.validateAuthorizationCode(code);
		const gitlabUserResponse = await fetch('https://gitlab.com/api/v4/user', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const gitlabUser: GitLabUser = await gitlabUserResponse.json();

		if (!gitlabUser.confirmed_at) {
			return new Response('Unverified email', {
				status: 400
			});
		}

		const existingAccount = await db.query.oauthAccounts.findFirst({
			where: and(
				eq(oauthAccounts.providerId, 'gitlab'),
				eq(oauthAccounts.providerUserId, String(gitlabUser.id))
			)
		});

		if (existingAccount) {
			const session = await lucia.createSession(existingAccount.userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} else {
			const userId = generateId(15);

			await db.insert(users).values({
				id: userId,
				username: gitlabUser.username,
				email: gitlabUser.email
			});
			await db.insert(oauthAccounts).values({
				providerId: 'gitlab',
				providerUserId: String(gitlabUser.id),
				userId
			});

			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	} catch (e) {
		// the specific error message depends on the provider
		if (e instanceof OAuth2RequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}
		logger.error('Failed to authenticate with GitLab: ' + e);
		return new Response(null, {
			status: 500
		});
	}
}

interface GitLabUser {
	id: number;
	username: string;
	email: string;
	confirmed_at: string;
}
