import { ValidTokenHeader, UserInfo } from '~/server/types'

export type Methods = {
  get: {
    reqHeaders: ValidTokenHeader
    resBody: UserInfo
  }

  post: {
    reqHeaders: ValidTokenHeader
    reqFormat: FormData
    reqBody: { icon: Blob }
    resBody: UserInfo
  }
}
