<template>
  <div class="container">
    <h1 class="title">Blog</h1>
    <ul>
      <li v-for="post in posts" :key="post.id">
        <nuxt-link :to="LinkResolverF(post)">
          {{ $prismic.richTextAsPlain(post.data.title) }}
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>
<script>
import { getApi } from "~/utils"
import Prismic from 'prismic-javascript'
import LinkResolver from "~/plugins/link-resolver.js"

async function getBlogIndex(options = {}) {
  const api = await getApi();
  
  return await api.query(
    Prismic.Predicates.at("document.type", "posts"),
    { orderings : '[my.posts.date desc]' }
  )

}

export default {
  head() {
    return {
      title: "Blog fodastico!",
    }
  },
  created() {
    //this.refetchPageForPreview();
  },
  data() {
    return {
      posts: {}
    }
  },
  methods: {
    LinkResolverF(post) {
      return LinkResolver(post)
    },
    async refetchPageForPreview() {
      const posts = await getBlogIndex();
      this.posts = posts.results;
    }
  },
  async asyncData({ context, error, req }) {
    try {

      const posts = await getBlogIndex();
     
      return {
        posts: posts.results
      }

    } catch(e) {
      console.warn(e);
      error({ statusCode: 404, message: 'Page not found' })
    }
  }
}
</script>