import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import type { LocalizedString } from '$lib/i18n';
import type { Config, Http, Links, Messages } from './marketplaces';
import { relations } from 'drizzle-orm';

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
        .references(() => users.id, { onDelete: 'cascade' }),
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
export const marketplaces = sqliteTable('marketplaces', {
    gitRemoteUrl: text('git_remote_url').primaryKey(),
    gitUsername: text('git_username'),
    gitPassword: text('git_password')
});

// Apps for the marketplace
export const marketplaceApps = sqliteTable('marketplace_apps', {
    // IDs for apps are only unique within a marketplace
    uuid: text('uuid').primaryKey(),
    marketplaceUrl: text('marketplace_url')
        .notNull()
        .references(() => marketplaces.gitRemoteUrl, { onDelete: 'cascade' }),
    version: text('version').notNull(),
    name: text('name', { mode: 'json' }).notNull().$type<LocalizedString>(),
    description: text('description', { mode: 'json' }).notNull().$type<LocalizedString>(),
    icon: text('icon').notNull(),
    banner: text('banner'),
    screenshots: text('screenshots', { mode: 'json' }).notNull().$type<string[]>(),
    links: text('links', { mode: 'json' }).notNull().$type<Links>(),
    publishedAt: text('published_at').notNull(),
    developer: text('developer').notNull(),
    category: text('category', { enum: ['productivity'] }).notNull(), //TODO: Add more categories from https://developer.apple.com/app-store/categories/
    license: text('license').notNull(),
    config: text('config', { mode: 'json' }).$type<Config[]>(),
    http: text('http', { mode: 'json' }).notNull().$type<Http[]>(),
    messages: text('messages', { mode: 'json' }).$type<Messages>()
});
export const marketplaceAppsRelations = relations(marketplaceApps, ({ one }) => ({
    marketplace: one(marketplaces, {
        fields: [marketplaceApps.marketplaceUrl],
        references: [marketplaces.gitRemoteUrl]
    })
}));

// Domains and Hostnames for apps
export const hostnames = sqliteTable('hostnames', {
    host: text('host').primaryKey()
});
