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
import { getApi } from "~/utils"
import PrismicConfig from "~/prismic.config.js"

async function getPage(options = {}) {
  const api = await getApi(options);
  return api.getSingle('home');
}

export default {
  components: {
    
  },
  created() {
    //this.refetchPageForPreview();
  },
  data() {
    return {
      document: null,
      documentId: null,
    };
  },
  //methods: {
    // async fetch() {
    //   const result = await getPage();
    //   this.document = result.data
    //   this.documentId = result.id
    // },
  //},
  head() {
    return {
      title: 'My awesome blog!'
    }
  },
  async asyncData({ context, error, req }) {
    
    try {
      const result = await getPage();

      // Load the edit button
      if (process.client) window.prismic.setupEditButton()
    
      return {
        document: result.data,
        documentId: result.id,
      }
    
    } catch (e) {
      error({ statusCode: 404, message: 'Page not found :(' })
    }
	
  }
}
</script>

<style scoped>
.container {
  margin: 0 auto;
  min-height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 48px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
