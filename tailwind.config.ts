import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms';
import { join } from 'node:path';
import { skeleton } from '@skeletonlabs/tw-plugin';

const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(
			require.resolve('@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}'
		)
	],
	darkMode: 'class',
	theme: {
		extend: {}	
	},
	plugins: [
		forms,
		skeleton({
			themes: { preset: [ "skeleton" ] }
		})
	]
} satisfies Config;

export default config;