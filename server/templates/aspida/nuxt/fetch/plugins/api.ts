import { Plugin } from '@nuxt/types'
import nodeFetch from 'node-fetch'
import aspidaFetch from '@aspida/fetch'
import aspidaNodeFetch from '@aspida/node-fetch'
import api from '~/server/api/$api'

const tmp = process.client
  ? api(aspidaFetch(fetch))
  : api(aspidaNodeFetch(nodeFetch))

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
  interface Store<S> {
    $api: ApiInstance
  }
}

const plugin: Plugin = (_, inject) =>
  inject(
    'api',
    process.client ? api(aspidaFetch(fetch)) : api(aspidaNodeFetch(nodeFetch))
  )

export default plugin
