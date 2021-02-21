import { defineController } from './$relay'
import { getAnswers, updateAnswers } from '$/service/answers'
import { getStatus } from '$/service/status'
import stream from 'stream'
import axios from 'axios'
import { getServerPort } from '$/service/getServerPort'

export default defineController(({ appendLogging, clientReady }) => ({
  get: () => ({ status: 200, body: getAnswers() }),
  patch: ({ body }) => {
    if (getStatus() !== 'waiting') return { status: 204 }
    const s = new stream.Writable({
      write(chunk, _enc, cb) {
        appendLogging(chunk)
        process.stdout.write(chunk, (err) => cb(err))
      }
    })
    updateAnswers(body, s).then(async () => {
      const serverPort = await getServerPort()
      for (let i = 0; i < 100; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        try {
          const client = axios.create({
            baseURL: `http://localhost:${serverPort}/api`
          })
          const res = await client.get('tasks')
          if (res.status === 200) {
            clientReady()
            break
          }
        } catch (e: unknown) {
          // ignore
        }
      }
    })
    return { status: 204 }
  }
}))
