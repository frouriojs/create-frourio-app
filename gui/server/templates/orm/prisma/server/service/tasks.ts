import { PrismaClient } from '@prisma/client'<% if (testing !== 'none') { %>
import { depend } from 'velona'<% } %>
import { Task } from '$/types'

const prisma = new PrismaClient()

export const getTasks = <% if (testing === 'none') { %>async (limit?: number) => (await prisma.task.findMany()).slice(0, limit)<% } else { %>depend(
  { prisma: prisma as { task: { findMany(): Promise<Task[]> } } },
  async ({ prisma }, limit?: number) =>
    (await prisma.task.findMany()).slice(0, limit)
)<% } %>

export const createTask = (label: Task['label']) =>
  prisma.task.create({ data: { label } })

export const updateTask = (
  id: Task['id'],
  partialTask: Partial<Pick<Task, 'label' | 'done'>>
) => prisma.task.update({ where: { id }, data: partialTask })

export const deleteTask = (id: Task['id']) =>
  prisma.task.delete({ where: { id } })
