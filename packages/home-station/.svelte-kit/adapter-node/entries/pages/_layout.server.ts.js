import { a as getAppDataPersistency } from "../../chunks/appdata.js";
const appDataPersistency = await getAppDataPersistency();
const load = async ({ locals, request }) => {
  const user = locals.user;
  const url = request.url;
  return { user, url, appDataPersistency };
};
export {
  load
};
