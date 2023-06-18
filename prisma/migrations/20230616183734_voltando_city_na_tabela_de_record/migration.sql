/*
  Warnings:

  - Added the required column `city` to the `BroadcastersReocord` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BroadcastersReocord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "broadcasterName" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "codec" TEXT NOT NULL,
    "emails" TEXT NOT NULL
);
INSERT INTO "new_BroadcastersReocord" ("broadcasterName", "codec", "emails", "id", "state") SELECT "broadcasterName", "codec", "emails", "id", "state" FROM "BroadcastersReocord";
DROP TABLE "BroadcastersReocord";
ALTER TABLE "new_BroadcastersReocord" RENAME TO "BroadcastersReocord";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
