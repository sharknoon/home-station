import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { users } from '$lib/server/schema';
import { db } from '$lib/server/db';

export const actions: Actions = {
    updatePassword: async ({ request, locals }) => {
        if (!locals.user) return {};
        const data = await request.formData();
        const oldPassword = data.get('old-password')?.toString() ?? '';
        const password = data.get('password')?.toString();

        const user = await db.query.users.findFirst({
            where: eq(users.id, locals.user.id)
        });
        if (!user) return fail(500, { success: false, error: 'User could not be found' });
        const validOldPassword = await bcrypt.compare(oldPassword, user.hashedPassword);
        if (!validOldPassword) {
            return fail(400, {
                oldPassword: 'oldPassword',
                invalid: true
            });
        }
        if (!password || password.length < 8 || password.length > 255) {
            return fail(400, {
                password: 'password',
                invalid: true
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.update(users).set({ hashedPassword }).where(eq(users.id, locals.user.id));

        return { success: true };
    }
};
