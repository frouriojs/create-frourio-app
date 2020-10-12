import { defineController } from './$relay'
import { validateUser, createToken, deleteToken } from '$/service/user'

export default defineController(() => ({
  post: ({ body }) =>
    validateUser(body.id, body.pass)
      ? { status: 201, body: { token: createToken() } }
      : { status: 401 },

  delete: ({ headers }) => {
    deleteToken(headers.token)
    return { status: 204 }
  }
}))
