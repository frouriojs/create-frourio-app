import type { AuthHeader, UserInfo } from '$/types'
import type { ReadStream } from 'fs'

export type Methods = {
  get: {
    reqHeaders: AuthHeader
    resBody: UserInfo
  }

  post: {
    reqHeaders: AuthHeader
    reqFormat: FormData
    reqBody: { icon: File | ReadStream }
    resBody: UserInfo
  }
}
