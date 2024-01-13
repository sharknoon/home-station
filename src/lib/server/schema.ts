import { sqliteTable, text, integer, primaryKey, blob } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	language: text('language').notNull().default('en'),
	theme: text('theme', { enum: ['light', 'dark', 'system'] })
		.notNull()
		.default('system')
});

export const sessions = sqliteTable('user_sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	activeExpires: blob('active_expires', {
		mode: 'bigint'
	}).notNull(),
	idleExpires: blob('idle_expires', {
		mode: 'bigint'
	}).notNull()
});

export const keys = sqliteTable('user_keys', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	hashedPassword: text('hashed_password')
});

export const systems = sqliteTable('systems', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	setupComplete: integer('setup_complete', { mode: 'boolean' }).notNull().default(false),
	currentSetupStep: integer('current_setup_step').notNull().default(0)
});

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

export const appRepositories = sqliteTable('app_repositories', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	url: text('url').notNull().unique(),
	username: text('username'),
	password: text('password')
});

export const availableApps = sqliteTable(
	'available_apps',
	{
		appId: text('app_id').notNull(),
		appRepositoryId: integer('app_repository_id')
			.notNull()
			.references(() => appRepositories.id),
		name: text('name').notNull(),
		description: text('description').notNull(),
		icon: text('icon').notNull(),
		banner: text('banner'),
		links: text('links', { mode: 'json' }).notNull().$type<{
			repository: string;
			website?: string;
			custom?: {
				name: string;
				url: string;
			}[];
		}>(),
		publishedAt: text('published_at').notNull(),
		developer: text('developer').notNull(),
		category: text('category', { enum: ['File Transfer - Web-based File Managers'] }).notNull() //TODO: Add more categories from awesome-selfhosted
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.appId, table.appRepositoryId] })
		};
	}
);
