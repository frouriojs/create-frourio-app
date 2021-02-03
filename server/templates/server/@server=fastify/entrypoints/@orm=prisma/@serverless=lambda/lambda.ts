import awsServerlessExpress from 'aws-serverless-express'
import { init } from '$/service/app'
import type { FastifyServerFactory } from 'fastify'
import type { APIGatewayProxyHandler } from 'aws-lambda'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let server: any

const serverFactory: FastifyServerFactory = (handler) => {
  server = awsServerlessExpress.createServer(handler)
  return server
}

const proxy: APIGatewayProxyHandler = (event, context, callback) => {
  const app = init(serverFactory)

  context.callbackWaitsForEmptyEventLoop = false
  app.ready((e) => {
    if (e) return console.error(e.stack || e)
    awsServerlessExpress.proxy(server, event, context, 'CALLBACK', callback)
  })
}

exports.handler = proxy
