import { Answers } from '$/common/prompts'

export type Methods = {
  post: {
    reqBody: Answers
    resBody: { enabled: true } | { enabled: false; err: string }
  }
}
