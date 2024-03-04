import { OAuth2RequestError } from 'arctic';
import { generateId } from 'lucia';
import { github, lucia } from '$lib/server/auth';

import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { and, eq } from 'drizzle-orm';
import { oauthAccounts, users } from '$lib/server/schema';
import logger from '$lib/server/logger';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('github_oauth_state') ?? null;

	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const tokens = await github.validateAuthorizationCode(code);
		const githubUserResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const githubUser: GitHubUser = await githubUserResponse.json();

		const existingAccount = await db.query.oauthAccounts.findFirst({
			where: and(
				eq(oauthAccounts.providerId, 'github'),
				eq(oauthAccounts.providerUserId, String(githubUser.id))
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
				username: githubUser.login,
				email: githubUser.email
			})
			await db.insert(oauthAccounts).values({
				providerId: 'github',
				providerUserId: String(githubUser.id),
				userId,
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
		logger.error('Failed to authenticate with GitHub: ' + e);
		return new Response(null, {
			status: 500
		});
	}
}

interface GitHubUser {
	id: number;
	login: string;
	email: string;
}
