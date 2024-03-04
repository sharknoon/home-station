import { Lucia } from 'lucia';
import { dev } from '$app/environment';
import { GitHub, GitLab, Bitbucket } from 'arctic';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { sessions, users } from '$lib/server/schema';
import { db } from '$lib/server/db';
import { env } from '$env/dynamic/private';

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			// attributes has the type of DatabaseUserAttributes
			userId: attributes.id,
			username: attributes.username,
			email: attributes.email
		};
	}
});

// Check if the needed environment variables are set
const requiredEnvVars = [
	'GITHUB_CLIENT_ID',
	'GITHUB_CLIENT_SECRET',
	'GITHUB_REDIRECT_URI',
	'GITLAB_CLIENT_ID',
	'GITLAB_CLIENT_SECRET',
	'GITLAB_REDIRECT_URI',
	'BITBUCKET_CLIENT_ID',
	'BITBUCKET_CLIENT_SECRET',
	'BITBUCKET_REDIRECT_URI'
];

for (const envVar of requiredEnvVars) {
	if (!env[envVar]) {
		throw new Error(`Environment variable "${envVar}" is not set`);
	}
}

export const github = new GitHub(
	env.GITHUB_CLIENT_ID!,
	env.GITHUB_CLIENT_SECRET!,
	{ redirectURI: env.GITHUB_REDIRECT_URI! }
);

export const gitlab = new GitLab(
	env.GITLAB_CLIENT_ID!,
	env.GITLAB_CLIENT_SECRET!,
	env.GITLAB_REDIRECT_URI!
);

export const bitbucket = new Bitbucket(
	env.BITBUCKET_CLIENT_ID!,
	env.BITBUCKET_CLIENT_SECRET!,
	env.BITBUCKET_REDIRECT_URI!
);

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	id: (typeof users.$inferSelect)['id'];
	username: (typeof users.$inferSelect)['username'];
	email: (typeof users.$inferSelect)['email'];
}

export async function deleteExpiredSessions() {
	lucia.deleteExpiredSessions();
}
