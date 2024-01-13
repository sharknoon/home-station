import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { betterSqlite3 } from '@lucia-auth/adapter-sqlite';
import { sqlite } from '$lib/server/db';
import { dev } from '$app/environment';

export const auth = lucia({
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	adapter: betterSqlite3(sqlite, {
		user: 'users',
		session: 'user_sessions',
		key: 'user_keys'
	}),
	getUserAttributes: (data) => {
		return {
			username: data.username,
			language: data.language,
			theme: data.theme
		};
	}
});

export type Auth = typeof auth;
