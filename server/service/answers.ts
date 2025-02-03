import fs from 'fs'
import path from 'path'
import { homedir } from 'os'
import { spawn } from 'child_process'
import { Answers, cfaPrompts, omitDefaults } from 'common/prompts'
import { generate } from './generate'
import { setStatus } from './status'
import { completed } from './completed'
import { getClientPort, getServerPort } from './getServerPort'
import stream from 'stream'
import { canContinueOnPath, getPathStatus } from './localPath'

const dirPath = path.join(homedir(), '.frourio')
const dbPath = path.join(dirPath, 'create-frourio-app.json')

type AnswersVer6 = Answers
type AnswersVer5 = AnswersVer6 & {
  building?: string
  ci?: string
  daemon?: string
  db?: string
  deployBranch?: string
  deployServer?: string
  mysqlDbHost?: string
  mysqlDbPort?: string
  mysqlDbUser?: string
  mysqlDbPass?: string
  mysqlDbName?: string
  orm?: string
  pm?: string
  postgresqlDbHost?: string
  postgresqlDbPort?: string
  postgresqlDbUser?: string
  postgresqlDbPass?: string
  postgresqlDbName?: string
  serverless?: string
  skipDbChecks?: string
  staticHosting?: string
  serverSourcePath?: string
  sqliteDbFile?: string
  testing?: string
}
type AnswersVer4 = AnswersVer5 & { client?: string; mode?: string; target?: string }
type AnswersVer3 = AnswersVer4
type AnswersVer2 = Omit<
  AnswersVer3,
  | 'deployBranch'
  | 'deployServer'
  | 'mysqlDbHost'
  | 'mysqlDbPort'
  | 'mysqlDbUser'
  | 'mysqlDbPass'
  | 'mysqlDbName'
  | 'postgresqlDbHost'
  | 'postgresqlDbPort'
  | 'postgresqlDbUser'
  | 'postgresqlDbPass'
  | 'postgresqlDbName'
  | 'serverless'
  | 'staticHosting'
  | 'serverSourcePath'
  | 'sqliteDbFile'
> &
  Partial<Record<'dbHost' | 'dbUser' | 'dbPass' | 'dbUser' | 'dbPort' | 'dbFile', string>>
type AnswersVer1 = Omit<AnswersVer2, 'client'> & { front?: string }
type Schemas = [
  { ver: 1; answers: AnswersVer1 },
  { ver: 2; answers: AnswersVer2 },
  { ver: 3; answers: AnswersVer3 },
  { ver: 4; answers: AnswersVer4 },
  { ver: 5; answers: AnswersVer5 },
  { ver: 6; answers: AnswersVer6 }
]

let db: Schemas[2]

const migration = [
  {
    ver: 2,
    handler: ({ answers: { front, ...others } }: Schemas[0]): Schemas[1] => ({
      ver: 2,
      answers: { ...others, client: front }
    })
  },
  {
    ver: 3,
    handler: ({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      answers: { dbHost, dbUser, dbPass, dbPort, dbFile, ...others }
    }: Schemas[1]): Schemas[2] => ({
      ver: 3,
      answers: { ...others, sqliteDbFile: dbFile }
    })
  },
  {
    ver: 4,
    handler: ({ answers: { client, ...others } }: Schemas[2]): Schemas[3] => ({
      ver: 4,
      answers: { ...others, client: client === 'sapper' ? undefined : client }
    })
  },
  {
    ver: 5,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handler: ({ answers: { client, mode, target, ...others } }: Schemas[3]): Schemas[4] => ({
      ver: 5,
      answers: others
    })
  },
  {
    ver: 6,
    handler: ({
      /* eslint-disable @typescript-eslint/no-unused-vars */
      answers: {
        building,
        ci,
        daemon,
        db,
        deployBranch,
        deployServer,
        mysqlDbHost,
        mysqlDbPort,
        mysqlDbUser,
        mysqlDbPass,
        mysqlDbName,
        orm,
        pm,
        postgresqlDbHost,
        postgresqlDbPort,
        postgresqlDbUser,
        postgresqlDbPass,
        postgresqlDbName,
        serverless,
        staticHosting,
        serverSourcePath,
        skipDbChecks,
        sqliteDbFile,
        testing,
        ...others
      } /* eslint-enable @typescript-eslint/no-unused-vars */
    }: Schemas[4]): Schemas[5] => ({ ver: 6, answers: others })
  }
]

export const cliMigration: {
  when: (answers: Schemas[number]['answers']) => boolean
  warn: (answers: Schemas[number]['answers']) => string
  handler: (answers: Schemas[number]['answers']) => Schemas[number]['answers']
}[] = []

try {
  const tmp = JSON.parse(fs.readFileSync(dbPath, 'utf8'))

  db =
    tmp.ver > migration.length
      ? tmp
      : migration
          .slice(migration.findIndex((m) => m.ver === tmp.ver + 1))
          .reduce((prev, current) => current.handler(prev), tmp)
} catch (e: unknown) {
  db = { ver: 3, answers: {} }
}

export const genAllAnswers = (answers: Answers) =>
  cfaPrompts.reduce(
    (prev, current) => ({
      ...prev,
      [current.name]: answers[current.name] ?? current.default
    }),
    {} as Answers
  )

const installApp = async (answers: Answers, s: stream.Writable) => {
  setStatus('installing')
  const allAnswers = genAllAnswers(answers)
  const dir = allAnswers.dir ?? ''

  await generate(
    { ...allAnswers, clientPort: await getClientPort(), serverPort: await getServerPort() },
    process.cwd()
  )

  await completed(allAnswers, s)

  const npmRun = (script: string) =>
    new Promise((resolve, reject) => {
      const proc = spawn('npm', ['run', '--color', script], {
        cwd: path.resolve(dir),
        stdio: ['inherit', 'pipe', 'pipe'],
        env: {
          FORCE_COLOR: 'true',
          /* eslint-disable camelcase */
          npm_config_color: 'always',
          npm_config_progress: 'true',
          /* eslint-enable camelcase */
          ...process.env
        },
        shell: process.platform === 'win32'
      })
      proc.stdio[1]?.on('data', s.write.bind(s))
      proc.stdio[2]?.on('data', s.write.bind(s))
      proc.once('close', resolve)
      proc.once('error', reject)
    })

  await npmRun('generate')
  await npmRun('lint:fix')
  await npmRun('migrate:dev')

  npmRun('dev')

  delete db.answers.dir

  await fs.promises.writeFile(dbPath, JSON.stringify(db), 'utf8')
}

export const getAnswers = (dir: string) => ({ dir, ...db.answers })

export const updateAnswers = async (answers: Answers, s: stream.Writable) => {
  db = { ...db, answers: { ...omitDefaults(answers), dir: undefined } }

  const canContinue = await getPathStatus(path.resolve(process.cwd(), answers.dir || '')).then(
    canContinueOnPath
  )

  if (canContinue !== null) throw new Error(canContinue)

  if (!fs.existsSync(dirPath)) await fs.promises.mkdir(dirPath)

  await fs.promises.writeFile(dbPath, JSON.stringify(db), 'utf8')

  return await installApp(answers, s)
}
