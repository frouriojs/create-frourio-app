import { NuxtConfig } from '@nuxt/types'

const config: NuxtConfig = {
  <%_ if (mode === 'spa') { _%>
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  <%_ } _%><%_ if (target === 'static') { _%>
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  <%_ } _%>
  // Nuxt telemetry (https://nuxtjs.org/api/configuration-telemetry)
  telemetry: false,

  // Global page headers (https://go.nuxtjs.dev/config-head)
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
    link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: ['~/plugins/api'],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: <% if (aspida === 'axios') { %>[
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios'
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: require('./aspida.config').baseURL
  }<% } else { %>[]<% } %>,

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {}
}

export default config
