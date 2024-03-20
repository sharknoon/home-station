import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import type { LocalizedString } from '$lib/i18n';
import type { AppConfiguration } from '$lib/schemas/app.schema';
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
    links: text('links', { mode: 'json' }).notNull().$type<AppConfiguration['links']>(),
    publishedAt: text('published_at').notNull(),
    developer: text('developer').notNull(),
    category: text('category', {
        enum: [
            'books',
            'medical',
            'business',
            'music',
            'developer-tools',
            'navigation',
            'education',
            'news',
            'entertainment',
            'photo-and-video',
            'finance',
            'productivity',
            'food-and-drink',
            'reference',
            'games',
            'graphics-and-design',
            'shopping',
            'health-and-fitness',
            'social-networking',
            'lifestyle',
            'sports',
            'kids',
            'travel',
            'magazines-and-newspapers',
            'utilities',
            'weather'
        ]
    }).notNull(),
    license: text('license'),
    config: text('config', { mode: 'json' }).$type<AppConfiguration['config']>(),
    // TODO add check contraint to ensure only one of these 3 networking configuration options are set
    // See https://orm.drizzle.team/docs/indexes-constraints#check
    http: text('http', { mode: 'json' }).$type<AppConfiguration['http']>(),
    tcp: text('http', { mode: 'json' }).$type<AppConfiguration['tcp']>(),
    udp: text('http', { mode: 'json' }).$type<AppConfiguration['udp']>(),
    messages: text('messages', { mode: 'json' }).$type<AppConfiguration['messages']>()
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
