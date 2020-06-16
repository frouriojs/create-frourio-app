import { MinLength, IsString } from 'class-validator'

export type Task = {
  id: number
  label: string
  done: boolean
}

export class ValidLoginBody {
  @MinLength(2)
  id: string

  @MinLength(4)
  pass: string
}

export class ValidTokenHeader {
  @IsString()
  @MinLength(10)
  token: string
}

export type UserInfo = {
  id: string
  name: string
  icon: string
}
