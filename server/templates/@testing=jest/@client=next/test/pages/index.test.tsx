import dotenv from 'dotenv'
import Fastify, { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import aspida from '@aspida/<%= aspida === "axios" ? "axios" : "node-fetch" %>'
import api from '$/api/$api'
import Home from '~/pages/index'
import { render, fireEvent, waitFor } from '<%= reactHooks === "none" ? "@testing-library/react" : "../testUtils" %>'

dotenv.config({ path: 'server/.env' })

const apiClient = api(aspida(undefined, { baseURL: process.env.API_BASE_PATH }))
const res = function <T extends () => any>(
  data: ReturnType<T> extends Promise<infer S> ? S : never
) {
  return data
}

let fastify: FastifyInstance

beforeAll(() => {
  fastify = Fastify()
  fastify.register(cors)
  fastify.get(apiClient.tasks.$path(), (_, reply) => {
    reply.send(
      res<typeof apiClient.tasks.$get>([
        { id: 1, label: 'foo task', done: false },
        { id: 2, label: 'bar task', done: true }
      ])
    )
  })

  return fastify.listen(process.env.API_SERVER_PORT ?? 8080)
})

afterAll(() => fastify.close())

describe('Home page', () => {
  it('shows tasks', async () => {
    const { findByText } = render(<Home />)

    await waitFor(
      async () => {
        await findByText('foo task')
      },
      { timeout: 5000 }
    )
    expect(await findByText('foo task')).toBeTruthy()
    expect(await findByText('bar task')).toBeTruthy()
  })

  it('clicking button triggers prompt', async () => {
    const { findByText } = render(<Home />)

    window.prompt = jest.fn()
    window.alert = jest.fn()

    await waitFor(
      async () => {
        await findByText('LOGIN')
      },
      { timeout: 5000 }
    )
    fireEvent.click(await findByText('LOGIN'))
    expect(window.prompt).toHaveBeenCalledWith(
      'Enter the user id (See server/.env)'
    )
    expect(window.alert).toHaveBeenCalledWith('Login failed')
  })
})
