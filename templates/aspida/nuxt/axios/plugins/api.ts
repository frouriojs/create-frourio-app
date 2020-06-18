import { Plugin } from '@nuxt/types'
import aspida from '@aspida/axios'
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

const plugin: Plugin = ({ $axios }, inject) =>
  inject('api', api(aspida($axios)))

export default plugin
