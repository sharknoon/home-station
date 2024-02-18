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

const testing = process.env.NODE_ENV === 'test';

// Create the connection to the better-sqlite3 database and run migrations
try {
    const appDataPersitency = await getAppDataPersistency();
    if (appDataPersitency.isPersistent && !building && !testing) {
        const databasePath = path.join(appDataPersitency.currentAppDataPath, 'db.sqlite');
        logger.info(`Connecting to the database "${databasePath}"`);
        sqlite = new DatabaseConstructor(databasePath);
    } else {
        sqlite = new DatabaseConstructor(':memory:');
        logger.info('Connecting to the database in memory');
        if (!building && !testing) {
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
    if (!(await db.query.users.findFirst())) {
        logger.info('Seeding the database');

        // Add the default app repository
        if (!(await db.query.appRepositories.findFirst())) {
            await db.insert(appRepositories).values({
                id: 'github_com_home_station_org_apps',
                url: 'https://github.com/home-station-org/apps.git',
                // TODO remove username and token once public
                username: 'Sharknoon',
                password: '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'
            });
        }

        logger.info('Successfully seeded the database');
    }
} catch (error) {
    logger.error('Failed to seed the database: ' + error);
    // Depending on future additions to seeding the database, this might be a critical error and wen need to stop starting the server
}

export default db;
