// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth: import('lucia').AuthRequest;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type Auth = import('$lib/server/auth').Auth;
		type DatabaseUserAttributes = {
			username: string;
			language: (typeof import('$lib/server/schema').users.$inferSelect)['language'];
			theme: import('$lib/theme').Theme;
		};
		type DatabaseSessionAttributes = Record<string, never>;
	}
}

export {};
