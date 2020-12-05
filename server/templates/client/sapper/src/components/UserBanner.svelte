<script lang="ts">
	import type { UserInfo } from '$/types'
	import { apiClient } from '../utils/apiClient'

	let isLoggedIn = false
  let userInfo = {} as UserInfo
	let token = ''

	const editIcon = async (e: Event) => {
		const { files } = e.currentTarget as HTMLInputElement

		if (!files?.length) return

		userInfo = await apiClient.user.$post({
			headers: { authorization: token },
			body: { icon: files[0] }
		})
	}

	const login = async () => {
		const id = prompt('Enter the user id (See server/.env)')
		const pass = prompt('Enter the user pass (See server/.env)')
		if (!id || !pass) return alert('Login failed')

		try {
			token = `Bearer ${
				(await apiClient.token.$post({ body: { id, pass } })).token
			}`
		} catch (e) {
			return alert('Login failed')
		}

		userInfo = await apiClient.user.$get({
			headers: { authorization: token }
		})
		isLoggedIn = true
	}

	const logout = () => {
		token = ''
		isLoggedIn = false
	}
</script>

<style>
	.user-banner {
		position: fixed;
		top: 0;
		right: 0;
		padding: 15px;
	}
	
	.user-icon {
		width: 32px;
		height: 32px;
		background: #ddd;
		vertical-align: bottom;
	}
</style>

<div class="user-banner">
	{#if isLoggedIn }
		<img src={userInfo.icon} class="user-icon" alt="user icon" />
		<span>{userInfo.name}</span>
		<input type="file" accept="image/*" on:change={editIcon} />
		<button on:click={logout}>LOGOUT</button>
	{:else}
	<button on:click={login}>LOGIN</button>
	{/if}
</div>
