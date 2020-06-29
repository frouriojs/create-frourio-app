import { ValidLoginBody, ValidTokenHeader } from '$/types'

export type Methods = {
  post: {
    reqBody: ValidLoginBody
    resBody: {
      token: string
    }
  }

  delete: {
    reqHeaders: ValidTokenHeader
  }
}
