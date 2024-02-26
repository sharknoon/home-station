import { d as db } from "../../../../../chunks/db.js";
const load = async () => {
  const users = await db.query.users.findMany();
  return { users };
};
export {
  load
};
