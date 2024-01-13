import { browser } from '$app/environment';
import { get, writable } from 'svelte/store';
import type { users } from '$lib/server/schema';

export type Theme = (typeof users.$inferSelect)['theme'];
export type SystemTheme = Exclude<Theme, 'system'>;

export const systemTheme = writable<SystemTheme>();
export const theme = writable<Theme>();

// User changes theme
theme.subscribe((t: Theme) => applyTheme(t));

if (browser) {
	const query = window.matchMedia('(prefers-color-scheme: dark)');
	systemTheme.set(query.matches ? 'dark' : 'light');

	// System changes theme
	query.addEventListener('change', (m) => {
		systemTheme.set(m.matches ? 'dark' : 'light');
		applyTheme(get(theme));
	});
}

function applyTheme(t: Theme) {
	if (!browser || !t) return;
	const theme = t === 'system' ? get(systemTheme) : t;
	switch (theme) {
		case 'dark':
			document.documentElement.setAttribute('data-theme', 'dark');
			break;
		case 'light':
		default:
			document.documentElement.setAttribute('data-theme', 'light');
			break;
	}
	localStorage.setItem('data-theme', t);
}

type ThemeProvider = () => Theme | undefined;

export function init(themeFromDb?: Theme) {
	const dbThemeProvider: ThemeProvider = () => themeFromDb;
	const localStorageThemeProvider: ThemeProvider = () =>
		browser ? (localStorage.getItem('data-theme') as Theme | undefined) : undefined;
	const defaultThemeProvider: ThemeProvider = () => 'system';

	const themeProviders = [dbThemeProvider, localStorageThemeProvider, defaultThemeProvider];

	for (const provider of themeProviders) {
		const t = provider();
		if (t) {
			theme.set(t);
			return;
		}
	}
}
