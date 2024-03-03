import type { RequestHandler } from './$types';
import { addController, removeController } from '$lib/server/events';

export const GET: RequestHandler = async () => {
    let controller: ReadableStreamDefaultController<string>;

    return new Response(
        new ReadableStream({
            start: (c) => {
                controller = c;
                addController(controller);
            },
            cancel: () => {
                removeController(controller);
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
