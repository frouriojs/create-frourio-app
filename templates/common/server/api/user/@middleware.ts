import passport from 'passport'
import { createMiddleware } from './$relay'
import { getUserIdByToken } from '~/server/service/user'

export type User = {
  id: string
}

passport.use(
  // eslint-disable-next-line
  new (require('passport-trusted-header').Strategy)(
    { headers: ['token'] },
    // eslint-disable-next-line
    (headers: { token: string }, done: Function) => {
      done(null, getUserIdByToken(headers.token))
    }
  )
)

export default createMiddleware([
  passport.initialize(),
  passport.authenticate('trusted-header', { session: false })
])
