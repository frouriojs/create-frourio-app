import jwt from 'express-jwt'
import { defineHooks } from './$relay'
import { JWT_SECRET } from '$/service/envValues'

export type AdditionalRequest = {
  user: {
    id: string
  }
}

export default defineHooks(() => ({
  onRequest: jwt({ secret: JWT_SECRET, algorithms: ['HS256'] })
}))
