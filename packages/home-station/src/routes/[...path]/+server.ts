import path from 'node:path';
import { getAppDataPath } from '$lib/server/appdata';
import { read } from '$app/server';

export const GET = async ({ params }) => {
    return read(path.join(await getAppDataPath(), params.path));
};
