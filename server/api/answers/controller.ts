import { defineController } from './$relay'
import { getAnswers, updateAnswers } from '$/service/answers'

export default defineController(() => ({
  get: () => ({ status: 200, body: getAnswers() }),
  patch: async ({ body }) => {
    await updateAnswers(body)
    return { status: 204 }
  }
}))
