import { ValidLoginBody, ValidTokenHeader } from '~/server/types'

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
