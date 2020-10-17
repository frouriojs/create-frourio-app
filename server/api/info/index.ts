import { Answers } from '$/common/prompts'

export type Methods = {
  get: {
    resBody: {
      answers: Answers
      editors: { name: string; value: string }[]
    }
  }

  patch: {
    reqBody: {
      answers: Answers
    }

    status: 204
  }
}
