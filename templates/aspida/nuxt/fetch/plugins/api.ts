import { Plugin } from '@nuxt/types'
import aspida from '@aspida/fetch'
import api, { ApiInstance } from '~/server/api/$api'

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
  inject('api', api(aspida(fetch, { baseURL: process.env.BASE_URL })))

export default plugin
