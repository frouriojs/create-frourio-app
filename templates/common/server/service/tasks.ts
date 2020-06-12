import { getRepository } from 'typeorm'
import { Task } from '~/server/entity/Task'

const taskRepository = () => getRepository(Task)

export const findAllTask = () => taskRepository().find()

export const createTask = (label: Task['label']) => {
  const task = new Task()
  task.label = label
  return taskRepository().save(task)
}

export const updateTask = async (
  id: Task['id'],
  partialTask: Partial<Pick<Task, 'label' | 'done'>>
) => {
  const task = await taskRepository().findOne({ id })
  if (!task) return

  task.label = partialTask.label ?? task.label
  task.done = partialTask.done ?? task.done
  await taskRepository().save(task)
}

export const removeTask = async (id: Task['id']) => {
  const task = await taskRepository().findOne({ id })
  if (task) await taskRepository().remove(task)
}
