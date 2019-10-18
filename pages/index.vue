<template>
  <div class="container">
    <div>
      <h1 class="title">
        {{ $prismic.richTextAsPlain(document.title) }}
      </h1>
    </div>
  </div>
</template>

<script>
import { getApi } from '~/utils';

async function getPage(options = {}) {
  const api = await getApi(options);
  return api.getSingle('home');
}

export default {
  components: {},
  data() {
    return {
      document: null,
      documentId: null
    };
  },
  async asyncData({ error }) {
    try {
      const result = await getPage();

      // Load the edit button
      if (process.client) window.prismic.setupEditButton();

      return {
        document: result.data,
        documentId: result.id
      };
    } catch (e) {
      error({ statusCode: 404, message: 'Page not found :(' });
    }
  },
  created() {
    //
  },
  head() {
    return {
      title: 'My awesome blog!'
    };
  }
};
</script>

<style scoped>
.container {
  margin: 0 auto;
  min-height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
    Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 48px;
  color: #35495e;
  letter-spacing: 1px;
}
</style>
