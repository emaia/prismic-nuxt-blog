<template>
  <section>
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
            <b-tag v-for="tag in post.tags" :key="tag.index" type="is-light">
              <nuxt-link :to="`/blog/categories/${tag}`">{{ tag }}</nuxt-link>
            </b-tag>
          </p>

          <nuxt-link :to="LinkResolverF(post)" class="button is-link is-small">Read more</nuxt-link>
        </article>
      </div>
    </div>

    <div v-if="pagination.total > 1" class="pagination-wrapper">
      <b-pagination
        :total="pagination.total"
        :current.sync="pagination.current"
        :range-before="pagination.rangeBefore"
        :range-after="pagination.rangeAfter"
        :order="pagination.order"
        :size="pagination.size"
        :simple="pagination.isSimple"
        :rounded="pagination.isRounded"
        :per-page="pagination.perPage"
        :icon-prev="pagination.prevIcon"
        :icon-next="pagination.nextIcon"
        aria-next-label="Next page"
        aria-previous-label="Previous page"
        aria-page-label="Page"
        aria-current-label="Current page"
      >
        <b-pagination-button
          :id="`page${props.page.number}`"
          slot-scope="props"
          :page="props.page"
          :to="`/${pagination.source}/?page=${props.page.number}`"
          tag="router-link"
        >
          {{ props.page.number }}
        </b-pagination-button>
        <b-pagination-button
          slot="previous"
          slot-scope="props"
          :page="props.page"
          tag="router-link"
          :to="`/${pagination.source}/?page=${props.page.number}`"
        >
          <b-icon icon="chevron-left"></b-icon>
        </b-pagination-button>

        <b-pagination-button
          slot="next"
          slot-scope="props"
          :page="props.page"
          tag="router-link"
          :to="`/${pagination.source}/?page=${props.page.number}`"
        >
          <b-icon icon="chevron-right"></b-icon>
        </b-pagination-button>
      </b-pagination>
    </div>
  </section>
</template>
<script>
import LinkResolver from '~/plugins/link-resolver.js';
export default {
  name: 'GridPosts',
  props: {
    posts: {
      type: Array,
      default: () => []
    },
    pagination: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    LinkResolverF(post) {
      return LinkResolver(post);
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
  padding: 30px 0;
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
