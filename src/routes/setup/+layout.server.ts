import type { LayoutServerLoad } from './$types';
import * as fs from 'node:fs';

// Yes this is a global state for all requests from any user
const dataVolumeMounted = (() => {
	try {
		fs.accessSync('/app/data', fs.constants.F_OK);
		return true;
	} catch (err) {
		return false;
	}
})();

export const load = (async () => {
	return { dataVolumeMounted };
}) satisfies LayoutServerLoad;
