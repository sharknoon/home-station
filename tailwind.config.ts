import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import { join } from 'node:path';
import { skeleton } from '@skeletonlabs/tw-plugin';

const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	darkMode: 'class',
	theme: {
		extend: {}
	},
	plugins: [
		forms,
		skeleton({
			themes: {
				preset: [
					{ name: 'skeleton', enhancements: true },
					{ name: 'wintry', enhancements: true },
					{ name: 'modern', enhancements: true },
					{ name: 'rocket', enhancements: true },
					{ name: 'seafoam', enhancements: true },
					{ name: 'vintage', enhancements: true },
					{ name: 'sahara', enhancements: true },
					{ name: 'hamlindigo', enhancements: true },
					{ name: 'gold-nouveau', enhancements: true },
					{ name: 'crimson', enhancements: true }
				]
			}
		})
	]
} satisfies Config;

export default config;
