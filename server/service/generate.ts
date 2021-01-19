import fs from 'fs'
import path from 'path'
import ejs from 'ejs'
import isBinaryPath from 'is-binary-path'
import { Answers } from '$/common/prompts'
import { typeormDBs } from '$/common/dbInfo'

type TemplateContext = Answers & {
  clientPort: number
  serverPort: number
  dbModule: string
  // used for typeorm.ConnectionOptions.type
  typeormDb: string | undefined
}

export const generate = async (
  answers: Answers & { clientPort: number; serverPort: number },
  rootDir: string,
  outDir?: string
) => {
  const dir = outDir ?? answers.dir ?? ''

  const templateContext: TemplateContext = {
    ...answers,
    dbModule:
      answers.orm === 'typeorm'
        ? `",\n    "${
            typeormDBs[answers.db as keyof typeof typeormDBs].name
          }": "${typeormDBs[answers.db as keyof typeof typeormDBs].ver}`
        : '',
    typeormDb: answers.db === 'postgresql' ? 'postgres' : answers.db
  }

  const rename = async (pattern: string, renameTo: string) => {
    const from = path.join(dir, pattern)
    const to = path.join(dir, renameTo)
    await fs.promises.rename(from, to)
  }

  const walk = async (now: string, nowOut: string) => {
    const paths = await fs.promises.readdir(now)
    try {
      await fs.promises.mkdir(nowOut)
    } catch (e: unknown) {
      // ignore
    }
    await Promise.all(
      paths.map(async (p) => {
        const from = path.resolve(now, p)
        if (p.startsWith('@')) return
        if ((await fs.promises.stat(from)).isDirectory()) {
          await walk(path.resolve(now, p), path.resolve(nowOut, p))
        } else {
          const content = (await fs.promises.readFile(from)).toString('utf-8')
          const noEjs = isBinaryPath(p) && !p.endsWith('.snap')

          try {
            const output = noEjs
              ? content
              : ejs.render(content.replace(/\r/g, ''), templateContext)
            await fs.promises.writeFile(path.resolve(nowOut, p), output)
          } catch (e: unknown) {
            console.error(e)
            console.error(`Error occured while processing ${from}`)
            throw e
          }
        }
      })
    )
    await Promise.all(
      paths.map(async (p) => {
        if (!p.startsWith('@')) return
        const [pname, pvalue] = p.slice(1).split('=')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((templateContext as any)[pname] !== pvalue) return
        await walk(path.resolve(now, p), nowOut)
      })
    )
  }

  await walk(path.resolve(rootDir, 'templates'), dir)
  await rename('gitignore', '.gitignore')
}
