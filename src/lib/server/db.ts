import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import DatabaseConstructor, { type Database } from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from '$lib/server/schema';
import { getAppDataPersistency } from '$lib/server/utils';
import path from 'node:path';

export let sqlite: Database;
export let db: BetterSQLite3Database<typeof schema>;

// Create the connection to the better-sqlite3 database and run migrations
try {
	const appDataPersitency = await getAppDataPersistency();
	if (appDataPersitency.isPersistent) {
		const databasePath = path.join(appDataPersitency.currentAppDataPath, 'db.sqlite');
		console.info(`Connecting to the database "${databasePath}"`);
		sqlite = new DatabaseConstructor(databasePath);
	} else {
		sqlite = new DatabaseConstructor(':memory:');
		console.warn(
			'Connecting to the database in memory. All data will be lost when the server stops!'
		);
	}
	db = drizzle(sqlite, { schema });
	console.info('Successfully connected to the database');

	console.info('Running migrations');
	migrate(db, { migrationsFolder: 'drizzle' });
	console.info('Migrations completed');
} catch (error) {
	console.error('Failed to connect to the database: ' + error);
	process.exit(1);
}

// Seed the database
try {
	if (!(await db.query.appRepositories.findFirst())) {
		// TODO remove and delete token once public
		await db.insert(schema.appRepositories).values({
			url: 'https://github.com/Sharknoon/home-station',
			username: 'Sharknoon',
			password: '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'
		});
	}
} catch (error) {
	console.error('Failed to seed the database: ' + error);
	process.exit(1);
}

export default db;
