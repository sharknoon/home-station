import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { themes, type Theme } from '$lib/theme';

export const actions: Actions = {
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
