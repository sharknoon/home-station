import { get } from 'svelte/store';
import type { LayoutLoad } from './$types';
import { applyTheme } from '$lib/theme';
import { i18n } from '$lib/i18n';

let authorized = false;

export const load = (async ({ data }) => {
    // Every time a user logs in or out, we need to update the theme and language
    const newAuthorized = !!data?.user;
    if (newAuthorized !== authorized) {
        authorized = newAuthorized;
        applyTheme(data?.user?.theme);
        get(i18n)?.changeLanguage(data?.user?.language);
    }
    return { ...data };
}) satisfies LayoutLoad;
