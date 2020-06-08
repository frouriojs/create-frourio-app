import { createController } from 'frourio'
import { Values } from './$values'
import { Methods } from './'
import { taskRepository } from '~/apis/@repos/tasks'

export default createController<Methods, Values>({
  patch: ({ body, params }) => {
    taskRepository.update(params.taskId, body)
    return { status: 204 }
  },
  delete: ({ params }) => {
    taskRepository.remove(params.taskId)
    return { status: 204 }
  }
})
