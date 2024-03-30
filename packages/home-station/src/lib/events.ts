import { browser } from '$app/environment';
import type { TaskStats } from '$lib/server/tasks';
import type { NotificationType } from '$lib/notifications';

let evtSource: EventSource | undefined;
if (browser) {
    evtSource = new EventSource('/events');
    evtSource.onerror = (e) => console.error(e);
}

export function addEventListener<E extends Event>(
    event: E,
    callback: (data: EventData<E>) => void
) {
    if (!browser) return;
    evtSource?.addEventListener(event, (me: MessageEvent<string>) => {
        try {
            callback(JSON.parse(me.data) as EventData<E>);
        } catch (e) {
            console.error(e);
        }
    });
}

export type Event = 'updateStats' | 'appStatus' | 'notification';
// prettier-ignore
export type EventData<T extends Event> = 
    T extends 'updateStats' ? { id: string; stats: TaskStats } :
    T extends 'appStatus' ? { appId: string; status: "not installed" | "installing" | "installed"; progress: number } :
    T extends 'notification' ? { level: NotificationType, message: string, duration?: number } :
    never;
