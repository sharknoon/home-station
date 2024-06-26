import { Lucia } from 'lucia';
import { DrizzleSQLiteAdapter } from '$lib/server/auth.adapter';
import { dev } from '$app/environment';
import { db } from '$lib/server/db';
import { sessions, users } from '$lib/server/schema';

const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            // set to `true` when using HTTPS
            secure: !dev
        }
    },
    getUserAttributes: (attributes) => {
        return {
            username: attributes.username,
            language: attributes.language,
            theme: attributes.theme
        };
    }
});

declare module 'lucia' {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

interface DatabaseUserAttributes {
    username: (typeof users.$inferSelect)['username'];
    language: (typeof users.$inferSelect)['language'];
    theme: (typeof users.$inferSelect)['theme'];
}

/**
 * Deletes expired sessions. This function seems unnecessary, but because
 * it is in this module, it forces lucia to be initialized before it is called.
 */
export async function deleteExpiredSessions(): Promise<void> {
    await lucia.deleteExpiredSessions();
}
