import jwt from 'jsonwebtoken'
import { defineController } from './$relay'
import { validateUser } from '$/service/user'
import { API_JWT_SECRET } from '$/service/envValues'
import { z } from 'zod'

export default defineController(() => ({
  post: {
    validators: {
      body: z.object({ id: z.string().min(2), pass: z.string().min(4) })
    },
    handler: ({ body }) =>
      validateUser(body.id, body.pass)
        ? {
            status: 201,
            body: { token: jwt.sign({ id: body.id }, API_JWT_SECRET) }
          }
        : { status: 401 }
  }
}))
