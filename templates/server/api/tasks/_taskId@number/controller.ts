import { defineController } from './$relay'
import { updateTask, removeTask } from '$/service/tasks'

export default defineController(() => ({
  patch: async ({ body, params }) => {
    await updateTask(params.taskId, body)
    return { status: 204 }
  },
  delete: async ({ params }) => {
    await removeTask(params.taskId)
    return { status: 204 }
  }
}))
