<template>
  <div>
    <nav class="navbar is-danger" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <nuxt-link :to="{ name: 'index' }" class="navbar-item">
          <b>Blog.veda</b>
        </nuxt-link>
        <a
          role="button"
          class="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navMenu"
          :class="{ 'is-active': isOpen }"
          @click="isOpen = !isOpen"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div id="navMenu" :class="{ 'is-active': isOpen }" class="navbar-menu navbar-end">
        <nuxt-link :to="{ name: 'index' }" class="navbar-item">Home</nuxt-link>
        <nuxt-link :to="{ name: 'blog' }" class="navbar-item">Blog</nuxt-link>
      </div>
    </nav>
    <transition name="fade">
      <nuxt />
    </transition>
    <footer class="footer">
      <div class="content has-text-centered">
        <p><strong>Blog</strong> by <a href="https://veda.com.br">Dina</a>.</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false
    };
  },
  watch: {
    '$route.name'() {
      this.isOpen = false;
    }
  }
};
</script>

<style lang="scss">
@include desktop() {
  body {
    background-color: #ebebeb;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active em versões anteriores a 2.1.8 */ {
  opacity: 0;
}
</style>
