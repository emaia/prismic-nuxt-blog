<template>
  <div class="container">
    <header>
      <img :src="post.data.image.url" alt="Imagem" />
    </header>

    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            {{ $prismic.richTextAsPlain(post.data.title) }}
          </h1>
          <p class="subtitle"></p>
          <p>Postado em {{ formattedDate(post.data.date) }}.</p>
        </div>
      </div>
    </section>

    <article class="content">
      <prismic-rich-text :field="post.data.content" />
      <div class="bottom-link">
        <nuxt-link :to="{ name: 'blog' }" class="button is-link is-fullwidth">
          Voltar para o blog
        </nuxt-link>
      </div>
    </article>
  </div>
</template>
<script>
import { getApi } from '~/utils';

async function getPost(options = {}) {
  const api = await getApi(options);
  const uid = options.params.uid ? options.params.uid : $route.params.uid;
  return await api.getByUID('posts', uid);
}

export default {
  head() {
    return {
      title: this.title || ''
    };
  },
  data() {
    return {
      title: '',
      post: {}
    };
  },
  async asyncData({ params, error, req }) {
    try {
      // Query to get posts content to preview
      const post = await getPost({ req, params });

      return {
        title: post.data.title[0].text + ' | ' + process.env.npm_package_name,
        post
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
    formattedDate(date) {
      return Intl.DateTimeFormat('pt-BR', { year: 'numeric', month: 'long', day: '2-digit' }).format(new Date(date));
    }
  }
};
</script>

<style lang="scss" scoped>
header {
  @include desktop {
    margin-top: 30px;
  }
}
.content {
  padding: 0 24px 20px;
  margin-bottom: 50px;
  @include desktop {
    padding: 0 0 50px;
    margin-bottom: 80px;
  }
  .bottom-link {
    padding-top: 30px;
  }
}
</style>
