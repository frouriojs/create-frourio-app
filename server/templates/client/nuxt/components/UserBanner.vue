<template>
  <div class="user-banner">
    <template v-if="isLoggedIn">
      <img :src="userInfo.icon" class="user-icon" />
      <span>{{ userInfo.name }}</span>
      <input type="file" accept="image/*" @change="editIcon" />
      <button @click="logout">LOGOUT</button>
    </template>
    <button v-else @click="login">LOGIN</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { UserInfo } from '$/types'

export default Vue.extend({
  data() {
    return {
      isLoggedIn: false,
      userInfo: {} as UserInfo,
      token: ''
    }
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
    }
  }
})
</script>

<style scoped>
.user-banner {
  position: fixed;
  top: 0;
  right: 0;
  padding: 20px;
}

.user-icon {
  width: 32px;
  height: 32px;
  background: #ddd;
  vertical-align: bottom;
}
</style>
