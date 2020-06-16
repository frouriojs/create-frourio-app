import { createController } from './$relay'
import { getUserInfoById, changeIcon } from '~/server/service/user'

export default createController({
  get: ({ user }) => ({ status: 200, body: getUserInfoById(user.id) }),
  post: async ({ user, body }) => ({
    status: 201,
    body: await changeIcon(user.id, body.icon)
  })
})
