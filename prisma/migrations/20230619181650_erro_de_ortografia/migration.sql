/*
  Warnings:

  - You are about to drop the column `destinatios` on the `recordHistory` table. All the data in the column will be lost.
  - Added the required column `destinations` to the `recordHistory` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_recordHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "destinations" TEXT NOT NULL,
    "user" TEXT NOT NULL
);
INSERT INTO "new_recordHistory" ("date", "id", "user") SELECT "date", "id", "user" FROM "recordHistory";
DROP TABLE "recordHistory";
ALTER TABLE "new_recordHistory" RENAME TO "recordHistory";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
