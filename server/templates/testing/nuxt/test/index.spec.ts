import { mount } from '@vue/test-utils'
import aspida from '@aspida/<%= aspida === 'axios' ? 'axios' : 'node-fetch' %>'
import Home from '@/pages/index.vue'
import Logo from '@/components/Logo.vue'
import UserBanner from '@/components/UserBanner.vue'
import api from '~/server/api/$api'

const apiClient = api(aspida())
const options = {
  stubs: { UserBanner, Logo },
  mocks: { $fetchState: { pending: false } }
}
const res = <T extends (...args: any[]) => any>(
  data: ReturnType<T> extends Promise<infer S> ? S : never
) => data

describe('Home page', () => {
  it('matches snapshot', async () => {
    const wrapper = mount(Home, options)

    await wrapper.setData({
      tasks: res<typeof apiClient.tasks.$get>([
        { id: 1, label: 'foo task', done: false },
        { id: 2, label: 'bar task', done: true }
      ])
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('clicking button triggers prompt', async () => {
    const wrapper = mount(Home, options)

    window.prompt = jest.fn()
    window.alert = jest.fn()

    await wrapper.find('button').trigger('click')

    expect(window.prompt).toHaveBeenCalledWith(
      'Enter the user id (See server/.env)'
    )
    expect(window.alert).toHaveBeenCalledWith('Login failed')
  })
})
