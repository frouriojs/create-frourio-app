import fs from 'fs'
import { join, resolve } from 'path'
import { homedir } from 'os'
import spawn from 'cross-spawn'
import { Answers, initPrompts } from '$/common/prompts'
import { generate } from './generate'
import { fastify, ports } from '../'
import { getStatus, setStatus } from './status'
import { completed } from './completed'
import { getServerPort } from './getServerPort'

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

  db =
    tmp.ver > migration.length
      ? tmp
      : migration
          .slice(migration.findIndex((m) => m.ver === tmp.ver + 1))
          .reduce((prev, current) => current.handler(prev), tmp)
} catch (e) {
  db = { ver: 2, answers: {} }
}

const installApp = async (answers: Answers) => {
  setStatus('installing')
  const allAnswers = initPrompts(answers).reduce(
    (prev, current) => ({
      ...prev,
      [current.name]: answers[current.name] ?? current.default
    }),
    {} as Answers
  )
  const dir = allAnswers.dir ?? ''

  await generate(
    {
      ...allAnswers,
      clientPort: ports.client,
      serverPort: await getServerPort()
    },
    __dirname
  )

  await completed(allAnswers)
  await fastify.close()

  spawn(
    answers.pm ?? 'npm',
    ['run', process.env.NODE_ENV === 'test' ? 'build' : 'dev'],
    {
      cwd: resolve(dir),
      stdio: 'inherit'
    }
  )

  delete db.answers.dir
  await fs.promises.writeFile(dbPath, JSON.stringify(db), 'utf8')
}

export const getAnswers = () => ({ dir: process.argv[2], ...db.answers })

export const updateAnswers = async (answers: Answers) => {
  if (getStatus() !== 'waiting') return

  db = { ...db, answers }

  if (!fs.existsSync(dirPath)) await fs.promises.mkdir(dirPath)

  await fs.promises.writeFile(dbPath, JSON.stringify(db), 'utf8')

  await installApp(answers)
}
