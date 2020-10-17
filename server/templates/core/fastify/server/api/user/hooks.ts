import { defineHooks } from './$relay'
import { getUserIdByToken } from '$/service/user'

export type User = {
  id: string
}

export default defineHooks((fastify) => ({
  preHandler: fastify.auth([
    (req, _, done) => {
      const user =
        typeof req.headers.token === 'string' &&
        getUserIdByToken(req.headers.token)

      if (user) {
        // eslint-disable-next-line
        // @ts-expect-error
        req.user = user
        done()
      } else {
        done(new Error('Unauthorized'))
      }
    }
  ])
}))
