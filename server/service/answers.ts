import fs from 'fs'
import { join, resolve } from 'path'
import { homedir } from 'os'
import { spawn } from 'child_process'
import open from 'open'
import { getPortPromise } from 'portfinder'
import { make, Options } from 'open-editor'
import { Answers, initPrompts } from '$/common/prompts'
import { fastify, ports } from '../'
import { editors } from './editors'
import { setStatus } from './status'

// eslint-disable-next-line
const sao = require('sao')
const dirPath = join(homedir(), '.frourio')
const dbPath = join(dirPath, 'create-frourio-app.json')

let db: {
  ver: number
  answers: Omit<Answers, 'dir'>
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

  // Fallback
  subProcess.on('error', () => {
    const result = make(files, {
      ...options,
      editor: ''
    })

    for (const file of result.arguments) {
      open(file)
    }
  })

  if (result.isTerminalEditor) {
    subProcess.on('exit', process.exit)
  } else {
    subProcess.unref()
  }
}

const install = async (answers: Answers) => {
  setStatus('installing')
  const allAnswers = initPrompts(editors)(answers).reduce(
    (prev, current) => ({
      ...prev,
      [current.name]: answers[current.name] ?? current.default
    }),
    {} as Answers
  )
  const frontPort =
    process.env.NODE_ENV === 'production'
      ? await getPortPromise({ port: 3000 })
      : 3000
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

  if (allAnswers.editor !== 'none') {
    openEditor(cwd, { editor: allAnswers.editor })
  }

  spawn(answers.pm ?? 'npm', ['run', 'dev'], { cwd })

  setStatus('completed')
}

export const getAnswers = () => ({ ...db.answers, dir: process.argv[2] })

export const updateAnswers = async (answers: Answers) => {
  const ans = { ...answers }
  delete ans.dir
  db = { ...db, answers: ans }

  if (!fs.existsSync(dirPath)) await fs.promises.mkdir(dirPath)

  await fs.promises.writeFile(dbPath, JSON.stringify(db), 'utf8')
  install(answers)
}
