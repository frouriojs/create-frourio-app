import { expressjwt } from 'express-jwt'
import { defineHooks } from './$relay'
import { API_JWT_SECRET } from '$/service/envValues'

export type AdditionalRequest = {
  auth: {
    id: string
  }
}

export default defineHooks(() => ({
  onRequest: expressjwt({ secret: API_JWT_SECRET, algorithms: ['HS256'] })
}))
