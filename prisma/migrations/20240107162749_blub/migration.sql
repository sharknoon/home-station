/*
  Warnings:

  - You are about to drop the column `tlsCACert` on the `ContainerEngine` table. All the data in the column will be lost.
  - You are about to drop the column `tlsCert` on the `ContainerEngine` table. All the data in the column will be lost.
  - You are about to drop the column `tlsKey` on the `ContainerEngine` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ContainerEngine" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "socketPath" TEXT,
    "url" TEXT,
    "ca" TEXT,
    "cert" TEXT,
    "key" TEXT
);
INSERT INTO "new_ContainerEngine" ("id", "name", "socketPath", "type", "url") SELECT "id", "name", "socketPath", "type", "url" FROM "ContainerEngine";
DROP TABLE "ContainerEngine";
ALTER TABLE "new_ContainerEngine" RENAME TO "ContainerEngine";
CREATE UNIQUE INDEX "ContainerEngine_name_key" ON "ContainerEngine"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
