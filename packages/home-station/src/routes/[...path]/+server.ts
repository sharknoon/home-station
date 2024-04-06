import fs from 'node:fs/promises';
import path from 'node:path';
import { error } from '@sveltejs/kit';
import mime from 'mime';
import { getDataPath } from '$lib/server/data';

export const GET = async ({ params }) => {
    try {
        const dataPath = await getDataPath();
        const filePath = path.join(dataPath, params.path);
        const file = await fs.readFile(filePath);
        return new Response(file, {
            headers: { 'Content-Type': mime.getType(filePath) ?? 'application/octet-stream' }
        });
    } catch (e) {
        return error(404);
    }
};
