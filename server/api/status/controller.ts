import { defineController } from './$relay'
import { getStatus } from '$/service/status'

export default defineController(() => ({
  get: () => ({ status: 200, body: { status: getStatus() } })
}))
