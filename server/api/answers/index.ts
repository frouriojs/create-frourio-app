import { Answers } from '$/common/prompts'

export type Methods = {
  get: {
    resBody: Answers
  }

  patch: {
    reqBody: Answers
    status: 204
  }
}
