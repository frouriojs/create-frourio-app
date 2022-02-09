import { Plugin } from '@nuxt/types'
<% if (aspida === 'axios') { %>import aspida from '@aspida/axios'<% } else { -%>
import nodeFetch from 'node-fetch'
import aspidaFetch from '@aspida/fetch'
import aspidaNodeFetch from '@aspida/node-fetch'<% } %>
import api from '~/server/api/$api'
<% if (aspida === 'axios') { %>
const createInstance = (axios: any) =>
  api(aspida(axios))
<% } else { %>
const createInstance = () =>
    process.client
      ? api(aspidaFetch(fetch, { throwHttpErrors: true }))
      : api(aspidaNodeFetch(nodeFetch, { throwHttpErrors: true }))
<% } %>
type ApiInstance = ReturnType<typeof createInstance>

declare module '@nuxt/types' {
  interface Context {
    $api: ApiInstance
  }
  interface NuxtAppOptions {
    $api: ApiInstance
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $api: ApiInstance
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $api: ApiInstance
  }
}

declare module 'vuex/types/index' {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  interface Store<S> {
    $api: ApiInstance
  }
}
<% if (aspida === 'axios') { %>
const plugin: Plugin = ({ $axios }, inject) =>
  inject('api', createInstance($axios))
<% } else { %>
const plugin: Plugin = (_, inject) =>
  inject('api', createInstance())
<% } %>
export default plugin
