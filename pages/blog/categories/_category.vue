<template>
  <div class="container">
    <section class="hero">
      <div class="hero-body">
        <h1 class="title">
          <b>Category: {{ category }}</b>
        </h1>
      </div>
    </section>
    <GridPosts :posts="posts" :pagination="pagination"></GridPosts>
  </div>
</template>
<script>
import { getApi } from '~/utils';
import Prismic from 'prismic-javascript';
import GridPosts from '~/components/grid-posts';

async function getBlogIndex(options = {}) {
  const api = await getApi();
  return await api.query(Prismic.Predicates.at('document.tags', [options.category]), {
    orderings: '[my.posts.date desc]',
    pageSize: 3,
    page: options.page || 1
  });
}

export default {
  head() {
    return {
      title: this.category + ' | Blog fodastico!'
    };
  },
  components: {
    GridPosts
  },
  data() {
    return {
      posts: {},
      pagination: {}
    };
  },
  watchQuery: ['page', 'category'],
  async asyncData({ route, query, error }) {
    try {
      const page = parseInt(query.page) || 1;
      const category = route.params.category;
      const posts = await getBlogIndex({ page, category });

      return {
        category,
        posts: posts.results,
        pagination: {
          source: 'blog/categories/' + category,
          current: posts.page,
          total: posts.total_results_size,
          perPage: posts.results_per_page,
          rangeBefore: 3,
          rangeAfter: 1,
          order: 'is-centered',
          size: '',
          isSimple: false,
          isRounded: false,
          prevIcon: 'chevron-left',
          nextIcon: 'chevron-right'
        }
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
    async fetchPosts(page) {
      this.$nuxt.$loading.start();
      const posts = await getBlogIndex({ page: page, pageSize: this.perPage });
      this.posts = posts.results;
      this.total = posts.total_results_size;
      this.perPage = posts.results_per_page;
      this.$nuxt.$loading.finish();
    }
  }
};
</script>

<style lang="scss" scoped></style>
