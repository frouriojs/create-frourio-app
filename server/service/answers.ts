import fs from 'fs'
import path from 'path'
import { homedir } from 'os'
import { spawn } from 'child_process'
import { Answers, cfaPrompts } from 'common/prompts'
import { generate } from './generate'
import { setStatus } from './status'
import { completed } from './completed'
import { getClientPort, getServerPort } from './getServerPort'
import stream from 'stream'
import { canContinueOnPath, getPathStatus } from './localPath'

{
  // remove unused local json
  const dirPath = path.join(homedir(), '.frourio')
  const dbPath = path.join(dirPath, 'create-frourio-app.json')

  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath)
    fs.rmdirSync(dirPath)
  }
}

const genAllAnswers = (answers: Answers) =>
  cfaPrompts.reduce(
    (prev, current) => ({
      ...prev,
      [current.name]: answers[current.name] ?? current.default
    }),
    {} as Answers
  )

const installApp = async (answers: Answers) => {
  setStatus('installing')
  const allAnswers = genAllAnswers(answers)
  const dir = allAnswers.dir ?? ''
  const s = new stream.Writable({
    write(chunk, _enc, cb) {
      process.stdout.write(chunk, (err) => cb(err))
    }
  })

  await generate(
    { ...allAnswers, clientPort: await getClientPort(), serverPort: await getServerPort() },
    __dirname
  )

  await completed(dir, s)

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

  npmRun('dev')
}

export const updateAnswers = async (answers: Answers) => {
  const canContinue = await getPathStatus(path.resolve(process.cwd(), answers.dir || '')).then(
    canContinueOnPath
  )

  if (canContinue !== null) throw new Error(canContinue)

  return await installApp(answers)
}
