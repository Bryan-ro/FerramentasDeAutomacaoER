/*
  Warnings:

  - You are about to drop the column `city` on the `BroadcastersReocord` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BroadcastersReocord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "broadcasterName" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "codec" TEXT NOT NULL,
    "emails" TEXT NOT NULL
);
INSERT INTO "new_BroadcastersReocord" ("broadcasterName", "codec", "emails", "id", "state") SELECT "broadcasterName", "codec", "emails", "id", "state" FROM "BroadcastersReocord";
DROP TABLE "BroadcastersReocord";
ALTER TABLE "new_BroadcastersReocord" RENAME TO "BroadcastersReocord";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
