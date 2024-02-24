import type { Config } from 'drizzle-kit';
import path from 'node:path';
import fs from 'node:fs';

let dbUrl: string | undefined;
switch (process.platform) {
    case 'win32':
        dbUrl = process.env.APPDATA;
        break;
    default:
        dbUrl = process.env.HOME;
}
if (!dbUrl) {
    console.error(
        'Could not find app-data/home directory path. Please make sure that the environment variable "HOME" (macOS/Linux) or "APPDATA" (Windows) is set.'
    );
    process.exit(1);
}
dbUrl = path.join(dbUrl, '.home-station');
fs.mkdirSync(dbUrl, { recursive: true });
dbUrl = path.join(dbUrl, 'db.sqlite');

export default {
    schema: './src/lib/server/schema.ts',
    out: './drizzle',
    driver: 'better-sqlite',
    dbCredentials: { url: dbUrl }
} satisfies Config;
