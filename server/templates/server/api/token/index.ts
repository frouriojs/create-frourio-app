import type { DefineMethods } from "aspida";
import type { LoginBody } from '$/validators'

export type Methods = DefineMethods<{
  post: {
    reqBody: LoginBody
    resBody: {
      token: string
    }
  }
}>
