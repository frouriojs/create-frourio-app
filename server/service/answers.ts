import fs from 'fs'
import { join, resolve } from 'path'
import { homedir } from 'os'
import { spawn } from 'child_process'
import { getPortPromise } from 'portfinder'
import { make, Options } from 'open-editor'
import { Answers, initPrompts } from '$/common/prompts'
import { fastify, ports } from '../'
import { editors } from './editors'
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

// https://github.com/sindresorhus/open-editor/blob/master/index.js#L54
const openEditor = (cwd: string, options: Options) => {
  const files = ['README.md:1:1']
  const result = make(files, options)
  const stdio = result.isTerminalEditor ? 'inherit' : 'ignore'

  const subProcess = spawn(result.binary, result.arguments, {
    detached: true,
    stdio,
    cwd
  })

  subProcess.on('error', () => {
    console.log(`Editor "${options.editor}" could not find.`)
  })

  if (result.isTerminalEditor) {
    subProcess.on('exit', process.exit)
  } else {
    subProcess.unref()
  }
}

export const install = async (answers: Answers, frontPort: number) => {
  setStatus('installing')
  const allAnswers = initPrompts(editors)(answers).reduce(
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
      frontPort,
      serverPort: ports.server
    }
  })
    .run()
    .catch((e: Error) => console.trace(e))

  await fastify.close()
  const cwd = resolve(answers.dir ?? '')

  delete db.answers.dir
  await fs.promises.writeFile(dbPath, JSON.stringify(db), 'utf8')

  if (allAnswers.editor !== 'none') {
    openEditor(cwd, { editor: allAnswers.editor })
  }

  spawn(answers.pm ?? 'npm', ['run', 'dev'], { cwd, stdio: 'inherit' })
}

export const getAnswers = () => ({ dir: process.argv[2], ...db.answers })

export const updateAnswers = async (answers: Answers) => {
  const frontPort =
    process.env.NODE_ENV === 'development'
      ? 3001
      : await getPortPromise({ port: 3000 })

  if (getStatus() === 'waiting') {
    db = { ...db, answers }

    if (!fs.existsSync(dirPath)) await fs.promises.mkdir(dirPath)

    await fs.promises.writeFile(dbPath, JSON.stringify(db), 'utf8')

    install(answers, frontPort)
  }

  return { frontPort }
}
