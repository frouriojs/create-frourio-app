export type Task = {
  id: number
  label: string
  done: boolean
}

export type UserInfo = {
  id: string
  name: string
  icon: string
}

export type AuthHeader = {
  authorization: string
}
