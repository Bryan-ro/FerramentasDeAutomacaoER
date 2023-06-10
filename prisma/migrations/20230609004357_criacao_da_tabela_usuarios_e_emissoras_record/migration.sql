-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "BroadcastersReocord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "broadcasterName" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "codec" TEXT NOT NULL,
    "emails" TEXT NOT NULL
);
