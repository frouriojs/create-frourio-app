import { Plugin } from '@nuxt/types'
import aspida from '@aspida/fetch'
import api from '~/server/api/$api'

const tmp = api(aspida(fetch))

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

const plugin: Plugin = (_, inject) => inject('api', api(aspida()))

export default plugin
