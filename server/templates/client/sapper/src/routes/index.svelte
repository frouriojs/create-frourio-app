<script lang="ts">
	import type { Task } from '<%= orm === "prisma" ? "$prisma/client" : "$/types" %>'
	import { apiClient } from '../utils/apiClient'
	import UserBanner from '../components/UserBanner.svelte';
	import successkid from 'images/successkid.jpg';

	let tasks: Task[] = []
	let newLabel = ''

	const fetchTasks = async () => {
		tasks = await apiClient.tasks.$get()
	}

	const onInput = (e: Event) => {
		newLabel= (e.currentTarget as HTMLInputElement).value
	}

  const createTask = async () => {
		if (!newLabel) return

		await apiClient.tasks.post({ body: { label: newLabel } })
		newLabel = ''
		await fetchTasks()
	}
	
  const toggleDone = async (task: Task) => {
		await apiClient.tasks
			._taskId(task.id)
			.patch({ body: { done: !task.done } })
		await fetchTasks()
	}
	
  const deleteTask = async (task: Task) => {
		await apiClient.tasks._taskId(task.id).delete()
		await fetchTasks()
	}
</script>

<style>
	h1, figure, p {
		text-align: center;
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		text-transform: uppercase;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	figure {
		margin: 0 0 1em 0;
	}

	img {
		width: 100%;
		max-width: 400px;
		margin: 0 0 1em 0;
	}

	p {
		margin: 1em auto;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}

	form {
		text-align: center;
	}

	.tasks {
		width: 300px;
		padding: 0;
		margin: 20px auto 0;
		list-style-type: none;
		text-align: left;
	}

	.tasks > li {
		margin-top: 10px;
		border-bottom: 1px solid #eee;
	}
</style>

<svelte:head>
	<title>Sapper project template</title>
</svelte:head>

<UserBanner />

<h1>Great success!</h1>

<figure>
	<img alt="Success Kid" src="{successkid}">
	<figcaption>Have fun with Sapper!</figcaption>
</figure>

<p><strong>Try editing this file (src/routes/index.svelte) to test live reloading.</strong></p>

{#await fetchTasks()}
	<div />
{:then} 
<div>
	<form on:submit|preventDefault={createTask}>
		<input bind:value={newLabel} on:input={onInput} type="text" />
		<input type="submit" value="ADD" />
	</form>
	<ul class="tasks">
		{#each tasks as task}
		<li>
			<label>
				<input
					type="checkbox"
					checked={task.done}
					on:change={() => toggleDone(task)}
				/>
				<span>{task.label}</span>
			</label>
			<input
				type="button"
				value="DELETE"
				style="float: right"
				on:click={() => deleteTask(task)}
			/>
		</li>
		{/each}
	</ul>
</div>
{/await}
