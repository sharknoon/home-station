import { d as db, m as marketplaceApps, c as containerEngines, a as apps } from "../../../../chunks/db.js";
import { f as fail } from "../../../../chunks/index.js";
import { d as deleteMarketplace, g as getMarketplaceAppPath } from "../../../../chunks/marketplaces.js";
import { and, eq } from "drizzle-orm";
import DockerodeCompose from "dockerode-compose";
import { g as getEngine } from "../../../../chunks/containerengines.js";
import { join } from "node:path";
const load = async () => {
  const marketplaceApps2 = await db.query.marketplaceApps.findMany({
    with: { marketplace: { columns: { id: true, gitRemoteUrl: true } } }
  });
  const marketplaces = await db.query.marketplaces.findMany({
    columns: { gitPassword: false }
  });
  const containerEngines2 = await db.query.containerEngines.findMany({
    columns: { id: true, name: true, type: true }
  });
  return { marketplaceApps: marketplaceApps2, marketplaces, containerEngines: containerEngines2 };
};
const actions = {
  deleteRepository: async ({ request }) => {
    const data = await request.formData();
    const id = data.get("id")?.toString();
    if (!id) {
      return fail(400, { id, invalid: true });
    }
    await deleteMarketplace(id);
  },
  installApp: async ({ request }) => {
    const data = await request.formData();
    const appId = data.get("appId")?.toString() ?? "";
    const marketplaceId = data.get("marketplaceId")?.toString() ?? "";
    const containerEngineId = parseInt(data.get("containerEngineId")?.toString() ?? "");
    if (!appId) {
      return fail(400, { appId, invalid: true });
    }
    if (!marketplaceId) {
      return fail(400, { marketplaceId, invalid: true });
    }
    if (!containerEngineId) {
      return fail(400, { containerEngineId, invalid: true });
    }
    const marketplaceApp = await db.query.marketplaceApps.findFirst({
      where: and(
        eq(marketplaceApps.appId, appId),
        eq(marketplaceApps.marketplaceId, marketplaceId)
      )
    });
    if (!marketplaceApp) {
      return fail(400, { appId, notFound: true });
    }
    const containerEngine = await db.query.containerEngines.findFirst({
      where: eq(containerEngines.id, containerEngineId)
    });
    if (!containerEngine) {
      return fail(400, { containerEngineId, notFound: true });
    }
    await db.insert(apps).values({
      appId: marketplaceApp.appId,
      marketplaceId: marketplaceApp.marketplaceId,
      containerEngineId: containerEngine.id,
      installedAt: Date.now()
    }).onConflictDoNothing();
    const dockerode = await getEngine(containerEngine);
    new DockerodeCompose(
      dockerode,
      join(getMarketplaceAppPath(marketplaceApp), "compose.yml"),
      `${marketplaceApp.marketplaceId}_${marketplaceApp.appId}`
    );
    console.debug(appId, marketplaceId, containerEngineId);
  }
};
export {
  actions,
  load
};
