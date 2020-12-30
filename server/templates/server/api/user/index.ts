import type { AuthHeader, UserInfo } from '$/types'

export type Methods = {
  get: {
    reqHeaders: AuthHeader
    resBody: UserInfo
  }

  post: {
    reqHeaders: AuthHeader
    reqFormat: FormData
    reqBody: { icon: Blob }
    resBody: UserInfo
  }
}
