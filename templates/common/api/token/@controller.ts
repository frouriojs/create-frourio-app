import { createController } from 'frourio'
import { Values } from './$values'
import { Methods } from './'
import { validateUser, createToken, deleteToken } from '~/server/service/user'

export default createController<Methods, Values>({
  post: ({ body }) =>
    validateUser(body.id, body.pass)
      ? { status: 201, body: { token: createToken() } }
      : { status: 401 },

  delete: ({ headers }) => {
    deleteToken(headers.token)
    return { status: 204 }
  }
})
