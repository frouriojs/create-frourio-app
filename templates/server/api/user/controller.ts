import { defineController } from './$relay'
import { getUserInfoById, changeIcon } from '$/service/user'

export default defineController(() => ({
  get: ({ user }) => ({ status: 200, body: getUserInfoById(user.id) }),
  post: async ({ user, body }) => ({
    status: 201,
    body: await changeIcon(user.id, body.icon)
  })
}))
