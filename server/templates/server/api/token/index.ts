import type { LoginBody } from '$/validators'

export type Methods = {
  post: {
    reqBody: LoginBody
    resBody: {
      token: string
    }
  }
}
