import path from "node:path";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import DatabaseConstructor from "better-sqlite3";
import { sqliteTable, text, integer, primaryKey, foreignKey } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { a as getAppDataPersistency, l as logger } from "./appdata.js";
import { b as building } from "./environment.js";
const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  language: text("language").notNull().default("en"),
  theme: text("theme", {
    enum: [
      "skeleton",
      "wintry",
      "modern",
      "rocket",
      "seafoam",
      "vintage",
      "sahara",
      "hamlindigo",
      "gold-nouveau",
      "crimson"
    ]
  }).notNull().default("skeleton")
});
const sessions = sqliteTable("user_sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at").notNull()
});
const containerEngines = sqliteTable("container_engines", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  type: text("type", { enum: ["local", "remote"] }).notNull(),
  socketPath: text("socket_path"),
  host: text("host"),
  ca: text("ca"),
  cert: text("cert"),
  key: text("key")
});
const marketplaces = sqliteTable("marketplaces", {
  id: text("id").primaryKey(),
  gitRemoteUrl: text("git_remote_url").notNull().unique(),
  gitUsername: text("git_username"),
  gitPassword: text("git_password")
});
const marketplaceApps = sqliteTable(
  "marketplace_apps",
  {
    appId: text("app_id").notNull(),
    marketplaceId: text("marketplace_id").notNull().references(() => marketplaces.id, { onDelete: "cascade" }),
    name: text("name", { mode: "json" }).notNull().$type(),
    description: text("description", { mode: "json" }).notNull().$type(),
    icon: text("icon").notNull(),
    banner: text("banner"),
    links: text("links", { mode: "json" }).notNull().$type(),
    publishedAt: text("published_at").notNull(),
    developer: text("developer").notNull(),
    category: text("category", { enum: ["File Transfer - Web-based File Managers"] }).notNull(),
    //TODO: Add more categories from awesome-selfhosted
    config: text("config", { mode: "json" }).$type(),
    http: text("http", { mode: "json" }).notNull().$type(),
    messages: text("messages", { mode: "json" }).$type()
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.appId, table.marketplaceId] })
    };
  }
);
const marketplaceAppsRelations = relations(marketplaceApps, ({ one }) => ({
  marketplace: one(marketplaces, {
    fields: [marketplaceApps.marketplaceId],
    references: [marketplaces.id]
  })
}));
const hostnames = sqliteTable("hostnames", {
  host: text("host").primaryKey()
});
const apps = sqliteTable(
  "apps",
  {
    appId: text("app_id").notNull(),
    marketplaceId: text("marketplace_id").notNull(),
    containerEngineId: integer("container_engine_id").notNull().references(() => containerEngines.id, { onDelete: "cascade" }),
    installedAt: integer("installed_at").notNull()
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.appId, table.marketplaceId] }),
      marketplaceAppReference: foreignKey({
        columns: [table.appId, table.marketplaceId],
        foreignColumns: [marketplaceApps.appId, marketplaceApps.marketplaceId],
        name: "marketplace_app_reference"
        // onDelete: 'cascade' // once it is supported by drizzle-orm
      })
    };
  }
);
const appsRelations = relations(apps, ({ one }) => ({
  marketplaceApp: one(marketplaceApps, {
    fields: [apps.appId, apps.marketplaceId],
    references: [marketplaceApps.appId, marketplaceApps.marketplaceId]
  })
}));
const schema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  apps,
  appsRelations,
  containerEngines,
  hostnames,
  marketplaceApps,
  marketplaceAppsRelations,
  marketplaces,
  sessions,
  users
}, Symbol.toStringTag, { value: "Module" }));
let sqlite;
let db;
const testing = process.env.NODE_ENV === "test";
try {
  const appDataPersitency = await getAppDataPersistency();
  if (appDataPersitency.isPersistent && !building && !testing) {
    const databasePath = path.join(appDataPersitency.currentAppDataPath, "db.sqlite");
    logger.info(`Connecting to the database "${databasePath}"`);
    sqlite = new DatabaseConstructor(databasePath);
  } else {
    sqlite = new DatabaseConstructor(":memory:");
    logger.info("Connecting to the database in memory");
    if (!building && !testing) {
      logger.warn("All data will be lost when the server stops!");
    }
  }
  db = drizzle(sqlite, { schema });
  logger.info("Successfully connected to the database");
  logger.info("Running migrations");
  migrate(db, { migrationsFolder: "drizzle" });
  logger.info("Migrations completed");
} catch (error) {
  logger.error("Failed to connect to the database: " + error);
  process.exit(1);
}
try {
  if (!await db.query.users.findFirst()) {
    logger.info("Seeding the database");
    if (!await db.query.marketplaces.findFirst()) {
      await db.insert(marketplaces).values({
        id: "github-com-home-station-org-apps",
        gitRemoteUrl: "https://github.com/home-station-org/apps.git",
        // TODO remove username and token once public
        gitUsername: "Sharknoon",
        gitPassword: "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"
      });
    }
    logger.info("Successfully seeded the database");
  }
} catch (error) {
  logger.error("Failed to seed the database: " + error);
}
const db$1 = db;
export {
  apps as a,
  marketplaces as b,
  containerEngines as c,
  db$1 as d,
  hostnames as h,
  marketplaceApps as m,
  sessions as s,
  users as u
};
