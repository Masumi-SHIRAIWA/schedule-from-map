-- CreateTable
CREATE TABLE "Projects" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "latestTodo" TEXT NOT NULL,
    "iconName" TEXT NOT NULL DEFAULT 'default'
);
