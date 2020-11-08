import fs from 'fs'
import { join, resolve } from 'path'
import { homedir } from 'os'
import { depend } from 'velona'
import spawn from 'cross-spawn'
import { getPortPromise } from 'portfinder'
import { Answers, initPrompts } from '$/common/prompts'
import { fastify, ports } from '../'
import { getStatus, setStatus } from './status'

// eslint-disable-next-line
const sao = require('sao')
const dirPath = join(homedir(), '.frourio')
const dbPath = join(dirPath, 'create-frourio-app.json')

type Schemas = [
  { ver: 1; answers: Omit<Answers, 'client'> & { front?: string } },
  { ver: 2; answers: Answers }
]

let db: Schemas[1]

const migration = [
  {
    ver: 2,
    handler: ({ answers: { front, ...others } }: Schemas[0]): Schemas[1] => ({
      ver: 2,
      answers: { ...others, client: front }
    })
  }
]

export const cliMigration = [
  {
    when: (answers: Schemas[number]['answers']) => 'front' in answers,
    warn: 'Use "client" instead of "front".',
    handler: ({
      front,
      ...others
    }: Schemas[0]['answers']): Schemas[1]['answers'] => ({
      ...others,
      client: front
    })
  }
]

try {
  const tmp = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
  if (tmp.ver <= migration.length) {
    db = migration
      .slice(migration.findIndex((m) => m.ver === tmp.ver + 1))
      .reduce((prev, current) => current.handler(prev), tmp)
  }
} catch (e) {
  db = { ver: 2, answers: {} }
}

export const installApp = depend(
  { sao, spawn, fs },
  async ({ sao, spawn, fs }, answers: Answers) => {
    setStatus('installing')
    const allAnswers = initPrompts(answers).reduce(
      (prev, current) => ({
        ...prev,
        [current.name]: answers[current.name] ?? current.default
      }),
      {} as Answers
    )
    const dir = allAnswers.dir ?? ''

    await sao({
      generator: resolve(__dirname, './generator'),
      logLevel: 2,
      outDir: dir,
      answers: {
        ...allAnswers,
        name: dir,
        clientPort: ports.client,
        serverPort: await getPortPromise({ port: 8080 })
      }
    })
      .run()
      .catch((e: Error) => console.trace(e))

    await fastify.close()

    spawn(answers.pm ?? 'npm', ['run', 'dev'], {
      cwd: resolve(dir),
      stdio: 'inherit'
    })

    delete db.answers.dir
    await fs.promises.writeFile(dbPath, JSON.stringify(db), 'utf8')
  }
)

export const getAnswers = () => ({ dir: process.argv[2], ...db.answers })

export const updateAnswers = async (answers: Answers) => {
  if (getStatus() !== 'waiting') return

  db = { ...db, answers }

  if (!fs.existsSync(dirPath)) await fs.promises.mkdir(dirPath)

  await fs.promises.writeFile(dbPath, JSON.stringify(db), 'utf8')

  await installApp(answers)
}
