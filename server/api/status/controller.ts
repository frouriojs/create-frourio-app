import { defineController } from './$relay'
import { getStatus } from '$/service/status'
import { getClientPort, getServerPort } from '$/service/getServerPort'

export default defineController(() => ({
  get: async () => ({
    status: 200,
    body: {
      status: getStatus(),
      serverPort: await getServerPort(),
      clientPort: await getClientPort()
    }
  })
}))
