import { defineController } from './$relay'
import { getAnswers, updateAnswers } from '$/service/answers'
import { getStatus } from '$/service/status'
import stream from 'stream'

export default defineController(({ appendLogging }) => ({
  get: () => ({ status: 200, body: getAnswers() }),
  patch: ({ body }) => {
    if (getStatus() !== 'waiting') return { status: 204 }
    const s = new stream.Writable({
      write(chunk, _enc, cb) {
        appendLogging(chunk)
        process.stdout.write(chunk, (err) => cb(err))
      }
    })
    updateAnswers(body, s)
    return { status: 204 }
  }
}))
