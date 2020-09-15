import { defineController } from './$relay'
import { findAllTask, createTask } from '$/service/tasks'

export default defineController(() => ({
  get: async () => ({ status: 200, body: await findAllTask() }),
  post: async ({ body }) => ({
    status: 201,
    body: await createTask(body.label)
  })
}))
