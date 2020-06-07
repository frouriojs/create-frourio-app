import { Task } from '~/apis/@types'

let tasks: Task[] = []
let lastId = 0

export const taskRepository = {
  getAll: () => tasks,
  genId: () => {
    lastId += 1
    return lastId
  },
  save: (task: Task) => {
    tasks.push(task)
  },
  update: (
    id: Task['id'],
    partialTask: Partial<Pick<Task, 'label' | 'done'>>
  ) => {
    tasks = tasks.map((task) =>
      task.id === id ? { ...task, ...partialTask } : task
    )
  },
  remove: (id: Task['id']) => {
    tasks = tasks.filter((task) => task.id !== id)
  }
}
