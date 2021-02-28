import fs from 'fs'
import path from 'path'
import ejs from 'ejs'
import isBinaryPath from 'is-binary-path'
import { addAllUndefined, Answers, removeUnnecessary } from '$/common/prompts'
import assert from 'assert'
import {
  convertListToJson,
  DepKeys,
  getPackageVersions,
  isDepKey
} from './package-json'
import {
  TemplateContext,
  answersToTemplateContext
} from '$/common/template-context'

export const generate = async (
  answers: Answers & { clientPort: number; serverPort: number },
  rootDir: string,
  outDir?: string
) => {
  const deps: { [k in DepKeys]: string[] } = {
    '@dep': [],
    '@dev-dep': [],
    '@server-dev-dep': [],
    '@server-dep': []
  }
  const dir = outDir ?? answers.dir ?? ''

  const templateContext: TemplateContext = addAllUndefined(
    removeUnnecessary(answersToTemplateContext(answers))
  )

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
          const content = await fs.promises.readFile(from)
          const noEjs = isBinaryPath(p)

          try {
            const output = noEjs
              ? content
              : ejs.render(
                  content.toString('utf-8').replace(/\r/g, ''),
                  templateContext
                )
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
        const f = path.resolve(now, p)
        if ((await fs.promises.stat(f)).isDirectory()) {
          const [pname, pvalue] = p.slice(1).split('=')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((templateContext as any)[pname] !== pvalue) return
          await walk(path.resolve(now, p), nowOut)
        } else {
          if (p.endsWith('dep')) {
            const lines = (await fs.promises.readFile(f))
              .toString()
              .split(/[\n\r]+/)
              .map((line) => line.trim())
              .filter((line) => line && !line.startsWith('#'))
            assert(isDepKey(p), `${p} is not expected dep key.`)
            deps[p] = [...deps[p], ...lines]
          } else {
            throw new Error('Unreachable: Unknown special filename.')
          }
        }
      })
    )
  }

  await walk(path.resolve(rootDir, 'templates'), dir)
  const versions = getPackageVersions()

  const setupPackageJson = async (
    rel: string,
    depKey: DepKeys,
    devDepKey: DepKeys
  ) => {
    const packageJsonPath = path.resolve(dir, rel)
    const packageJson = (await fs.promises.readFile(packageJsonPath)).toString()
    const finish = '\n  }\n}\n'

    assert(
      packageJson.endsWith(finish),
      'Template package.json ending unexpected.'
    )
    const replaced =
      packageJson.slice(0, -finish.length) +
      '\n  },\n' +
      `  "dependencies": {\n${convertListToJson(
        versions,
        deps[depKey],
        '    '
      )}\n  },\n` +
      `  "devDependencies": {\n${convertListToJson(
        versions,
        deps[devDepKey],
        '    '
      )}\n  }\n` +
      '}\n'
    await fs.promises.writeFile(packageJsonPath, replaced)
  }

  await Promise.all([
    setupPackageJson('package.json', '@dep', '@dev-dep'),
    setupPackageJson('server/package.json', '@server-dep', '@server-dev-dep'),
    rename('gitignore', '.gitignore')
  ])

  return templateContext
}
