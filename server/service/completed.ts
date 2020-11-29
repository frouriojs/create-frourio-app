import { relative } from 'path'
import spawn from 'cross-spawn'
import chalk from 'chalk'
import ora from 'ora'
import logUpdate from 'log-update'
import { Answers } from '$/common/prompts'

const npmInstall = (outDir: string, npmClient: string) =>
  new Promise<void>((resolve, reject) => {
    const spinner = ora()
    spinner.start(`Installing packages with ${npmClient}`)
    const ps = spawn(npmClient, ['install'], {
      stdio: [0, 'pipe', 'pipe'],
      cwd: outDir,
      env: Object.assign(
        {
          FORCE_COLOR: true,
          /* eslint-disable camelcase */
          npm_config_color: 'always',
          npm_config_progress: true
          /* eslint-enable camelcase */
        },
        process.env
      )
    })

    let stdoutLogs = ''
    let stderrLogs = ''

    ps.stdout &&
      ps.stdout.setEncoding('utf8').on('data', (data) => {
        if (npmClient === 'pnpm') {
          stdoutLogs = data
        } else {
          stdoutLogs += data
        }
        spinner.stop()
        logUpdate(stdoutLogs)
        spinner.start()
      })

    ps.stderr &&
      ps.stderr.setEncoding('utf8').on('data', (data) => {
        if (npmClient === 'pnpm') {
          stderrLogs = data
        } else {
          stderrLogs += data
        }
        spinner.stop()
        logUpdate.clear()
        logUpdate.stderr(stderrLogs)
        logUpdate(stdoutLogs)
        spinner.start()
      })

    ps.on('close', (code) => {
      spinner.stop()
      // Clear output when succeeded
      if (code === 0) {
        logUpdate.clear()
        logUpdate.stderr.clear()
      } else {
        throw new Error(`Failed to install packages in ${outDir}`)
      }
      resolve()
    })

    ps.on('error', reject)
  })

export const completed = async (answers: Answers) => {
  const outDir = answers.dir ?? ''
  const pm = answers.pm ?? ''
  spawn.sync('git', ['init'], { stdio: 'ignore', cwd: outDir })

  await npmInstall(outDir, pm)
  await npmInstall(`${outDir}/server`, pm)

  spawn.sync(pm, ['run', 'build:types'], {
    cwd: outDir,
    stdio: 'inherit'
  })

  const isNewFolder = outDir !== process.cwd()
  const relativeOutFolder = relative(process.cwd(), outDir)
  const cdMsg = isNewFolder ? chalk`\n\t{cyan cd ${relativeOutFolder}}\n` : ''
  const pmRun = `${pm}${pm === 'npm' ? ' run' : ''}`

  console.log(
    chalk`\n🎉  {bold Successfully created project} {cyan ${outDir}}\n`
  )

  console.log(chalk`  {bold To get started:}`)
  if (
    answers.orm !== 'none' &&
    (answers.orm === 'typeorm' || answers.prismaDB !== 'sqlite')
  ) {
    console.log(
      chalk`\t{cyan (start ${
        answers.orm === 'prisma' ? answers.prismaDB : answers.typeormDB
      } server yourself)}`
    )
  }
  console.log(chalk`${cdMsg}\t{cyan ${pmRun} dev}\n`)

  console.log(chalk`  {bold To build & start for production:}`)
  if (
    answers.orm !== 'none' &&
    (answers.orm === 'typeorm' || answers.prismaDB !== 'sqlite')
  ) {
    console.log(
      chalk`\t{cyan (start ${
        answers.orm === 'prisma' ? answers.prismaDB : answers.typeormDB
      } server yourself)}`
    )
  }
  console.log(chalk`${cdMsg}\t{cyan ${pmRun} build}`)
  console.log(chalk`\t{cyan ${pmRun} start}\n`)
}
