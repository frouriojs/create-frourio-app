import { defineController } from './$relay'
import { getAnswers, updateAnswers } from '$/service/answers'

export default defineController(() => ({
  get: () => ({ status: 200, body: getAnswers() }),
  patch: ({ body }) => {
    updateAnswers(body)
    return { status: 204 }
  }
}))
