import { defineHooks } from './$relay'

export type AdditionalRequest = {
  user: {
    id: string
  }
}

export default defineHooks(() => ({
  onRequest: (request, reply) =>
    request.jwtVerify().catch((err) => reply.send(err))
}))
