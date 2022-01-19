<template>
  <div>
    <user-banner />
    <div class="container">
      <div>
        <h1>{{ article.title }}</h1>
        <div class="body">
          <p>{{ article.body }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import UserBanner from '~/components/UserBanner.vue'

export default Vue.extend({
  components: {
    UserBanner
  },
  async asyncData({ app, params, error }) {
    const article = await app.$api.article
      ._articleId(Number.parseInt(params.id, 10))
      .$get()
      .catch(() => {
        error({ statusCode: 404 })
      })
    return { article }
  }
})
</script>

<style scoped>
.container {
  margin: 0 auto;
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 100vh;
}

.body {
  margin-top: 30px;
}
</style>
