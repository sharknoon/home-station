import type { Event, EventData } from '$lib/events';

const controllers = new Set<ReadableStreamDefaultController<string>>();

export function addController(controller: ReadableStreamDefaultController<string>) {
    controllers.add(controller);
}

export function removeController(controller: ReadableStreamDefaultController<string>) {
    controllers.delete(controller);
}

export function dispatchEvent<E extends Event>(event: E, data: EventData<E>) {
    const result = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    controllers.forEach((controller) => controller.enqueue(result));
}
