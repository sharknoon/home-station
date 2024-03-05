import db from '$lib/server/db';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { i18n } from '$lib/i18n';
import bcrypt from 'bcrypt';
import { themes, type Theme } from '$lib/theme';

export const actions: Actions = {
    updateAccount: async ({ request, locals }) => {
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
    },
    updatePassword: async ({ request, locals }) => {
        if (!locals.user) return fail(401, { success: false, error: 'Unauthorized' });
        const data = await request.formData();
        const password = data.get('password')?.toString();
        if (!password || password.length < 8 || password.length > 255) {
            return fail(400, {
                success: false,
                password: 'password',
                error: 'Password is invalid'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.update(users).set({ hashedPassword }).where(eq(users.id, locals.user.id));

        return { success: true, password: 'password' };
    },
    updateTheme: async ({ request, locals }) => {
        if (!locals.user) return fail(401, { success: false, error: 'Unauthorized' });
        const data = await request.formData();
        const theme = data.get('theme')?.toString() as Theme | undefined;
        if (!theme) return fail(400, { success: false, theme, error: 'Theme is required' });
        if (!themes.map((t) => t.name).includes(theme)) {
            return fail(400, {
                error: `Unsupported theme '${theme}', supported themes: ${themes}`
            });
        }

        await db.update(users).set({ theme }).where(eq(users.id, locals.user.id));
        locals.user.theme = theme;

        return { success: true, theme };
    }
};
