import { Task } from '$/types'

export type Methods = {
  patch: {
    reqBody: Partial<Pick<Task, 'label' | 'done'>>
    status: 204
  }
  delete: {
    status: 204
  }
}
