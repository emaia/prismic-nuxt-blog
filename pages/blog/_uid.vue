<template>
  <div class="container">

    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            {{ $prismic.richTextAsPlain(post.data.title) }}
          </h1>
          <p class="subtitle">
            
          </p>
          <p>Postado em {{ formattedDate(post.data.date) }}. <nuxt-link :to="{ name: 'blog' }">Voltar para o blog</nuxt-link></p>
        </div>
      </div>
    </section>

    <article class="content">
      <prismic-rich-text :field="post.data.content"/>
    </article>

  </div>
</template>
<script>
import { getApi } from "~/utils"

async function getPost(options = {}) {
  const api = await getApi(options)
  const uid = options.params.uid ? options.params.uid : $route.params.uid
  return await api.getByUID("posts", uid)
}

export default {
  head() {
    return {
      title: this.title || ''
    }
  },
  data() {
    return {
      title: '',
      post: {}
    }
  },
  created() {
    //this.refetchPageForPreview();
  },
  methods: {
    formattedDate (date) {
      return Intl.DateTimeFormat('pt-BR', { year: 'numeric', month: 'long', day: '2-digit' }).format(new Date(date))
    },
    async refetchPageForPreview() {
      try {
        const params = this.$route.params
        const post = await getPost({ params })
        this.title = post.data.title[0].text + ' | ' + process.env.npm_package_name
        this.post = post
      } catch(e) {
        error({ statusCode: 404, message: 'Page not found' })
      }
      
    }
  },
  async asyncData({ params, error, req }) {
    try {

      // Query to get posts content to preview
      const post = await getPost({req, params})

      return {
        title: post.data.title[0].text + ' | ' + process.env.npm_package_name,
        post
      }

    } catch(e) {
      console.warn(e);
      error({ statusCode: 404, message: 'Page not found' })
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding: 0 0 50px;
  margin-bottom: 100px
}
</style>