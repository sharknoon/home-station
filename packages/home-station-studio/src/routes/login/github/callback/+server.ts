import { OAuth2RequestError } from 'arctic';
import { generateId } from 'lucia';
import { github, lucia } from '$lib/server/auth';

import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
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
		const userResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const githubUser: GitHubUser = await userResponse.json();

		const emailsResponse = await fetch('https://api.github.com/user/emails?per_page=100', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const emails: GitHubEmails = await emailsResponse.json();

		const primaryEmail = emails.find((email) => email.primary) ?? null;
		if (!primaryEmail) {
			return new Response('No primary email address', {
				status: 400
			});
		}
		if (!primaryEmail.verified) {
			return new Response('Unverified email', {
				status: 400
			});
		}

		const existingUser = await db.query.users.findFirst({
			where: eq(users.email, primaryEmail.email)
		});
		if (existingUser) {
			await db
				.insert(oauthAccounts)
				.values({
					providerId: 'github',
					providerUserId: String(githubUser.id),
					userId: existingUser.id
				})
				.onConflictDoNothing();

			const session = await lucia.createSession(existingUser.id, {});
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
				email: primaryEmail.email
			});
			await db.insert(oauthAccounts).values({
				providerId: 'github',
				providerUserId: String(githubUser.id),
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
		logger.error('Failed to authenticate with GitHub: ' + e);
		return new Response(null, {
			status: 500
		});
	}
}

interface GitHubUser {
	id: number;
	login: string;
}

interface GitHubEmail {
	email: string;
	primary: boolean;
	verified: boolean;
}

type GitHubEmails = GitHubEmail[];
