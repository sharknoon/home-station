import path from 'node:path';
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import DatabaseConstructor, { type Database } from 'better-sqlite3';
import * as schema from '$lib/server/schema';
import { getAppDataPersistency } from '$lib/server/appdata';
import { appRepositories } from '$lib/server/schema';
import { building } from '$app/environment';
import logger from '$lib/server/logger';

export let sqlite: Database;
export let db: BetterSQLite3Database<typeof schema>;

// Create the connection to the better-sqlite3 database and run migrations
try {
    const appDataPersitency = await getAppDataPersistency();
    if (appDataPersitency.isPersistent && !building) {
        const databasePath = path.join(appDataPersitency.currentAppDataPath, 'db.sqlite');
        logger.info(`Connecting to the database "${databasePath}"`);
        sqlite = new DatabaseConstructor(databasePath);
    } else {
        sqlite = new DatabaseConstructor(':memory:');
        logger.info('Connecting to the database in memory');
        if (!building) {
            logger.warn('All data will be lost when the server stops!');
        }
    }
    db = drizzle(sqlite, { schema });
    logger.info('Successfully connected to the database');

    logger.info('Running migrations');
    migrate(db, { migrationsFolder: 'drizzle' });
    logger.info('Migrations completed');
} catch (error) {
    logger.emerg('Failed to connect to the database: ' + error);
    process.exit(1);
}

// Seed the database
try {
    // Only seed the database if it's empty
    if (!(await db.query.users.findFirst()) && !(await db.query.appRepositories.findFirst())) {
        // TODO remove and delete token once public
        logger.info('Seeding the database');
        await db.insert(appRepositories).values({
            id: 'github_com_sharknoon_home_station',
            url: 'https://github.com/Sharknoon/home-station.git',
            username: 'Sharknoon',
            password: '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'
        });
        logger.info('Successfully seeded the database');
    }
} catch (error) {
    logger.error('Failed to seed the database: ' + error);
    // Depending on future additions to seeding the database, this might be a critical error and wen need to stop starting the server
}

export default db;
