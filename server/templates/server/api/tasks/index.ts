import type { Task } from 'common/types'
import { DefineMethods } from 'aspida'

export type Methods = DefineMethods<{
  get: {
    query?: {
      limit?: number
      message?: string
    }

    resBody: Task[]
  }
  post: {
    reqBody: Pick<Task, 'label'>
    resBody: Task
  }
}>
