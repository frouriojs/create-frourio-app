import fs from 'fs'
import { join, resolve } from 'path'
import { homedir } from 'os'
import spawn from 'cross-spawn'
import { getPortPromise } from 'portfinder'
import { Answers, initPrompts } from '$/common/prompts'
import { fastify, ports } from '../'
import { getStatus, setStatus } from './status'

// eslint-disable-next-line
const sao = require('sao')
const dirPath = join(homedir(), '.frourio')
const dbPath = join(dirPath, 'create-frourio-app.json')

let db: {
  ver: number
  answers: Answers
} = fs.existsSync(dbPath)
  ? JSON.parse(fs.readFileSync(dbPath, 'utf8'))
  : { ver: 1, answers: {} }

export const install = async (answers: Answers) => {
  setStatus('installing')
  const allAnswers = initPrompts(answers).reduce(
    (prev, current) => ({
      ...prev,
      [current.name]: answers[current.name] ?? current.default
    }),
    {} as Answers
  )

  await sao({
    generator: resolve(__dirname, './generator'),
    logLevel: 2,
    outDir: allAnswers.dir,
    answers: {
      ...allAnswers,
      name: allAnswers.dir,
      frontPort: ports.front,
      serverPort: await getPortPromise({ port: 8080 })
    }
  })
    .run()
    .catch((e: Error) => console.trace(e))

  await fastify.close()

  spawn(answers.pm ?? 'npm', ['run', 'dev'], {
    cwd: resolve(answers.dir ?? ''),
    stdio: 'inherit'
  })

  delete db.answers.dir
  await fs.promises.writeFile(dbPath, JSON.stringify(db), 'utf8')
}

export const getAnswers = () => ({ dir: process.argv[2], ...db.answers })

export const updateAnswers = async (answers: Answers) => {
  if (getStatus() !== 'waiting') return

  db = { ...db, answers }

  if (!fs.existsSync(dirPath)) await fs.promises.mkdir(dirPath)

  await fs.promises.writeFile(dbPath, JSON.stringify(db), 'utf8')

  install(answers)
}
