import { DefineMethods } from 'aspida'

export type LocalPathInfo = {
  canContinue: null | string
  absPath: string
}

export type Methods = DefineMethods<{
  post: {
    reqBody: {
      path: string
    }
    resBody: LocalPathInfo
  }
}>
