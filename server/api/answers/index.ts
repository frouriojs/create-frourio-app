import { DefineMethods } from 'aspida'
import { Answers } from 'common/prompts'

export type Methods = DefineMethods<{
  patch: {
    reqBody: Answers
    status: 204
  }
}>
