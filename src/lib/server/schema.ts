import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

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
  key: text('key'),
});

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull()
});