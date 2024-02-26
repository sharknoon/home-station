import { b as building } from "../../../chunks/environment.js";
import { t as tasks } from "../../../chunks/tasks.js";
const controllers = /* @__PURE__ */ new Set();
if (!building) {
  for (const task of tasks) {
    task.stats.subscribe((stats) => {
      const result = `event: updateStats
data: ${JSON.stringify({ id: task.id, stats })}

`;
      controllers.forEach((controller) => controller.enqueue(result));
    });
  }
}
const GET = async () => {
  let controller;
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
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive"
      }
    }
  );
};
export {
  GET
};
