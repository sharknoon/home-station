import { t as tasks, e as executeTask } from "../../../../../chunks/tasks.js";
import { g as get_store_value } from "../../../../../chunks/utils2.js";
import { f as fail } from "../../../../../chunks/index.js";
const load = async () => {
  return {
    tasks: tasks.map((task) => {
      const stats = get_store_value(task.stats);
      return {
        id: task.id,
        schedule: task.schedule,
        stats: {
          progress: stats.progress,
          running: stats.running,
          lastExecution: stats.lastExecution,
          lastDuration: stats.lastDuration,
          nextExecution: stats.nextExecution
        }
      };
    })
  };
};
const actions = {
  async runTask({ request }) {
    const formData = await request.formData();
    const id = formData.get("id");
    if (!id) {
      return fail(400, { error: "No task ID provided" });
    }
    const task = tasks.find((task2) => task2.id === id);
    if (!task) {
      return fail(404, { error: `Task with ID "${id}" not found` });
    }
    executeTask(task);
  }
};
export {
  actions,
  load
};
