import fs from 'fs'
import path from 'path'
import ejs from 'ejs'
import { majo } from 'majo'
import isBinaryPath from 'is-binary-path'
import { createActions } from './actions'
import { Answers } from '$/common/prompts'

export const generate = async (
  answers: Answers & { clientPort: number; serverPort: number },
  rootDir: string,
  outDir?: string
) => {
  const config = createActions(answers)
  const dir = outDir ?? answers.dir ?? ''

  for (const action of config.actions) {
    if (action.type === 'add') {
      await majo()
        .source([action.files], {
          baseDir: path.resolve(rootDir, 'templates', action.templateDir)
        })
        .use((stream) => {
          Object.keys(stream.files)
            .filter((fp) => !isBinaryPath(fp))
            .forEach((relativePath) => {
              stream.writeContents(
                relativePath,
                ejs.render(
                  stream.files[relativePath].contents.toString(),
                  config.answers
                )
              )
            })
        })
        .dest(dir)
    } else if (action.type === 'move') {
      await Promise.all(
        Object.keys(action.patterns).map(async (pattern) => {
          const from = path.join(dir, pattern)
          const to = path.join(dir, action.patterns[pattern])
          await fs.promises.copyFile(from, to)
          await fs.promises.unlink(from)
        })
      )
    }
  }
}
