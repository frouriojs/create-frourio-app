import React from 'react'<% if (reactHooks === 'swr') { %>
import { cache } from 'swr'<% } else if (reactHooks === 'query') { %>
import { QueryClient, QueryClientProvider } from 'react-query'<% } %>
import dotenv from 'dotenv'
import Fastify, { FastifyInstance } from 'fastify'
import cors from 'fastify-cors'
import aspida from '@aspida/<%= aspida === 'axios' ? 'axios' : 'node-fetch' %>'
import api from '~/server/api/$api'
import Home from '~/pages/index'
import { render, fireEvent, waitForDomChange } from '../testUtils'

dotenv.config({ path: 'server/.env' })

const apiClient = api(aspida(undefined, { baseURL: process.env.BASE_PATH }))
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

  return fastify.listen(process.env.SERVER_PORT ?? 8080)
})
<% if (reactHooks === 'swr') { %>
afterEach(() => cache.clear())<% } %>
afterAll(() => fastify.close())

describe('Home page', () => {
  it('matches snapshot', async () => {<% if (reactHooks === 'query') { %>
    const queryClient = new QueryClient()<% } %>
    const { container, asFragment } = render(<% if (reactHooks === 'query') { %>
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>,
      {}
    )<% } else { %><Home />, {})<% } %>

    await waitForDomChange({ container: container as HTMLElement })

    expect(asFragment()).toMatchSnapshot()
  })

  it('clicking button triggers prompt', async () => {<% if (reactHooks === 'query') { %>
    const queryClient = new QueryClient()<% } %>
    const { container, getByText } = render(<% if (reactHooks === 'query') { %>
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>,
      {}
    )<% } else { %><Home />, {})<% } %>

    await waitForDomChange({ container: container as HTMLElement })

    window.prompt = jest.fn()
    window.alert = jest.fn()
    fireEvent.click(getByText('LOGIN'))

    expect(window.prompt).toHaveBeenCalledWith(
      'Enter the user id (See server/.env)'
    )
    expect(window.alert).toHaveBeenCalledWith('Login failed')
  })
})
