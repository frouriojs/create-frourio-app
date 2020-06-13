import { Validator } from 'frourio'

export type Task = {
  id: number
  label: string
  done: boolean
}

export class ValidLoginBody {
  @Validator.MinLength(2)
  id: string

  @Validator.MinLength(4)
  pass: string
}

export class ValidTokenHeader {
  @Validator.IsString()
  @Validator.MinLength(10)
  token: string
}

export type UserInfo = {
  id: string
  name: string
  icon: string
}
