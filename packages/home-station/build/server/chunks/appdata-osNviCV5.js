import path from 'node:path';
import fs from 'node:fs/promises';
import os from 'node:os';
import winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;
const levels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
  },
  colors: {
    error: "bold red",
    warn: "bold yellow",
    info: "bold blue",
    debug: "bold gray"
  }
};
const format = printf(({ level, message, timestamp: timestamp2 }) => {
  return `${timestamp2} [${level}] ${message}`;
});
const logger = winston.createLogger({
  format: combine(
    winston.format((info) => {
      info.level = info.level.toUpperCase();
      return info;
    })(),
    colorize({ level: true, colors: levels.colors }),
    timestamp(),
    format
  ),
  levels: levels.levels,
  transports: [new winston.transports.Console()]
});
const testing = process.env.NODE_ENV === "test";
let appDataPath;
{
  if (!testing) {
    appDataPath = path.join(os.homedir(), ".home-station");
  } else {
    appDataPath = path.join(os.tmpdir(), ".home-station");
  }
  await fs.mkdir(appDataPath, { recursive: true });
  logger.info(`Running on "${process.platform}", using "${appDataPath}" as data directory`);
}
async function getAppDataPersistency() {
  {
    return {
      isPersistent: true,
      defaultAppDataPath: appDataPath,
      currentAppDataPath: appDataPath
    };
  }
}
async function getAppDataPath() {
  return appDataPath;
}

export { getAppDataPath as a, getAppDataPersistency as g, logger as l };
//# sourceMappingURL=appdata-osNviCV5.js.map
