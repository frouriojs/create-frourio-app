-- CreateTable
<% if (db === 'postgresql') { %>CREATE TABLE "Task" (
"id" SERIAL,
    "label" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);
<% } else if (db === 'sqlite') { %>CREATE TABLE "Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false
);
<% } %>