import { Task } from '$/types'

export type Methods = {
  get: {
    resBody: Task[]
  }
  post: {
    reqBody: Pick<Task, 'label'>
    resBody: Task
  }
}
