import { addEventListener } from './events';

import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
import { i18n } from '$lib/i18n';
import { get } from 'svelte/store';

export function init() {
    const toastStore = getToastStore();
    addEventListener('notification', (data) => {
        let background;
        let autohide = true;
        switch (data.level) {
            case 'error':
                background = 'variant-filled-error';
                autohide = false;
                break;
            case 'warn':
                background = 'variant-filled-warning';
                break;
            case 'info':
                background = 'variant-filled-tertiary';
                break;
            case 'debug':
                background = 'variant-filled-surface';
                break;
        }
        const t: ToastSettings = {
            message: get(i18n).t(data.i18nKey, data.data),
            background,
            autohide
        };
        toastStore.trigger(t);
    });
}
