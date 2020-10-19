import { MinLength, IsString } from 'class-validator'

export class LoginBody {
  @MinLength(2)
  id: string

  @MinLength(4)
  pass: string
}

export class TokenHeader {
  @IsString()
  @MinLength(10)
  token: string
}
