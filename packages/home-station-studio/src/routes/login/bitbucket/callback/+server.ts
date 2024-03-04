import { OAuth2RequestError } from 'arctic';
import { generateId } from 'lucia';
import { bitbucket, lucia } from '$lib/server/auth';

import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { and, eq } from 'drizzle-orm';
import { oauthAccounts, users } from '$lib/server/schema';
import logger from '$lib/server/logger';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('bitbucket_oauth_state') ?? null;

	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const tokens = await bitbucket.validateAuthorizationCode(code);
		const bitbucketUserResponse = await fetch('https://api.bitbucket.org/2.0/user', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const bitbucketUser: BitbucketUser = await bitbucketUserResponse.json();

		const bitbucketEmailsResponse = await fetch(
			'https://api.bitbucket.org/2.0/user/emails?pagelen=100',
			{
				headers: {
					Authorization: `Bearer ${tokens.accessToken}`
				}
			}
		);
		const bitbucketEmails: BitbucketEmails = await bitbucketEmailsResponse.json();

		const primaryEmail = bitbucketEmails.values.find((email) => email.is_primary) ?? null;
		if (!primaryEmail) {
			return new Response('No primary email address', {
				status: 400
			});
		}
		if (!primaryEmail.is_confirmed) {
			return new Response('Unverified email', {
				status: 400
			});
		}

		const existingAccount = await db.query.oauthAccounts.findFirst({
			where: and(
				eq(oauthAccounts.providerId, 'bitbucket'),
				eq(oauthAccounts.providerUserId, String(bitbucketUser.uuid))
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
				username: bitbucketUser.username,
				email: primaryEmail.email
			});
			await db.insert(oauthAccounts).values({
				providerId: 'bitbucket',
				providerUserId: String(bitbucketUser.uuid),
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
		logger.error('Failed to authenticate with Bitbucket: ' + e);
		return new Response(null, {
			status: 500
		});
	}
}

interface BitbucketUser {
	uuid: number;
	username: string;
}

interface BitbucketEmails {
	values: {
		email: string;
		is_primary: boolean;
		is_confirmed: boolean;
	}[];
}
