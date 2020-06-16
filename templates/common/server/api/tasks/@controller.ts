import { createController } from './$relay'
import { findAllTask, createTask } from '~/server/service/tasks'

export default createController({
  get: async () => ({ status: 200, body: await findAllTask() }),
  post: async ({ body }) => ({
    status: 201,
    body: await createTask(body.label)
  })
})
