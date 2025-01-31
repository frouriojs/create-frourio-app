import { Client } from 'pg'
import { genAllAnswers } from '$/service/answers'
import { defineController } from './$relay'
import { answersToTemplateContext } from '$/common/template-context'

export default defineController(() => ({
  post: async ({ body }) => {
    const answers = genAllAnswers(body)

    if (answers.skipDbChecks === 'true') {
      return { status: 200, body: { enabled: true } }
    }

    if (answers.db === 'sqlite') return { status: 200, body: { enabled: true } }

    const templateCtx = answersToTemplateContext({ ...answers, serverPort: 0, clientPort: 0 })

    if (templateCtx.dbHost !== '127.0.0.1' && templateCtx.dbHost !== 'localhost') {
      return {
        status: 200,
        body: {
          enabled: false,
          err: `To check db connection, "127.0.0.1" and "localhost" are only allowed for host name.`
        }
      }
    }

    try {
      const client = new Client({
        host: templateCtx.dbHost,
        port: +`${templateCtx.dbPort}`,
        user: templateCtx.dbUser,
        password: templateCtx.dbPass,
        database: 'postgres'
      })

      await client.connect()

      const res = await client.query('SELECT datname FROM pg_database')

      if (res.rows.every((r) => r.datname !== templateCtx.dbName)) {
        await client.query(`CREATE DATABASE ${templateCtx.dbName}`)
      }

      await client.end()

      return { status: 200, body: { enabled: true } }
    } catch (e) {
      return { status: 200, body: { enabled: false, err: e instanceof Error ? e.message : '' } }
    }
  }
}))
