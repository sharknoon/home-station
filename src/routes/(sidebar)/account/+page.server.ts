import db from '$lib/server/db';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { get } from 'svelte/store';
import i18n from '$lib/i18n';
import { Argon2id } from 'oslo/password';

export const actions: Actions = {
	updateAccount: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { success: false, error: 'Unauthorized' });
		const data = await request.formData();
		const language = data.get('language')?.toString();
		if (!language) return fail(400, { success: false, language, error: 'Language is required' });
		const supportedLanguages = get(i18n).options.supportedLngs || [];
		if (!supportedLanguages.includes(language)) {
			return fail(400, {
				error: `Unsupported language '${language}', supported languages: ${supportedLanguages}`
			});
		}

		await db.update(users).set({ language }).where(eq(users.id, locals.user.id));
		locals.user.language = language;

		return { success: true, language };
	},
	updatePassword: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { success: false, error: 'Unauthorized' });
		const data = await request.formData();
		const password = data.get('password')?.toString();
		if (!password || password.length < 8 || password.length > 255) {
			return fail(400, { success: false, password: 'password', error: 'Password is invalid' });
		}

		const hashedPassword = await new Argon2id().hash(password);
		await db.update(users).set({ hashedPassword }).where(eq(users.id, locals.user.id));

		return { success: true, password: 'password' };
	}
};
