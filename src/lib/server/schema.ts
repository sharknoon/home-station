import { sqliteTable, text, integer, primaryKey, foreignKey } from 'drizzle-orm/sqlite-core';
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
    id: text('id').primaryKey(),
    gitRemoteUrl: text('git_remote_url').notNull().unique(),
    gitUsername: text('git_username'),
    gitPassword: text('git_password')
});

// Apps for the marketplace
export const marketplaceApps = sqliteTable(
    'marketplace_apps',
    {
        appId: text('app_id').notNull(),
        marketplaceId: text('marketplace_id')
            .notNull()
            .references(() => marketplaces.id, { onDelete: 'cascade' }),
        name: text('name', { mode: 'json' }).notNull().$type<LocalizedString>(),
        description: text('description', { mode: 'json' }).notNull().$type<LocalizedString>(),
        icon: text('icon').notNull(),
        banner: text('banner'),
        links: text('links', { mode: 'json' }).notNull().$type<Links>(),
        publishedAt: text('published_at').notNull(),
        developer: text('developer').notNull(),
        category: text('category', { enum: ['File Transfer - Web-based File Managers'] }).notNull(), //TODO: Add more categories from awesome-selfhosted
        config: text('config', { mode: 'json' }).$type<Config[]>(),
        http: text('http', { mode: 'json' }).notNull().$type<Http[]>(),
        messages: text('messages', { mode: 'json' }).$type<Messages>()
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.appId, table.marketplaceId] })
        };
    }
);
export const marketplaceAppsRelations = relations(marketplaceApps, ({ one }) => ({
    marketplace: one(marketplaces, {
        fields: [marketplaceApps.marketplaceId],
        references: [marketplaces.id]
    })
}));

// Domains and Hostnames for apps
export const hostnames = sqliteTable('hostnames', {
    host: text('host').primaryKey()
});

// Apps that are installed on on of the servers
export const apps = sqliteTable(
    'apps',
    {
        appId: text('app_id').notNull(),
        marketplaceId: text('marketplace_id').notNull(),
        containerEngineId: integer('container_engine_id')
            .notNull()
            .references(() => containerEngines.id, { onDelete: 'cascade' }),
        installedAt: integer('installed_at').notNull()
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.appId, table.marketplaceId] }),
            marketplaceAppReference: foreignKey({
                columns: [table.appId, table.marketplaceId],
                foreignColumns: [marketplaceApps.appId, marketplaceApps.marketplaceId],
                name: 'marketplace_app_reference'
                // onDelete: 'cascade' // once it is supported by drizzle-orm
            })
        };
    }
);
export const appsRelations = relations(apps, ({ one }) => ({
    marketplaceApp: one(marketplaceApps, {
        fields: [apps.appId, apps.marketplaceId],
        references: [marketplaceApps.appId, marketplaceApps.marketplaceId]
    })
}));
