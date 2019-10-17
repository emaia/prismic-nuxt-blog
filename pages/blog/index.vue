<template>
  <div class="container">
    
    <section class="hero">
      <div class="hero-body">
        
          <h1 class="title">
            <b>Prismic Vue.js Blog</b>
          </h1>
          <h2 class="subtitle">
            Javscript is awesome!
          </h2>
        
      </div>
    </section>    

    <div class="columns blog">
      
      <div class="column" v-for="post in posts" :key="post.id">
        <header>
          <img :src="post.data.image.mobile.url" alt="Imagem">
        </header>

        <article class="box-">
         
          <h3 class="title">
            <nuxt-link :to="LinkResolverF(post)">
              {{ $prismic.richTextAsPlain(post.data.title) }}
            </nuxt-link>
          </h3>

          <p class="excerpt">
            {{ getExcerpt(post) }}
          </p>

          <p class="tags">
            <span class="tag is-info" v-for="tag in post.tags" :key="tag.index">{{ tag }}</span>
          </p>

          <nuxt-link :to="LinkResolverF(post)" class="button is-link is-small">Read more</nuxt-link>

        </article>
      </div>

    </div>
    
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
    getExcerpt(post) {
      const limit = 150
      const slices = post.data.content
      let hasParagraph = false
      let paragraph = ''
      //console.log(slices)

      slices.map((slice) => {
        if(slice.type === "paragraph" && !hasParagraph) {
          hasParagraph = true
          paragraph = slice.text
        }
      })

      const excerpt = paragraph.substring(0, limit)

      if (paragraph.length > limit) {
        return excerpt.substring(0, excerpt.lastIndexOf(' ')) + ' ...'
      }

      return excerpt
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

<style lang="scss" scoped>
.blog {
  margin-bottom: 50px;
  padding: 20px;
  article {
    background-color: #fafafa;
    padding: 20px;

    .excerpt, .tags {
      margin-bottom: 15px
    }
  }
  header {
    img {
      width: 100%;
      display: block;
    }
  }
}

.box {
  
}
</style>