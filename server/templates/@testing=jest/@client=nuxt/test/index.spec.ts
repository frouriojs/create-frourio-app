import { RouterLinkStub } from '@vue/test-utils'
import { render, fireEvent } from '@testing-library/vue'
import aspida from '@aspida/<%= aspida === 'axios' ? 'axios' : 'node-fetch' %>'
import Home from '@/pages/index.vue'
import api from '$/api/$api'

const apiClient = api(aspida())
const res = <T extends (...args: any[]) => any>(
  data: ReturnType<T> extends Promise<infer S> ? S : never
) => data

const stubs = {
  NuxtLink: RouterLinkStub
}
const mocks = {
  $fetchState: { pending: false },
  $pagesPath: { $url: () => '/', article: { $url: () => '/article' } },
  $staticPath: { favicon_png: '/favicon.png' }
}

describe('Home page', () => {
  it('shows tasks', () => {
    const { getByText } = render(Home, {
      data: () => ({
        tasks: res<typeof apiClient.tasks.$get>([
          { id: 1, label: 'foo task', done: false },
          { id: 2, label: 'bar task', done: true }
        ])
      }),
      stubs,
      mocks
    })

    expect(getByText('foo task')).toBeTruthy()
    expect(getByText('bar task')).toBeTruthy()
  })

  it('clicking button triggers prompt', async () => {
    const { findByText } = render(Home, {
      stubs,
      mocks
    })

    window.prompt = jest.fn()
    window.alert = jest.fn()

    await fireEvent.click(await findByText('LOGIN'))

    expect(window.prompt).toHaveBeenCalledWith(
      'Enter the user id (See server/.env)'
    )
    expect(window.alert).toHaveBeenCalledWith('Login failed')
  })
})
