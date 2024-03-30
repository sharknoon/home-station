import type { NotificationType } from '$lib/notifications';
import { dispatchEvent } from '$lib/server/events';

/**
 * Sends a notification with the specified level, message, and optional duration.
 * @param level - The level of the notification.
 * @param message - The message of the notification.
 * @param duration - The duration in ms of the notification (optional). -1 for infinite.
 */
export function sendNotification(level: NotificationType, message: string, duration?: number) {
    dispatchEvent('notification', { level, message, duration });
}
