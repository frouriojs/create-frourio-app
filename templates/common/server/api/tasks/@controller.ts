import { createController } from 'frourio'
import { Values } from './$values'
import { Methods } from './'
import { findAllTask, createTask } from '~/server/service/tasks'

export default createController<Methods, Values>({
  get: async () => ({ status: 200, body: await findAllTask() }),
  post: async ({ body }) => ({
    status: 201,
    body: await createTask(body.label)
  })
})
