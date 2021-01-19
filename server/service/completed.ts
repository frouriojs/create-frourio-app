import path from 'path'
import { relative } from 'path'
import { spawn } from 'child_process'
import chalk from 'chalk'
import { Answers } from '$/common/prompts'
import stream from 'stream'
import fs from 'fs'

const npmInstall = (outDir: string, npmClient: string, s: stream.Writable) =>
  new Promise<void>((resolve, reject) => {
    const proc = spawn(npmClient, ['install'], {
      stdio: ['inherit', 'pipe', 'pipe'],
      cwd: outDir,
      env: {
        FORCE_COLOR: 'true',
        /* eslint-disable camelcase */
        npm_config_color: 'always',
        npm_config_progress: 'true',
        /* eslint-enable camelcase */
        ...process.env
      }
    })

    proc.stdio[1]?.on('data', s.write.bind(s))
    proc.stdio[2]?.on('data', s.write.bind(s))
    proc.once('exit', resolve)
    proc.once('error', reject)
  })

export const completed = async (answers: Answers, s: stream.Writable) => {
  const outDir = path.resolve(answers.dir ?? './new-frourio-app')
  const pm = answers.pm ?? ''

  await new Promise((resolve, reject) => {
    const proc = spawn('git', ['init'], {
      stdio: ['inherit', 'pipe', 'pipe'],
      cwd: outDir
    })
    proc.stdio[1]?.on('data', s.write.bind(s))
    proc.stdio[2]?.on('data', s.write.bind(s))
    proc.once('exit', resolve)
    proc.once('error', reject)
  })

  await fs.promises.writeFile(
    path.resolve(outDir, '.git/HEAD'),
    `ref: refs/heads/${answers.deployBranch}`
  )

  await npmInstall(outDir, pm, s)
  await npmInstall(`${outDir}/server`, pm, s)

  await new Promise((resolve, reject) => {
    const proc = spawn(pm, ['run', 'build:types'], {
      cwd: outDir,
      stdio: ['inherit', 'pipe', 'pipe'],
      env: {
        FORCE_COLOR: 'true',
        /* eslint-disable camelcase */
        npm_config_color: 'always',
        npm_config_progress: 'true',
        /* eslint-enable camelcase */
        ...process.env
      }
    })
    proc.stdio[1]?.on('data', s.write.bind(s))
    proc.stdio[2]?.on('data', s.write.bind(s))
    proc.once('exit', resolve)
    proc.once('error', reject)
  })

  const isNewFolder = outDir !== process.cwd()
  const relativeOutFolder = relative(process.cwd(), outDir)
  const cdMsg = isNewFolder ? chalk`\n\t{cyan cd ${relativeOutFolder}}\n` : ''
  const pmRun = `${pm}${pm === 'npm' ? ' run' : ''}`

  s.write(chalk`\n🎉  {bold Successfully created project} {cyan ${outDir}}\n`)

  s.write(chalk`  {bold To get started:}`)
  if (answers.orm !== 'none' && answers.db !== 'sqlite') {
    s.write(chalk`\t{cyan (start ${answers.db} server yourself)}`)
  }
  s.write(chalk`${cdMsg}\t{cyan ${pmRun} dev}\n`)

  s.write(chalk`  {bold To build & start for production:}`)
  if (answers.orm !== 'none' && answers.db) {
    s.write(chalk`\t{cyan (start ${answers.db} server yourself)}`)
  }
  s.write(chalk`${cdMsg}\t{cyan ${pmRun} build}`)
  s.write(chalk`\t{cyan ${pmRun} start}\n`)
}
