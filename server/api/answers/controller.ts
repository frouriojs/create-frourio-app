import { defineController } from './$relay'
import { getAnswers, updateAnswers } from '$/service/answers'
import { getStatus } from '$/service/status'
import stream from 'stream'
import axios from 'axios'
import { getClientPort, getServerPort } from '$/service/getServerPort'
import open from 'open'

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
      const clientPort = await getClientPort()
      const serverPort = await getServerPort()
      for (let i = 0; i < 600; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        try {
          const client = axios.create({
            baseURL: `http://localhost:${serverPort}/api`
          })
          const res = await client.get('tasks')
          if (res.status === 200) {
            clientReady()
            const subprocess = await open(`http://localhost:${clientPort}`)
            subprocess.on('error', () => {
              console.log(`open http://localhost:${clientPort} in the browser`)
            })
            subprocess.on('close', () => {
              console.log(`open http://localhost:${clientPort} in the browser`)
            })
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
