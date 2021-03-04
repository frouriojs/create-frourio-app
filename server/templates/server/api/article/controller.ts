import { getArticles } from '$/service/article'
import { defineController } from './$relay'

export default defineController(() => ({
  get: ({ query }) => ({ status: 200, body: getArticles(query?.search) })
}))
