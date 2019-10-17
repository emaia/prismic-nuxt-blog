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

    <div class="columns is-multiline blog">
      <div v-for="post in posts" :key="post.id" class="column is-6-tablet is-4-desktop">
        <header>
          <img :src="post.data.image.mobile.url" alt="Imagem" />
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
            <span v-for="tag in post.tags" :key="tag.index" class="tag">{{ tag }}</span>
          </p>

          <nuxt-link :to="LinkResolverF(post)" class="button is-link is-small">Read more</nuxt-link>
        </article>
      </div>
    </div>

    <div v-if="total > 1" class="pagination-wrapper">
      <b-pagination
        :total="total"
        :current.sync="current"
        :range-before="rangeBefore"
        :range-after="rangeAfter"
        :order="order"
        :size="size"
        :simple="isSimple"
        :rounded="isRounded"
        :per-page="perPage"
        :icon-prev="prevIcon"
        :icon-next="nextIcon"
        aria-next-label="Next page"
        aria-previous-label="Previous page"
        aria-page-label="Page"
        aria-current-label="Current page"
      >
      </b-pagination>
    </div>
  </div>
</template>
<script>
import { getApi } from '~/utils';
import Prismic from 'prismic-javascript';
import LinkResolver from '~/plugins/link-resolver.js';

async function getBlogIndex(options = {}) {
  const api = await getApi();
  return await api.query(Prismic.Predicates.at('document.type', 'posts'), {
    orderings: '[my.posts.date desc]',
    pageSize: 3,
    page: options.page || 1
  });
}

export default {
  head() {
    return {
      title: 'Blog fodastico!'
    };
  },
  data() {
    return {
      posts: {},
      total: 0,
      current: 1,
      perPage: 3,
      rangeBefore: 3,
      rangeAfter: 1,
      order: 'is-centered',
      size: '',
      isSimple: false,
      isRounded: false,
      prevIcon: 'chevron-left',
      nextIcon: 'chevron-right'
    };
  },
  watch: {
    // sempre que a pergunta mudar, essa função será executada
    current: function(newValue, oldValue) {
      console.log(`Mudou de ${oldValue} para ${newValue}`);
      this.fetchPosts(newValue);
    }
  },
  async asyncData({ context, error, req }) {
    try {
      const posts = await getBlogIndex({ page: 1 });

      return {
        posts: posts.results,
        current: posts.page,
        total: posts.total_results_size,
        perPage: posts.results_per_page
      };
    } catch (e) {
      console.warn(e);
      error({ statusCode: 404, message: 'Page not found' });
    }
  },
  created() {
    //
  },
  methods: {
    LinkResolverF(post) {
      return LinkResolver(post);
    },
    async fetchPosts(page) {
      this.$nuxt.$loading.start();
      const posts = await getBlogIndex({ page: page, pageSize: this.perPage });
      this.posts = posts.results;
      this.total = posts.total_results_size;
      this.perPage = posts.results_per_page;
      this.$nuxt.$loading.finish();
    },
    getExcerpt(post) {
      const limit = 150;
      const slices = post.data.content;
      let hasParagraph = false;
      let paragraph = '';
      //console.log(slices)

      slices.map(slice => {
        if (slice.type === 'paragraph' && !hasParagraph) {
          hasParagraph = true;
          paragraph = slice.text;
        }
      });

      const excerpt = paragraph.substring(0, limit);

      if (paragraph.length > limit) {
        return excerpt.substring(0, excerpt.lastIndexOf(' ')) + ' ...';
      }

      return excerpt;
    }
  }
};
</script>

<style lang="scss" scoped>
.blog {
  margin-bottom: 50px;
  //padding: 20px;
  article {
    background-color: #fafafa;
    padding: 40px;

    @include desktop {
      padding: 20px;
    }

    .excerpt,
    .tags {
      margin-bottom: 15px;
    }
  }
  header {
    img {
      width: 100%;
      display: block;
    }
  }
}
.pagination-wrapper {
  margin-bottom: 50px;
}
</style>
