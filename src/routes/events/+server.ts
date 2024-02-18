import { building } from '$app/environment';
import type { RequestHandler } from './$types';
import { tasks } from '$lib/server/tasks';

const controllers = new Set<ReadableStreamDefaultController<string>>();
if (!building) {
    // Update task stats like progress, last execution, last duration etc...
    for (const task of tasks) {
        task.stats.subscribe((stats) => {
            const result = `event: updateStats\ndata: ${JSON.stringify({ id: task.id, stats })}\n\n`;
            controllers.forEach((controller) => controller.enqueue(result));
        });
    }
    // Update app status like installing, running, stopped etc...
}

export const GET: RequestHandler = async () => {
    let controller: ReadableStreamDefaultController<string>;

    return new Response(
        new ReadableStream({
            start: (c) => {
                controller = c;
                controllers.add(controller);
            },
            cancel: () => {
                controllers.delete(controller);
            }
        }),
        {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive'
            }
        }
    );
};