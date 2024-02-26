import Docker from "dockerode";
async function getEngine(engine) {
  switch (engine?.type ?? "local") {
    case "local":
      if (!engine.socketPath)
        return new Docker();
      return new Docker({ socketPath: engine.socketPath });
    case "remote":
      return new Docker({
        host: engine.host ?? "",
        // Is required for type remote
        ca: engine.ca ?? void 0,
        cert: engine.cert ?? void 0,
        key: engine.key ?? void 0
      });
  }
}
async function testLocalConnection(socketPath) {
  try {
    const docker = socketPath ? new Docker({ socketPath }) : new Docker();
    const result = await docker.ping();
    const ping = result.toString("utf-8");
    if (ping !== "OK") {
      return Promise.reject("Docker ping did not return OK: " + ping);
    }
    return docker;
  } catch (err) {
    if (err instanceof AggregateError) {
      const errors = err.errors.map((e) => String(e)).join(", ");
      return Promise.reject("Couldn't connect to Docker: " + errors);
    }
    if (err instanceof Error) {
      return Promise.reject("Couldn't connect to Docker: " + err.message);
    }
    return Promise.reject("Couldn't connect to Docker: " + err);
  }
}
async function testRemoteConnection(url, ca, cert, key) {
  try {
    const docker = new Docker({ host: url, ca, cert, key });
    const result = await docker.ping();
    const ping = result.toString("utf-8");
    if (ping !== "OK") {
      return Promise.reject("Docker ping did not return OK: " + ping);
    }
    return docker;
  } catch (err) {
    if (err instanceof AggregateError) {
      const errors = err.errors.map((e) => String(e)).join(", ");
      return Promise.reject("Couldn't connect to Docker: " + errors);
    }
    if (err instanceof Error) {
      return Promise.reject("Couldn't connect to Docker: " + err.message);
    }
    return Promise.reject("Couldn't connect to Docker: " + err);
  }
}
export {
  testLocalConnection as a,
  getEngine as g,
  testRemoteConnection as t
};
