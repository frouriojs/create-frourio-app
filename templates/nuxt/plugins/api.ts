import { Plugin } from '@nuxt/types'
import aspida from '@aspida/axios'
import api, { ApiInstance } from '~/apis/$api'

declare module 'vue/types/vue' {
  interface Vue {
    $api: ApiInstance
  }
}

const plugin: Plugin = ({ $axios }, inject) =>
  inject('api', api(aspida($axios)))

export default plugin
