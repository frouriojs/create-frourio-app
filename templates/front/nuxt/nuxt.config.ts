import { Configuration } from '@nuxt/types'
import frourioConfig from './server/frourio.config'

const config: Configuration = {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/api'],
  /*
   ** Nuxt.js dev-modules
   */
  components: true,
  buildModules: [
    // TODO: Remove when upgrading to nuxt 2.13+
    '@nuxt/components',
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL:
      process.env.NODE_ENV === 'production'
        ? frourioConfig.basePath
        : `http://localhost:${frourioConfig.port}${frourioConfig.basePath}`
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
    //  */
    // extend(config, ctx) {}
  }
}

export default config
