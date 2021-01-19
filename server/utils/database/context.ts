import { Client } from 'pg'
import mariadb from 'mariadb'
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
  url: string
}>
export type MysqlContext = DbContext<{
  host: string
  port: number
  user: string
  password: string
  database: string
  url: string
}>
export type SqliteContext = DbContext<{ filename: string; url: string }>

export interface AllDbContext {
  pg: PgContext
  mysql: MysqlContext
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
  const client = new Client({
    ...config,
    database: 'postgres'
  })

  const getAllNames = async () => {
    const res = await client.query(
      `SELECT datname FROM pg_database WHERE datname LIKE '${thisPrefix}%'`
    )
    const names: string[] = res.rows.map((row) => row.datname)
    return names
  }

  const getAllTestNames = async () => {
    const res = await client.query(
      `SELECT datname FROM pg_database WHERE datname LIKE '${globalPrefix}%'`
    )
    const names: string[] = res.rows.map((row) => row.datname)
    return names
  }

  const deleteAll = async (names: string[]) => {
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
      const suffix = randSuffix()
      const database = `${thisPrefix}${suffix}`
      await client.query(`CREATE DATABASE ${database}`)
      return {
        ...config,
        database,
        url: `mysql://${config.user}:${config.password}@${config.host}:${config.port}/${database}`
      }
    },
    getAllNames,
    getAllTestNames,
    deleteAll,
    async up() {
      await client.connect()
    },
    async down() {
      await client.end()
    }
  }
}

export const createMysqlContext = (): MysqlContext => {
  const config = {
    host: process.env.TEST_MYSQL_HOST || '127.0.0.1',
    port: parseInt(process.env.TEST_MYSQL_PORT || '48450', 10),
    user: process.env.TEST_MYSQL_USER || 'root',
    password: process.env.TEST_MYSQL_PASSWORD || 'mysql-password'
  }
  const globalPrefix = 'cfa_test_'
  const thisPrefix = `${globalPrefix}${randSuffix()}_`
  let conn: mariadb.Connection | null = null

  const getAllNames = async () => {
    assert(conn)
    const res = await conn.query(`SHOW DATABASES LIKE '${thisPrefix}%'`)
    return res.flatMap(Object.values)
  }

  const getAllTestNames = async () => {
    assert(conn)
    const res = await conn.query(`SHOW DATABASES LIKE '${globalPrefix}%'`)
    return res.flatMap(Object.values)
  }

  const deleteAll = async (names: string[]) => {
    await Promise.all(
      names.map(async (name) => {
        assert(conn)
        if (name.startsWith(globalPrefix)) {
          await conn.query(`DROP DATABASE ${name}`)
        } else {
          console.warn(`${name} skipped.`)
        }
      })
    )
  }

  return {
    async createNew() {
      assert(conn)
      const suffix = randSuffix()
      const database = `${thisPrefix}${suffix}`
      await conn.query(`CREATE DATABASE ${database}`)
      return {
        ...config,
        database,
        url: `mysql://${config.user}:${config.password}@${config.host}:${config.port}/${database}`
      }
    },
    getAllNames,
    getAllTestNames,
    deleteAll,
    async up() {
      conn = await mariadb.createConnection({
        ...config,
        allowPublicKeyRetrieval: true
      })
    },
    async down() {
      assert(conn)
      await conn.end()
    }
  }
}

export const createSqliteContext = (dirname: string): SqliteContext => {
  const globalPrefix = 'cfa_test_'
  const thisPrefix = `${globalPrefix}${randSuffix()}_`
  return {
    async createNew() {
      const basename = `${thisPrefix}${randSuffix()}.db`
      const filename = path.resolve(dirname, basename)
      await fs.promises.writeFile(filename, '')
      return {
        filename,
        url: `file:${filename}`
      }
    },
    async getAllNames() {
      const files = await fs.promises.readdir(dirname)
      return files.filter((filename) => filename.startsWith(thisPrefix))
    },
    async getAllTestNames() {
      const files = await fs.promises.readdir(dirname)
      return files.filter((filename) => filename.startsWith(globalPrefix))
    },
    async deleteAll(names: string[]) {
      await Promise.all(
        names.map(async (name) => {
          if (name.startsWith(globalPrefix)) {
            await fs.promises.rm(path.resolve(dirname, name))
          } else {
            console.warn(`${name} skipped.`)
          }
        })
      )
    },
    async up() {
      await fs.promises.mkdir(dirname, { recursive: true })
    },
    async down() {
      // nothing to do
    }
  }
}
