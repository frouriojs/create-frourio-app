import { STATUS } from '$/common/types'

export type ServerStatus = {
  status: STATUS
  serverPort: number
  clientPort: number
}

export type Methods = {
  get: {
    resBody: ServerStatus
  }
}
