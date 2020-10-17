import { defineController } from './$relay'
import { getAnswers, updateAnswers } from '$/service/answers'
import { editors } from '$/service/editors'

export default defineController(() => ({
  get: () => ({ status: 200, body: { answers: getAnswers(), editors } }),
  patch: async ({ body }) => {
    await updateAnswers(body.answers)
    return { status: 204 }
  }
}))
