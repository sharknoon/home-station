-- CreateTable
CREATE TABLE "ContainerEngine" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "socketPath" TEXT,
    "url" TEXT,
    "tlsCACert" TEXT,
    "tlsCert" TEXT,
    "tlsKey" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "ContainerEngine_name_key" ON "ContainerEngine"("name");
