import { error } from '@sveltejs/kit';
import path from 'node:path';
import { getAppDataPath } from '$lib/server/appdata';
import { read } from '$app/server';

export const GET = async ({ params }) => {
    try {
        return read(path.join(await getAppDataPath(), params.path));
    } catch (e) {
        return error(404);
    }
};
