import { defineController } from './$relay'
import { getStatus } from '$/service/status'
import { getServerPort } from '$/service/getServerPort'

export default defineController(() => ({
  get: async () => ({
    status: 200,
    body: { status: getStatus(), serverPort: await getServerPort() }
  })
}))
