import mariadb from 'mariadb'
import { Client } from 'pg'
import { genAllAnswers } from '$/service/answers'
import { defineController } from './$relay'

export default defineController(() => ({
  post: async ({ body }) => {
    const allAnswers = genAllAnswers(body)

    if (allAnswers.skipDbChecks) {
      return { status: 200, body: { enabled: true } }
    }

    if (allAnswers.orm === 'none' || allAnswers.db === 'sqlite') {
      return { status: 200, body: { enabled: true } }
    }

    if (
      allAnswers.dbHost !== '127.0.0.1' &&
      allAnswers.dbHost !== 'localhost'
    ) {
      return {
        status: 200,
        body: {
          enabled: false,
          err: `To check db connection, "127.0.0.1" and "localhost" are only allowed for host name.`
        }
      }
    }

    try {
      const config = {
        host: allAnswers.dbHost,
        port: +`${allAnswers.dbPort}`,
        user: allAnswers.dbUser,
        password: allAnswers.dbPass
      }

      if (allAnswers.db === 'mysql') {
        const conn = await mariadb.createConnection({
          ...config,
          allowPublicKeyRetrieval: true
        })

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
      return {
        status: 200,
        body: { enabled: false, err: e.message }
      }
    }
  }
}))
