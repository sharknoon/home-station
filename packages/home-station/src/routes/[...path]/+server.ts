import fs from 'node:fs/promises';
import path from 'node:path';
import { error } from '@sveltejs/kit';
import mime from 'mime';
import { getAppDataPath } from '$lib/server/appdata';

export const GET = async ({ params }) => {
    try {
        const appDataPath = await getAppDataPath();
        const filePath = path.join(appDataPath, params.path);
        const file = await fs.readFile(filePath);
        return new Response(file, {
            headers: { 'Content-Type': mime.getType(filePath) ?? 'application/octet-stream' }
        });
    } catch (e) {
        return error(404);
    }
};
