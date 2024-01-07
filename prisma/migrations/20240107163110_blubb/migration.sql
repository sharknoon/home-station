/*
  Warnings:

  - You are about to drop the column `url` on the `ContainerEngine` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ContainerEngine" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "socketPath" TEXT,
    "host" TEXT,
    "ca" TEXT,
    "cert" TEXT,
    "key" TEXT
);
INSERT INTO "new_ContainerEngine" ("ca", "cert", "id", "key", "name", "socketPath", "type") SELECT "ca", "cert", "id", "key", "name", "socketPath", "type" FROM "ContainerEngine";
DROP TABLE "ContainerEngine";
ALTER TABLE "new_ContainerEngine" RENAME TO "ContainerEngine";
CREATE UNIQUE INDEX "ContainerEngine_name_key" ON "ContainerEngine"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
