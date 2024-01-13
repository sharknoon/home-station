/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', ...defaultTheme.fontFamily.sans]
			},
			colors: {
				muted: 'var(--muted)',
				border: colors.gray[600],
				primary: 'rgb(var(--color-primary) / <alpha-value>)', //colors.emerald[700],
				secondary: 'rgb(var(--color-secondary) / <alpha-value>)', //colors.gray[800],
				accent: '',
				destructive: ''
			}
		}
	},
	plugins: [require('@tailwindcss/forms')]
};
