import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { eq } from 'drizzle-orm';
import { users } from '$lib/server/schema';
import { db } from '$lib/server/db';
import { i18n } from '$lib/i18n';

export const actions: Actions = {
    updateLanguage: async ({ request, locals }) => {
        if (!locals.user) return fail(401, { success: false, error: 'Unauthorized' });
        const data = await request.formData();
        const language = data.get('language')?.toString();
        if (!language)
            return fail(400, { success: false, language, error: 'Language is required' });
        const supportedLanguages = get(i18n).options.supportedLngs || [];
        if (!supportedLanguages.includes(language)) {
            return fail(400, {
                error: `Unsupported language '${language}', supported languages: ${supportedLanguages}`
            });
        }

        await db.update(users).set({ language }).where(eq(users.id, locals.user.id));
        locals.user.language = language;

        return { success: true, language };
    }
};
