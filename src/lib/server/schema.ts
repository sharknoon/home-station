import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import type { LocalizedString } from '$lib/i18n';
import type { AppConfig, AppHttp, AppLinks, AppMessages } from './apprepositories';

export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    username: text('username').notNull().unique(),
    hashedPassword: text('hashed_password').notNull(),
    language: text('language').notNull().default('en'),
    theme: text('theme', {
        enum: [
            'skeleton',
            'wintry',
            'modern',
            'rocket',
            'seafoam',
            'vintage',
            'sahara',
            'hamlindigo',
            'gold-nouveau',
            'crimson'
        ]
    })
        .notNull()
        .default('skeleton')
});

export const sessions = sqliteTable('user_sessions', {
    id: text('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id),
    expiresAt: integer('expires_at').notNull()
});

// The container engines (remote or local) for deploying the apps
export const containerEngines = sqliteTable('container_engines', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull().unique(),
    type: text('type', { enum: ['local', 'remote'] }).notNull(),
    socketPath: text('socket_path'),
    host: text('host'),
    ca: text('ca'),
    cert: text('cert'),
    key: text('key')
});

// Git repositores that host apps
export const appRepositories = sqliteTable('app_repositories', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    url: text('url').notNull().unique(),
    username: text('username'),
    password: text('password')
});

// Apps for the app store (this is the result of the app repositories)
export const availableApps = sqliteTable(
    'available_apps',
    {
        id: text('id').notNull(),
        appRepositoryId: integer('app_repository_id')
            .notNull()
            .references(() => appRepositories.id),
        name: text('name', { mode: 'json' }).notNull().$type<LocalizedString>(),
        description: text('description', { mode: 'json' }).notNull().$type<LocalizedString>(),
        icon: text('icon').notNull(),
        banner: text('banner'),
        links: text('links', { mode: 'json' }).notNull().$type<AppLinks>(),
        publishedAt: text('published_at').notNull(),
        developer: text('developer').notNull(),
        category: text('category', { enum: ['File Transfer - Web-based File Managers'] }).notNull(), //TODO: Add more categories from awesome-selfhosted
        config: text('config', { mode: 'json' }).$type<AppConfig[]>(),
        http: text('http', { mode: 'json' }).notNull().$type<AppHttp[]>(),
        messages: text('messages', { mode: 'json' }).$type<AppMessages>()
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.id, table.appRepositoryId] })
        };
    }
);

// Domains and Hostnames for apps
export const hostnames = sqliteTable('hostnames', {
    host: text('host').primaryKey()
});
