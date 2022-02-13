<template>
  <div>
    <user-banner />
    <div class="container">
      <div>
        <h1 class="title">Aricles</h1>
        <div class="articles-wrap">
          <ul>
            <li v-for="article in articles" :key="article.id" class="article">
              <NuxtLink :to="$pagesPath.article._id(article.id).$url()">{{
                article.title
              }}</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ArticleInfo } from '../../server/service/article'
import UserBanner from '~/components/UserBanner.vue'

export type OptionalQuery = {
  search?: string
}

export default Vue.extend({
  components: {
    UserBanner
  },
  data() {
    return {
      articles: [] as ArticleInfo[]
    }
  },
  async fetch() {
    await this.fetchArticles()
  },
  watch: {
    $route() {
      this.fetchArticles()
    }
  },
  methods: {
    async fetchArticles() {
      const { search } = this.$route.query
      this.articles = await this.$api.article.$get({
        query: {
          search: typeof search === 'string' ? search : undefined
        }
      })
    }
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

.title {
  display: block;
  font-size: 50px;
  letter-spacing: 2px;
  text-align: center;
}

.articles-wrap {
  margin-top: 30px;
}

.article {
  margin-top: 10px;
}

.article > a {
  text-decoration: none;
  color: black;
}
</style>
