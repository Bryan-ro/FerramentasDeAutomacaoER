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

-- CreateTable
CREATE TABLE "recordHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "destinations" TEXT NOT NULL,
    "clock" TEXT NOT NULL,
    "user" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
