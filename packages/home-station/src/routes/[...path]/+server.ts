import path from 'node:path';
import { getAppDataPath } from '$lib/server/appdata';
import { error } from '@sveltejs/kit';
import fs from 'node:fs/promises';

export const GET = async ({ params }) => {
    try {
        const appDataPath = await getAppDataPath();
        const filePath = path.join(appDataPath, params.path);
        const file = await fs.readFile(filePath);
        return new Response(file);
    } catch (e) {
        return error(404);
    }
};
