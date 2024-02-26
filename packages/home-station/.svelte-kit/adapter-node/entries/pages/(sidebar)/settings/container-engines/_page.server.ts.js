import { d as db } from "../../../../../chunks/db.js";
import { t as testRemoteConnection, a as testLocalConnection } from "../../../../../chunks/containerengines.js";
const load = async () => {
  const containerEngines = await db.query.containerEngines.findMany();
  for (const engine of containerEngines) {
    try {
      let docker;
      if (engine.host) {
        docker = await testRemoteConnection(
          engine.host,
          engine.ca ?? void 0,
          engine.cert ?? void 0,
          engine.key ?? void 0
        );
      } else {
        docker = await testLocalConnection(engine.socketPath ?? void 0);
      }
      const info = await docker.info();
      const volumes = await docker.listVolumes();
      const stacks = (await docker.listContainers({ all: true })).filter((container) => container.Labels?.["com.docker.compose.project"]).map((container) => container.Labels?.["com.docker.compose.project"]).filter((value, index, self) => self.indexOf(value) === index);
      engine.up = true;
      engine.numberOfCPUs = info?.NCPU ?? 0;
      engine.totalMemory = info?.MemTotal ?? 0;
      engine.numberOfStacks = stacks?.length ?? 0;
      engine.numberOfContainers = info?.Containers ?? 0;
      engine.numberOfImages = info?.Images ?? 0;
      engine.numberOfVolumes = volumes?.Volumes?.length ?? 0;
    } catch {
      engine.up = false;
    }
  }
  return { containerEngines };
};
export {
  load
};
