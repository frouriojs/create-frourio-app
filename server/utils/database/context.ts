import { Client } from 'pg'
import { randSuffix } from '$/utils/random'
import assert from 'assert'
import fs from 'fs'
import path from 'path'

export interface DbContext<T> {
  up: () => Promise<void>
  down: () => Promise<void>
  createNew: () => Promise<T>
  getAllNames: () => Promise<string[]>
  getAllTestNames: () => Promise<string[]>
  deleteAll: (names: string[]) => Promise<void>
}

export type PgContext = DbContext<{
  host: string
  port: number
  user: string
  password: string
  database: string
}>

export type SqliteContext = DbContext<{ filename: string }>

export interface AllDbContext {
  pg: PgContext
  sqlite: SqliteContext
}

export const createPgContext = (): PgContext => {
  const config = {
    host: process.env.TEST_PG_HOST || '127.0.0.1',
    port: parseInt(process.env.TEST_PG_PORT || '48250', 10),
    user: process.env.TEST_PG_USER || 'postgres',
    password: process.env.TEST_PG_PASSWORD || 'pg-password'
  }
  const globalPrefix = 'cfa_test_'
  const thisPrefix = `${globalPrefix}${randSuffix()}_`
  const client = new Client({ ...config, database: 'postgres' })
  let isUp = false

  const getAllNames = async () => {
    if (!isUp) return []
    const res = await client.query(
      `SELECT datname FROM pg_database WHERE datname LIKE '${thisPrefix}%'`
    )
    const names: string[] = res.rows.map((row) => row.datname)
    return names
  }

  const getAllTestNames = async () => {
    if (!isUp) return []
    const res = await client.query(
      `SELECT datname FROM pg_database WHERE datname LIKE '${globalPrefix}%'`
    )
    const names: string[] = res.rows.map((row) => row.datname)
    return names
  }

  const deleteAll = async (names: string[]) => {
    if (!isUp) return
    await Promise.all(
      names.map(async (name) => {
        if (name.startsWith(globalPrefix)) {
          await client.query(`DROP DATABASE ${name}`)
        } else {
          console.warn(`${name} skipped.`)
        }
      })
    )
  }

  return {
    async createNew() {
      assert(isUp)
      const suffix = randSuffix()
      const database = `${thisPrefix}${suffix}`
      await client.query(`CREATE DATABASE ${database}`)

      return { ...config, database }
    },
    getAllNames,
    getAllTestNames,
    deleteAll,
    async up() {
      if (isUp) return
      isUp = true
      await client.connect()
    },
    async down() {
      if (!isUp) return
      isUp = false
      await client.end()
    }
  }
}

export const createSqliteContext = (dirname: string): SqliteContext => {
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
