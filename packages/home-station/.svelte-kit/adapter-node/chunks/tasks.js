import { w as writable } from "./index2.js";
import cron, { CronJob } from "cron";
import { u as updateMarketplaceApps, t as throttle } from "./marketplaces.js";
import { d as deleteExpiredSessions } from "./auth.js";
import { l as logger } from "./appdata.js";
const tasks = [
  {
    // t('tasks.update-marketplace-apps') This is for i18next to automatically create a locale file entry
    id: "update-marketplace-apps",
    schedule: "*/30 * * * *",
    runImmediately: true,
    handler: updateMarketplaceApps,
    stats: getDefaultStats("*/30 * * * *")
  },
  {
    // t('tasks.delete-expired-sessions') This is for i18next to automatically create a locale file entry
    id: "delete-expired-sessions",
    schedule: "0 0 1 * *",
    runImmediately: false,
    handler: deleteExpiredSessions,
    stats: getDefaultStats("0 0 1 * *")
  }
];
function getDefaultStats(schedule) {
  return writable({
    progress: 0,
    running: false,
    lastExecution: void 0,
    lastDuration: void 0,
    nextExecution: cron.sendAt(schedule).toJSDate()
  });
}
async function scheduleTasks() {
  for (const task of tasks) {
    logger.info(`Scheduling task "${task.id}" to run on schedule "${task.schedule}"`);
    const job = new CronJob(task.schedule, async () => await executeTask(task));
    job.start();
    if (task.runImmediately) {
      await executeTask(task);
    }
  }
}
async function executeTask(task) {
  const { id, schedule, handler, stats } = task;
  logger.info(`Starting task "${id}"`);
  stats.update((stats2) => ({ ...stats2, progress: 0, running: true }));
  const lastExecution = /* @__PURE__ */ new Date();
  try {
    await handler(throttle((p) => stats.update((s) => ({ ...s, progress: p }))));
  } catch (error) {
    logger.error(`Error running task "${id}":`, error);
  }
  const lastDuration = (/* @__PURE__ */ new Date()).getTime() - lastExecution.getTime();
  stats.update(() => ({
    progress: 1,
    running: false,
    lastExecution,
    lastDuration,
    nextExecution: cron.sendAt(schedule).toJSDate()
  }));
  logger.info(`Completed task "${id}" in ${lastDuration}ms`);
}
export {
  executeTask as e,
  scheduleTasks as s,
  tasks as t
};
