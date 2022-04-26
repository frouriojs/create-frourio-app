import type { DefineMethods } from 'aspida'
import { Answers } from '$/common/prompts'

export type Methods = DefineMethods<{
  get: {
    resBody: Answers
  }

  patch: {
    reqBody: Answers
    status: 204
  }
}>
