import { Lucia } from 'lucia';
import { dev } from '$app/environment';
import { GitHub, GitLab, Bitbucket } from 'arctic';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { sessions, users } from '$lib/server/schema';
import { db } from '$lib/server/db';

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

export const github = new GitHub(
	import.meta.env.GITHUB_CLIENT_ID,
	import.meta.env.GITHUB_CLIENT_SECRET,
	{ redirectURI: import.meta.env.GITHUB_REDIRECT_URI }
);

export const gitlab = new GitLab(
	import.meta.env.GITLAB_CLIENT_ID,
	import.meta.env.GITLAB_CLIENT_SECRET,
	import.meta.env.GITLAB_REDIRECT_URI
);

export const bitbucket = new Bitbucket(
	import.meta.env.BITBUCKET_CLIENT_ID,
	import.meta.env.BITBUCKET_CLIENT_SECRET,
	import.meta.env.BITBUCKET_REDIRECT_URI
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
