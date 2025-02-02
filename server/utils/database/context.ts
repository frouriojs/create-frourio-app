import { randSuffix } from 'utils/random'
import assert from 'assert'
import fs from 'fs'
import path from 'path'

export type DbContext = {
  up: () => Promise<void>
  down: () => Promise<void>
  createNew: () => Promise<{ filename: string }>
  getAllNames: () => Promise<string[]>
  getAllTestNames: () => Promise<string[]>
  deleteAll: (names: string[]) => Promise<void>
}

export const createDbContext = (dirname: string): DbContext => {
  const globalPrefix = 'cfa_test_'
  const thisPrefix = `${globalPrefix}${randSuffix()}_`
  let isUp = false

  return {
    async createNew() {
      assert(isUp)
      const basename = `${thisPrefix}${randSuffix()}.db`
      const filename = path.resolve(dirname, basename)
      await fs.promises.writeFile(filename, '')

      return { filename }
    },
    async getAllNames() {
      if (!isUp) return []
      const files = await fs.promises.readdir(dirname)
      return files.filter((filename) => filename.startsWith(thisPrefix))
    },
    async getAllTestNames() {
      if (!isUp) return []
      const files = await fs.promises.readdir(dirname)
      return files.filter((filename) => filename.startsWith(globalPrefix))
    },
    async deleteAll(names: string[]) {
      if (!isUp) return
      await Promise.all(
        names.map(async (name) => {
          if (name.startsWith(globalPrefix)) {
            await fs.promises.unlink(path.resolve(dirname, name))
          } else {
            console.warn(`${name} skipped.`)
          }
        })
      )
    },
    async up() {
      if (isUp) return
      isUp = true
      try {
        await fs.promises.mkdir(dirname, { recursive: true })
      } catch (e: unknown) {
        // ignore
      }
    },
    async down() {
      isUp = false
      // nothing to do
    }
  }
}
