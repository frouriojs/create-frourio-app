import { Plugin } from '@nuxt/types'
<% if (aspida === 'axios') { %>import axios from 'axios'
import aspida from '@aspida/axios'<% } else { -%>
import nodeFetch from 'node-fetch'
import aspidaFetch from '@aspida/fetch'
import aspidaNodeFetch from '@aspida/node-fetch'<% } %>
import api from '~/server/api/$api'

const tmp = <% if (aspida === 'axios') { %>api(aspida(axios))<% } else { %>process.client
  ? api(aspidaFetch(fetch))
  : api(aspidaNodeFetch(nodeFetch))<% } %>

type ApiInstance = typeof tmp

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

const plugin: Plugin = <% if (aspida === 'axios') { %>({ $axios }, inject) =>
  inject('api', api(aspida($axios)))<% } else { %>(_, inject) =>
  inject(
    'api',
    process.client ? api(aspidaFetch(fetch)) : api(aspidaNodeFetch(nodeFetch))
  )<% } %>

export default plugin
