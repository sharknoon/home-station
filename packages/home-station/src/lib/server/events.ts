const controllers = new Set<ReadableStreamDefaultController<string>>();

export function addController(controller: ReadableStreamDefaultController<string>) {
    controllers.add(controller);
}

export function removeController(controller: ReadableStreamDefaultController<string>) {
    controllers.delete(controller);
}

export function sendEvent(event: string, data: string) {
    const result = `event: ${event}\ndata: ${data}\n\n`;
    controllers.forEach((controller) => controller.enqueue(result));
}
