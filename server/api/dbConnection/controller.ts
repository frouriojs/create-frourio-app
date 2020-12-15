import mariadb from 'mariadb'
import { Client } from 'pg'
import { genAllAnswers } from '$/service/answers'
import { defineController } from './$relay'

export default defineController(() => ({
  post: async ({ body }) => {
    const allAnswers = genAllAnswers(body)

    if (allAnswers.orm === 'none' || allAnswers.prismaDB === 'sqlite') {
      return { status: 200, body: { enabled: true } }
    }

    try {
      const config = {
        host: allAnswers.dbHost,
        port: +`${allAnswers.dbPort}`,
        user: allAnswers.dbUser,
        password: allAnswers.dbPass
      }

      if ((allAnswers.prismaDB ?? allAnswers.typeormDB) === 'mysql') {
        const conn = await mariadb.createConnection(config)

        if (allAnswers.orm === 'typeorm') {
          await conn.query(`CREATE DATABASE IF NOT EXISTS ${allAnswers.dbName}`)
        }

        await conn.end()
      } else {
        const client = new Client({ ...config, database: 'postgres' })
        await client.connect()

        if (allAnswers.orm === 'typeorm') {
          const res = await client.query('SELECT datname FROM pg_database')

          if (res.rows.every((r) => r.datname !== allAnswers.dbName)) {
            await client.query(`CREATE DATABASE ${allAnswers.dbName}`)
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
