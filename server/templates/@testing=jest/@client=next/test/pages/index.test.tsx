import React from 'react'<% if (reactHooks === 'swr') { %>
import { cache } from 'swr'<% } else if (reactHooks === 'none') { %>
import { render, fireEvent, waitFor, act } from '@testing-library/react'<% } %>
import dotenv from 'dotenv'
import Fastify, { FastifyInstance } from 'fastify'
import cors from 'fastify-cors'
import aspida from '@aspida/<%= aspida === 'axios' ? 'axios' : 'node-fetch' %>'
import api from '~/server/api/$api'
import Home from '~/pages/index'<% if (reactHooks !== 'none') { %>
import { render, fireEvent, waitFor, act } from '../testUtils'<% } %>

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
<% if (reactHooks === 'swr') { %>
afterEach(() => cache.clear())<% } %>
afterAll(() => fastify.close())

describe('Home page', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(<Home />, {})

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50))
      expect(asFragment()).toMatchSnapshot()
    })
  })

  it('clicking button triggers prompt', async () => {
    const { getByText } = render(<Home />, {})

    window.prompt = jest.fn()
    window.alert = jest.fn()

    await waitFor(() => {
      fireEvent.click(getByText('LOGIN'))
      expect(window.prompt).toHaveBeenCalledWith(
        'Enter the user id (See server/.env)'
      )
      expect(window.alert).toHaveBeenCalledWith('Login failed')
    })
  })
})
