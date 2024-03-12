import { getToastStore } from '@skeletonlabs/skeleton';
import { addEventListener } from '$lib/events';

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
        toastStore.trigger({
            message: data.message,
            background,
            autohide,
            // People should not feel stressed about reading the notification
            timeout: 15000
        });
    });
}
