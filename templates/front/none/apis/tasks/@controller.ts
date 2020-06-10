import { createController } from 'frourio'
import { Methods } from './'
import { taskRepository } from '~/apis/@repos/tasks'

export default createController<Methods>({
  get: () => ({ status: 200, body: taskRepository.getAll() }),
  post: ({ body }) => {
    const task = {
      id: taskRepository.genId(),
      label: body.label,
      done: false
    }

    taskRepository.save(task)
    return { status: 201, body: task }
  }
})
