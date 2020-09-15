import { TokenHeader } from '$/validators'
import { UserInfo } from '$/types'

export type Methods = {
  get: {
    reqHeaders: TokenHeader
    resBody: UserInfo
  }

  post: {
    reqHeaders: TokenHeader
    reqFormat: FormData
    reqBody: { icon: Blob }
    resBody: UserInfo
  }
}
