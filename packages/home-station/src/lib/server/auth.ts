import { Lucia } from 'lucia';
import db from '$lib/server/db';
import { dev } from '$app/environment';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { sessions, users } from './schema';

// @ts-expect-error Drizzle and SQLite are out of sync TODO remove once fixed
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

export async function deleteExpiredSessions() {
    lucia.deleteExpiredSessions();
}
