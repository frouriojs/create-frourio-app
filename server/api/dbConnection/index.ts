import { Answers } from '$/common/prompts'
import type { DefineMethods } from 'aspida'

export type Methods = DefineMethods<{
  post: {
    reqBody: Answers
    resBody: { enabled: true } | { enabled: false; err: string }
  }
}>
