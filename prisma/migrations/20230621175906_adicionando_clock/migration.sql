/*
  Warnings:

  - Added the required column `clock` to the `recordHistory` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_recordHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "destinations" TEXT NOT NULL,
    "clock" TEXT NOT NULL,
    "user" TEXT NOT NULL
);
INSERT INTO "new_recordHistory" ("date", "destinations", "id", "user") SELECT "date", "destinations", "id", "user" FROM "recordHistory";
DROP TABLE "recordHistory";
ALTER TABLE "new_recordHistory" RENAME TO "recordHistory";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
