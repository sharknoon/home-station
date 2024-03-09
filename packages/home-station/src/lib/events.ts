import { browser } from '$app/environment';
import type { TaskStats } from './server/tasks';

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

export type Event = 'updateStats' | 'appStatus';
// prettier-ignore
export type EventData<T extends Event> = 
    T extends 'updateStats' ? { id: string; stats: TaskStats } :
    T extends 'appStatus' ? { appUuid: string; status: "not installed" | "installing" | "installed"; progress: number } :
    never;
