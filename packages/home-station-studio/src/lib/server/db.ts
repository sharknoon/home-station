import { building } from '$app/environment';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from '$lib/server/schema';
import logger from '$lib/server/logger';

export let sql: postgres.Sql;
export let db: PostgresJsDatabase<typeof schema>;

const testing = process.env.NODE_ENV === 'test';

// Create the connection to the postgres database and run migrations
try {
	let postgresUrl;
	if (!building && !testing) {
		logger.info('Connecting to the production database');
		if (!process.env.POSTGRES_URL) {
			throw new Error('POSTGRES_URL environment variable is not set');
		}
		postgresUrl = process.env.POSTGRES_URL;
	} else {
		logger.info('Connecting to the test database');
		if (!process.env.POSTGRES_TEST_URL) {
			throw new Error('POSTGRES_TEST_URL environment variable is not set');
		}
		postgresUrl = process.env.POSTGRES_TEST_URL;
	}
	sql = postgres(postgresUrl);
	db = drizzle(sql, { schema });
	logger.info('Successfully connected to the database');

	logger.info('Running migrations');
	const migrationClient = postgres(postgresUrl, { max: 1 });
	await migrate(drizzle(migrationClient), { migrationsFolder: './drizzle' });
	logger.info('Migrations completed');
} catch (error) {
	logger.error('Failed to connect to the database: ' + error);
	process.exit(1);
}
