import fs from 'fs'
import path from 'path'
import ejs from 'ejs'
import isBinaryPath from 'is-binary-path'
import { addAllUndefined } from 'common/prompts'
import assert from 'assert'
import { convertListToJson, DepKeys, getPackageVersions, isDepKey } from './package-json'
import type { TemplateContext } from 'common/template-context'

export const generate = async (answers: TemplateContext, rootDir: string, outDir?: string) => {
  const deps: { [k in DepKeys]: string[] } = { '@dep': [], '@dev-dep': [] }
  const dir = outDir ?? answers.dir ?? ''

  const templateContext: TemplateContext = addAllUndefined(answers)

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

        const dest = path.resolve(nowOut, p)
        const stats = await fs.promises.stat(from)

        if (stats.isDirectory()) {
          await walk(path.resolve(now, p), dest)
        } else if (isBinaryPath(p)) {
          await fs.promises.copyFile(from, dest)
        } else {
          const content = await fs.promises.readFile(from, 'utf8')

          try {
            const output = ejs.render(content.replace(/\r/g, ''), templateContext)
            await fs.promises.writeFile(dest, output)
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

        const symlinkKey = '@symlink'
        const f = path.resolve(now, p)

        if ((await fs.promises.stat(f)).isDirectory()) {
          const [pname, pvalue] = p.slice(1).split('=')

          if (templateContext[pname as keyof TemplateContext] !== pvalue) return

          await walk(f, nowOut)
        } else if (p.startsWith(symlinkKey)) {
          const text = await fs.promises.readFile(f, 'utf8')

          await fs.promises.symlink(
            text.trim(),
            path.resolve(nowOut, p.replace(`${symlinkKey}=`, '')),
            process.platform === 'win32' ? 'junction' : undefined
          )
        } else if (isDepKey(p)) {
          const text = await fs.promises.readFile(f, 'utf8')

          deps[p] = [...deps[p], ...text.trim().split(/[\n\r]+/)]
        } else {
          throw new Error('Unreachable: Unknown special filename.')
        }
      })
    )
  }

  await walk(path.resolve(rootDir, 'templates'), dir)
  const versions = getPackageVersions()

  const setupPackageJson = async (rel: string, depKey: DepKeys, devDepKey: DepKeys) => {
    const packageJsonPath = path.resolve(dir, rel)
    const packageJson = (await fs.promises.readFile(packageJsonPath)).toString()
    const finish = '\n  }\n}\n'

    assert(packageJson.endsWith(finish), 'Template package.json ending unexpected.')
    const replaced =
      packageJson.slice(0, -finish.length) +
      '\n  },\n' +
      `  "dependencies": {\n${convertListToJson(versions, deps[depKey], '    ')}\n  },\n` +
      `  "devDependencies": {\n${convertListToJson(versions, deps[devDepKey], '    ')}\n  }\n` +
      '}\n'
    await fs.promises.writeFile(packageJsonPath, replaced)
  }

  await Promise.all([
    setupPackageJson('package.json', '@dep', '@dev-dep'),
    rename('gitignore', '.gitignore')
  ])

  return templateContext
}
