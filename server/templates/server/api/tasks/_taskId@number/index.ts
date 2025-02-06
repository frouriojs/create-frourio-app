import type { Task } from 'common/types'
import { DefineMethods } from 'aspida'

export type Methods = DefineMethods<{
  patch: {
    reqBody: Partial<Pick<Task, 'label' | 'done'>>
    status: 204
  }
  delete: {
    status: 204
  }
}>
