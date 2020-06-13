import { createMiddleware } from 'frourio'
import passport from 'passport'
import { getUserIdByToken } from '~/server/service/user'

export type User = {
  id: string
}

passport.use(
  new (require('passport-trusted-header').Strategy)(
    { headers: ['token'] },
    (headers: { token: string }, done: Function) => {
      done(null, getUserIdByToken(headers.token))
    }
  )
)

export default createMiddleware([
  passport.initialize(),
  passport.authenticate('trusted-header', { session: false })
])
