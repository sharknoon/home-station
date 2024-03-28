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
    id: text('id').primaryKey(),
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
            // i18n.t('marketplace-app.category.books')
            'books',
            // i18n.t('marketplace-app.category.medical')
            'medical',
            // i18n.t('marketplace-app.category.business')
            'business',
            // i18n.t('marketplace-app.category.music')
            'music',
            // i18n.t('marketplace-app.category.developer-tools')
            'developer-tools',
            // i18n.t('marketplace-app.category.navigation')
            'navigation',
            // i18n.t('marketplace-app.category.education')
            'education',
            // i18n.t('marketplace-app.category.news')
            'news',
            // i18n.t('marketplace-app.category.entertainment')
            'entertainment',
            // i18n.t('marketplace-app.category.photo-and-video')
            'photo-and-video',
            // i18n.t('marketplace-app.category.finance')
            'finance',
            // i18n.t('marketplace-app.category.productivity')
            'productivity',
            // i18n.t('marketplace-app.category.food-and-drink')
            'food-and-drink',
            // i18n.t('marketplace-app.category.reference')
            'reference',
            // i18n.t('marketplace-app.category.games')
            'games',
            // i18n.t('marketplace-app.category.graphics-and-design')
            'graphics-and-design',
            // i18n.t('marketplace-app.category.shopping')
            'shopping',
            // i18n.t('marketplace-app.category.health-and-fitness')
            'health-and-fitness',
            // i18n.t('marketplace-app.category.social-networking')
            'social-networking',
            // i18n.t('marketplace-app.category.lifestyle')
            'lifestyle',
            // i18n.t('marketplace-app.category.sports')
            'sports',
            // i18n.t('marketplace-app.category.kids')
            'kids',
            // i18n.t('marketplace-app.category.travel')
            'travel',
            // i18n.t('marketplace-app.category.magazines-and-newspapers')
            'magazines-and-newspapers',
            // i18n.t('marketplace-app.category.utilities')
            'utilities',
            // i18n.t('marketplace-app.category.weather')
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
