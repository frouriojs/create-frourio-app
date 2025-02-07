import type { Prisma, Task } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { depend } from 'velona';

const prisma = new PrismaClient();

export const getTasks = depend(
  {
    prisma: prisma as { task: { findMany(args?: Prisma.TaskFindManyArgs): Promise<Task[]> } },
  },
  async ({ prisma }, limit?: number) =>
    (await prisma.task.findMany({ orderBy: { id: 'asc' } })).slice(0, limit),
);

export const createTask = (label: Task['label']) => prisma.task.create({ data: { label } });

export const updateTask = (id: Task['id'], partialTask: Prisma.TaskUpdateInput) =>
  prisma.task.update({ where: { id }, data: partialTask });

export const deleteTask = (id: Task['id']) => prisma.task.delete({ where: { id } });
