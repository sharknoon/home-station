import path from 'node:path';
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import DatabaseConstructor, { type Database } from 'better-sqlite3';
import * as schema from '$lib/server/schema';
import { getDataPersistency } from '$lib/server/data';
import { marketplaces } from '$lib/server/schema';
import { building } from '$app/environment';
import { logger } from '$lib/server/logger';

export let sqlite: Database;
export let db: BetterSQLite3Database<typeof schema>;

const testing = process.env.NODE_ENV === 'test';

// Create the connection to the better-sqlite3 database and run migrations
try {
    const dataPersitency = await getDataPersistency();
    if (dataPersitency.isPersistent && !building && !testing) {
        const databasePath = path.join(dataPersitency.currentDataPath, 'db.sqlite');
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
    logger.info('Connected to the database');

    logger.info('Running migrations');
    migrate(db, { migrationsFolder: 'drizzle' });
    logger.info('Completed migrations');
} catch (error) {
    logger.error('Failed to connect to the database: ' + error);
    process.exit(1);
}

// Seed the database
try {
    // Only seed the database if it's empty
    if (!(await db.query.users.findFirst())) {
        logger.info('Seeding the database');

        // Add the default marketplace
        if (!(await db.query.marketplaces.findFirst())) {
            await db.insert(marketplaces).values({
                gitRemoteUrl: 'https://github.com/sharknoon/home-station-apps.git',
                // TODO remove username and token once public
                gitUsername: 'Sharknoon',
                gitPassword:
                    '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'
            });
        }

        logger.info('Successfully seeded the database');
    }
} catch (error) {
    logger.error('Failed to seed the database: ' + error);
    // Depending on future additions to seeding the database, this might be a critical error and wen need to stop starting the server
}
