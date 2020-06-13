import { createController } from 'frourio'
import { Values } from './$values'
import { Methods } from './'
import { updateTask, removeTask } from '~/server/service/tasks'

export default createController<Methods, Values>({
  patch: async ({ body, params }) => {
    await updateTask(params.taskId, body)
    return { status: 204 }
  },
  delete: async ({ params }) => {
    await removeTask(params.taskId)
    return { status: 204 }
  }
})
