import { getToastStore, type ToastStore } from '@skeletonlabs/skeleton';
import { addEventListener } from '$lib/events';

export type NotificationType = 'error' | 'warn' | 'info' | 'success' | 'debug';

let toastStore: ToastStore;

export function init() {
    toastStore = getToastStore();
    addEventListener('notification', (data) =>
        showNotification(data.level, data.message, data.duration)
    );
}

function showNotification(level: NotificationType, message: string, duration?: number) {
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
    let timeout: number;
    if ((duration ?? 0) < 0) {
        // This is the maximum value the timeout can be set to, this is being used to set the timeout to "infinite"
        timeout = 2147483647;
    } else if (duration !== undefined) {
        timeout = duration;
    } else {
        timeout = message.length * 200;
    }
    toastStore.trigger({
        message,
        background,
        autohide,
        timeout
    });
}

/**
 * Sends a notification with the specified level, message, and optional duration.
 * @param level - The level of the notification.
 * @param message - The message to be displayed in the notification.
 * @param duration - The duration in ms for which the notification should be displayed (optional). -1 for infinite.
 */
export function sendNotification(level: NotificationType, message: string, duration?: number) {
    showNotification(level, message, duration);
}
