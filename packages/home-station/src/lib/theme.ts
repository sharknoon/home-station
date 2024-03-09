import { browser } from '$app/environment';
import type { users } from '$lib/server/schema';

export type Theme = (typeof users.$inferSelect)['theme'];

export const themes: { name: Theme; icon: string }[] = [
    { name: 'skeleton', icon: '💀' },
    { name: 'wintry', icon: '🌨️' },
    { name: 'modern', icon: '🤖' },
    { name: 'rocket', icon: '🚀' },
    { name: 'seafoam', icon: '🧜‍♀️' },
    { name: 'vintage', icon: '📺' },
    { name: 'sahara', icon: '🏜️' },
    { name: 'hamlindigo', icon: '👔' },
    { name: 'gold-nouveau', icon: '💫' },
    { name: 'crimson', icon: '⭕' }
];

export function applyTheme(theme: Theme = 'skeleton') {
    if (browser) {
        document.body.setAttribute('data-theme', theme);
    }
}
