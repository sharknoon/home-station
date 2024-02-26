import fs from 'node:fs/promises';
import { pull, clone } from 'isomorphic-git';
import http from 'isomorphic-git/http/node/index.js';
import path from 'node:path';
import yaml from 'js-yaml';
import { d as db$1, b as marketplaces, m as marketplaceApps } from './db-cvVcOA05.js';
import { a as getAppDataPath, l as logger } from './appdata-osNviCV5.js';
import 'i18next';
import 'i18next-browser-languagedetector';
import 'cronstrue/locales/en.js';
import 'cronstrue/locales/de.js';
import { eq } from 'drizzle-orm';

async function exists(path2) {
  try {
    await fs.access(path2, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}
function throttle(callback, delay = 1e3) {
  let throttleTimeout = null;
  let storedArgs = null;
  const throttledCallback = (...args) => {
    storedArgs = args;
    const shouldExecuteCallback = !throttleTimeout;
    if (shouldExecuteCallback) {
      callback(...storedArgs);
      storedArgs = null;
      throttleTimeout = setTimeout(() => {
        throttleTimeout = null;
        if (storedArgs) {
          throttledCallback(...storedArgs);
        }
      }, delay);
    }
  };
  return throttledCallback;
}
const appDataPath = await getAppDataPath();
const marketplacesPath = path.join(appDataPath, "marketplaces");
await fs.mkdir(marketplacesPath, { recursive: true });
function getMarketplacePath(marketplace) {
  return path.join(marketplacesPath, marketplace.id);
}
function getMarketplaceAppPath(app) {
  return path.join(marketplacesPath, app.marketplaceId, "apps", app.appId);
}
async function deleteMarketplace(id) {
  const deletedMarketplace = await db$1.delete(marketplaces).where(eq(marketplaces.id, id)).returning();
  for (const marketplace of deletedMarketplace) {
    const marketplacePath = getMarketplacePath(marketplace);
    await fs.rm(marketplacePath, { recursive: true, force: true });
  }
}
async function updateMarketplaceApps(progress) {
  const marketplaces2 = await db$1.query.marketplaces.findMany();
  const apps = [];
  for (const marketplace of marketplaces2) {
    const appIds = await pullMarketplaceRepository(marketplace, progress);
    for (const appId of appIds) {
      try {
        const marketplacePath = getMarketplacePath(marketplace);
        const appYamlPath = path.join(marketplacePath, "apps", appId, "app.yml");
        const app = await loadAppFromFiles(appYamlPath);
        apps.push({
          appId: app.id,
          marketplaceId: marketplace.id,
          ...app
        });
      } catch (e) {
        logger.warn(e);
      }
    }
  }
  await db$1.delete(marketplaceApps);
  await db$1.insert(marketplaceApps).values(apps);
}
async function pullMarketplaceRepository(marketplace, progress) {
  const marketplacePath = getMarketplacePath(marketplace);
  const onAuth = () => ({
    username: marketplace.gitUsername ?? void 0,
    password: marketplace.gitPassword ?? void 0
  });
  const onProgress = (event) => {
    if (event.total) {
      progress(event.loaded / event.total);
    } else {
      progress(void 0);
    }
  };
  const author = { name: "Home Station" };
  const repoExists = await exists(path.join(marketplacePath, ".git"));
  if (repoExists) {
    logger.info(`Pulling "${marketplace.gitRemoteUrl}" to "${marketplacePath}"`);
    await pull({ fs, http, dir: marketplacePath, onAuth, onProgress, author });
  } else {
    logger.info(`Cloning "${marketplace.gitRemoteUrl}" to "${marketplacePath}"`);
    await clone({
      fs,
      http,
      dir: marketplacePath,
      url: marketplace.gitRemoteUrl,
      onAuth,
      onProgress
    });
  }
  try {
    const appsPath = path.join(marketplacePath, "apps");
    return await fs.readdir(appsPath);
  } catch {
    logger.warn(`No "apps" directory found in "${marketplacePath}"! Skipping...`);
    return [];
  }
}
async function loadAppFromFiles(appYamlPath) {
  if (!await exists(appYamlPath)) {
    throw new Error(`No app.yml found in "${appYamlPath}! Skipping..."`);
  }
  const appYaml = await fs.readFile(appYamlPath, "utf8");
  return yaml.load(appYaml);
}

export { deleteMarketplace as d, getMarketplaceAppPath as g, throttle as t, updateMarketplaceApps as u };
//# sourceMappingURL=marketplaces-Hf_qDRv9.js.map
