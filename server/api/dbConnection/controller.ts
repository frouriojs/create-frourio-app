import mariadb from 'mariadb'
import { Client } from 'pg'
import { defineController } from './$relay'

export default defineController(() => ({
  post: async ({ body }) => {
    const db = body.orm === 'prisma' ? body.prismaDB : body.typeormDB
    if (!db || db === 'sqlite') return { status: 200, body: { enabled: true } }

    try {
      const config = {
        host: body.dbHost,
        port: +`${body.dbPort}`,
        user: body.dbUser,
        password: body.dbPass
      }

      if (db === 'mysql') {
        const conn = await mariadb.createConnection(config)

        if (body.orm === 'typeorm') {
          await conn.query(`CREATE DATABASE IF NOT EXISTS ${body.dbName}`)
        }

        await conn.end()
      } else {
        const client = new Client({ ...config, database: 'postgres' })
        await client.connect()

        if (body.orm === 'typeorm') {
          const res = await client.query('SELECT datname FROM pg_database')

          if (res.rows.every((r) => r.datname !== body.dbName)) {
            await client.query(`CREATE DATABASE ${body.dbName}`)
          }
        }

        await client.end()
      }

      return { status: 200, body: { enabled: true } }
    } catch (e) {
      return { status: 200, body: { enabled: false, err: e.message } }
    }
  }
}))
