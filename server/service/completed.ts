import path from 'path'
import { relative } from 'path'
import { spawn } from 'child_process'
import chalk from 'chalk'
import stream from 'stream'

export const npmInstall = async (cwd: string, s: stream.Writable) => {
  await new Promise<void>((resolve, reject) => {
    const proc = spawn('npm', ['install'], {
      stdio: ['inherit', 'pipe', 'pipe'],
      cwd,
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
}

export const completed = async (dir: string, s: stream.Writable) => {
  const outDir = path.resolve(dir)

  await npmInstall(outDir, s)
  await npmInstall(path.resolve(outDir, 'server'), s)

  const isNewFolder = outDir !== process.cwd()
  const relativeOutFolder = relative(process.cwd(), outDir)
  const cdMsg = isNewFolder ? chalk`\n\t{cyan cd ${relativeOutFolder}}\n` : ''

  s.write(chalk`\n🎉  {bold Successfully created project} {cyan ${outDir}}\n`)
  s.write(chalk`  {bold To get started:}`)
  s.write(chalk`${cdMsg}\t{cyan npm run dev}\n`)
  s.write(chalk`  {bold To build & start for production:}`)
  s.write(chalk`${cdMsg}\t{cyan npm run build}`)
  s.write(chalk`\t{cyan npm start}\n`)
}
