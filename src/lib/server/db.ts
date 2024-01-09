import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import DatabaseConstructor, { type Database } from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from '$lib/server/schema';
import { systems } from '$lib/server/schema';

let sqlite: Database;
let db: BetterSQLite3Database<typeof schema>;

// Create the connection to the better-sqlite3 database
try {
	sqlite = new DatabaseConstructor('/app/data/db.sqlite');
} catch (error) {
	sqlite = new DatabaseConstructor(':memory:');
	console.warn('Failed to open database file, using in-memory database instead');
	console.warn('-----------------------------------------------');
	console.warn('| All data will be lost when the server stops |');
	console.warn('-----------------------------------------------');
}

// Connect with drizzle and run migrations
try {
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
	if (!(await db.query.systems.findFirst())) {
		await db.insert(systems).values({});
	}
} catch (error) {
	console.error('Failed to seed the database: ' + error);
	process.exit(1);
}

export default db;
