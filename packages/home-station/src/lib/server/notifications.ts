import type { NotificationType } from '$lib/notifications';
import { dispatchEvent } from '$lib/server/events';

export function sendNotification(level: NotificationType, message: string) {
    dispatchEvent('notification', { level, message });
}
