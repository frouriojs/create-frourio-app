<template>
  <div class="user-banner">
    <div class="navs">
      <NuxtLink :to="$pagesPath.$url()" class="nav">Home</NuxtLink>
      <NuxtLink :to="$pagesPath.article.$url()" class="nav">Article</NuxtLink>
      <form @submit="submit">
        <input :value="search" @change="changeSearch" />
        <button type="submit">search</button>
      </form>
      <img class="logo" :src="$staticPath.favicon_png" />
    </div>
    <div>
      <template v-if="isLoggedIn">
        <img :src="userInfo.icon" class="user-icon" />
        <span>{{ userInfo.name }}</span>
        <input type="file" accept="image/*" @change="editIcon" />
        <button @click="logout">LOGOUT</button>
      </template>
      <button v-else @click="login">LOGIN</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { UserInfo } from '$/types'

export default Vue.extend({
  data() {
    return {
      isLoggedIn: false,
      userInfo: {} as UserInfo,
      token: '',
      search: '',
    }
  },
  fetch() {
    this.search =
      typeof this.$route.query.search === 'string'
        ? this.$route.query.search
        : ''
  },
  methods: {
    async editIcon(e: { target: HTMLInputElement }) {
      if (!e.target?.files?.length) return

      this.userInfo = await this.$api.user.$post({
        headers: { authorization: this.token },
        body: { icon: e.target.files[0] }
      })
    },
    async login() {
      const id = prompt('Enter the user id (See server/.env)')
      const pass = prompt('Enter the user pass (See server/.env)')
      if (!id || !pass) return alert('Login failed')

      try {
        this.token = `Bearer ${
          (await this.$api.token.$post({ body: { id, pass } })).token
        }`
      } catch (e) {
        return alert('Login failed')
      }

      this.userInfo = await this.$api.user.$get({
        headers: { authorization: this.token }
      })
      this.isLoggedIn = true
    },
    logout() {
      this.token = ''
      this.isLoggedIn = false
    },
    changeSearch(event: Event) {
      if (event.target instanceof HTMLInputElement) {
        this.search = event.target.value
      }
    },
    submit(event: Event) {
      event.preventDefault()
      this.$router.push(
        this.$pagesPath.article.$url({ query: { search: this.search } })
      )
    }
  }
})
</script>

<style scoped>
.logo {
  margin-left: 5px;
  width: 30px;
  height: 30px;
}

.user-icon {
  width: 32px;
  height: 32px;
  background: #ddd;
  vertical-align: bottom;
}

.user-banner {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  width: 100%;
  position: fixed;
  align-items: center;
}

.navs {
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav {
  padding: 8px;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
  text-decoration: none;
  color: black;
}

.nav:hover {
  border-bottom: 3px solid #000;
}
</style>
