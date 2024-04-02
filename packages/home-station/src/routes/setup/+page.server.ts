import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { lucia } from '$lib/server/auth';
import { users } from '$lib/server/schema';
import { generateId } from 'lucia';
import bcrypt from 'bcrypt';

export const load = (async () => {
    const hasUsers = !!(await db.query.users.findFirst());
    if (hasUsers) {
        return redirect(303, '/');
    }
}) satisfies PageServerLoad;

export const actions = {
    signup: async ({ request, cookies }) => {
        const data = await request.formData();

        // User data
        const username = data.get('username')?.toString();
        const password = data.get('password')?.toString();
        const language = data.get('language')?.toString();

        // User data validation
        if (!username || !/[a-zA-Z0-9_]{4,31}/.test(username)) {
            return fail(400, { username, invalid: true });
        }
        if (!password || password.length < 8 || password.length > 255) {
            return fail(400, { password: 'password', invalid: true });
        }
        if (!language || !['en', 'de'].includes(language)) {
            return fail(400, { language, invalid: true });
        }
        const usernameExists = !!(await db.query.users.findFirst({
            where: eq(users.username, username.toLowerCase())
        }));
        if (usernameExists) {
            return fail(400, { username, exists: true });
        }

        try {
            // User setup
            const userId = generateId(15);
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.insert(users).values({
                id: userId,
                username: username.toLowerCase(),
                hashedPassword,
                language,
                theme: 'skeleton'
            });
            const session = await lucia.createSession(userId, {});
            const sessionCookie = lucia.createSessionCookie(session.id);
            cookies.set(sessionCookie.name, sessionCookie.value, {
                path: '.',
                ...sessionCookie.attributes
            });
        } catch (e) {
            return fail(500, {
                message: 'An unknown error occurred'
            });
        }
        return redirect(302, '/');
    }
} satisfies Actions;
