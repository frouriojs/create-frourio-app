-- CreateTable
<% if (prismaDB === 'mysql') { %>CREATE TABLE `Task` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(191) NOT NULL,
    `done` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
<% } else if (prismaDB === 'postgresql') { %>CREATE TABLE "Task" (
"id" SERIAL,
    "label" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);
<% } else if (prismaDB === 'sqlite') { %>CREATE TABLE "Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false
);
<% } %>