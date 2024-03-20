import { getToastStore, type ToastStore } from '@skeletonlabs/skeleton';
import { addEventListener } from '$lib/events';

export type NotificationType = 'error' | 'warn' | 'info' | 'success' | 'debug';

let toastStore: ToastStore;

export function init() {
    toastStore = getToastStore();
    addEventListener('notification', (data) => showNotification(data.level, data.message));
}

function showNotification(level: NotificationType, message: string) {
    let background;
    let autohide = true;
    switch (level) {
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
        case 'success':
            background = 'variant-filled-success';
            break;
        case 'debug':
            background = 'variant-filled-surface';
            break;
    }
    toastStore.trigger({
        message,
        background,
        autohide,
        // People should not feel stressed about reading the notification
        timeout: message.split(' ').length * 1000
    });
}

export function sendNotification(level: NotificationType, message: string) {
    showNotification(level, message);
}
