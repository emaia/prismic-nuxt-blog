import Prismic from 'prismic-javascript';
const PrismicConfig = require('./prismic.config');

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      { innerHTML: '{ window.prismic = { endpoint: "' + PrismicConfig.apiEndpoint + '"} }' },
      { src: '//static.cdn.prismic.io/prismic.min.js' }
    ],
    __dangerouslyDisableSanitizers: ['script']
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: 'yellow' },
  /*
   ** Global CSS
   */
  css: [],

  styleResources: { scss: ['@/assets/scss/app.scss'] },
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/link-resolver.js', '~/plugins/html-serializer.js', '~/plugins/prismic-vue.js'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/style-resources', ['nuxt-buefy', { css: false }]],

  /*
   ** Dynamic Route Generation
   */
  generate: {
    devtools: true,
    routes: async function(callback) {
      try {
        const api = await Prismic.getApi(PrismicConfig.apiEndpoint);

        const posts = await api.query(Prismic.Predicates.at('document.type', 'posts'));

        const routes = posts.results.map(post => `/blog/${post.uid}`);

        callback(null, routes);
      } catch (e) {
        callback(e);
      }
    }
  },

  /*
   ** Build configuration
   */
  build: {
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      config.resolve.alias.vue = 'vue/dist/vue.common';
    }
  },
  router: {
    middleware: 'preview'
  }
};
