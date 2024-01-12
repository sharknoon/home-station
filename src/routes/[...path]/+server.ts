import fs from 'node:fs/promises';
import { error } from '@sveltejs/kit';

export const GET = async ({ params }) => {
	try {
		const file = await fs.readFile('/' + params.path);
		return new Response(file);
	} catch (e) {
		console.log(e);
		return error(404);
	}
};
