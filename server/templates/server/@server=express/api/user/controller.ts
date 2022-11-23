import { defineController } from './$relay'
import { getUserInfoById, changeIcon } from '$/service/user'

export default defineController(() => ({
  get: ({ auth }) => ({ status: 200, body: getUserInfoById(auth.id) }),
  post: async ({ auth, body }) => ({
    status: 201,
    body: await changeIcon(auth.id, body.icon)
  })
}))
