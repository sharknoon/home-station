import { d as db } from "../../../../../chunks/db.js";
const load = async () => {
  const domainsAndHostnames = await db.query.hostnames.findMany();
  return { domainsAndHostnames };
};
export {
  load
};
