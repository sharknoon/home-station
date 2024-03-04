import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '$lib/server/schema';
import logger from '$lib/server/logger';
import { env } from '$env/dynamic/private';

export let sql: postgres.Sql;
export let db: PostgresJsDatabase<typeof schema>;

// Create the connection to the postgres database and run migrations
try {
	logger.info(`Connecting to the ${env.NODE_ENV} database`);
	if (!env.POSTGRES_URL) {
		throw new Error('POSTGRES_URL environment variable is not set');
	}
	sql = postgres(env.POSTGRES_URL);
	db = drizzle(sql, { schema });
	logger.info('Successfully connected to the database');
} catch (error) {
	logger.error('Failed to connect to the database: ' + error);
	process.exit(1);
}
