import Head from 'next/head'
import { useCallback, <% if (reactHooks === 'none') { %>useEffect, <% } %>useState } from 'react'<% if (reactHooks === 'swr') { %>
import useAspidaSWR from '@aspida/swr'<% } else if (reactHooks === 'query') { %>
import { useQueryClient } from 'react-query'
import { useAspidaQuery } from '@aspida/react-query'<% } %>
import styles from '~/styles/Home.module.css'
import { apiClient } from '~/utils/apiClient'
import type { Task } from '<%= orm === "prisma" ? "$prisma/client" : "$/types" %>'
import type { FormEvent, ChangeEvent } from 'react'
import Layout from '~/components/Layout'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  <% if (reactHooks === 'swr') { %>const { data: tasks, error, mutate } = useAspidaSWR(apiClient.tasks)<% } else if (reactHooks === 'query') { %>const queryClient = useQueryClient()
  const { data: tasks, error } = useAspidaQuery(apiClient.tasks)<% } else { %>const [tasks, setTasks] = useState<Task[] | undefined>(undefined)<% } %>
  const [label, setLabel] = useState('')
  const inputLabel = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setLabel(e.target.value),
    []
  )<% if (reactHooks === 'query') { %>

  const invalidateTasks = useCallback(
    () => queryClient.invalidateQueries(apiClient.tasks.$path()),
    [queryClient]
  )<% } else if (reactHooks === 'none') { %>

  const fetchTasks = useCallback(async () => {
    setTasks(await apiClient.tasks.$get())
  }, [])<% } %>

  const createTask = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      if (!label) return

      await apiClient.tasks.post({ body: { label } })
      setLabel('')
      <% if (reactHooks === 'swr') { %>mutate<% } else if (reactHooks === 'query') { %>invalidateTasks<% } else { %>await fetchTasks<% } %>()
    },
    [label]
  )

  const toggleDone = useCallback(async (task: Task) => {
    await apiClient.tasks._taskId(task.id).patch({ body: { done: !task.done } })
    <% if (reactHooks === 'swr') { %>mutate<% } else if (reactHooks === 'query') { %>invalidateTasks<% } else { %>await fetchTasks<% } %>()
  }, [])

  const deleteTask = useCallback(async (task: Task) => {
    await apiClient.tasks._taskId(task.id).delete()
    <% if (reactHooks === 'swr') { %>mutate<% } else if (reactHooks === 'query') { %>invalidateTasks<% } else { %>await fetchTasks<% } %>()
  }, [])

  <% if (reactHooks === 'none') { %>useEffect(() => {
    fetchTasks()
  }, [])
<%  } else { %>if (error) return <div>failed to load</div><% } %>
  if (!tasks) return <div>loading...</div>

  return (
    <Layout>
      <Head>
        <title>frourio-todo-app</title>
      </Head>

      <h1 className={styles.title}>
        Welcome to <a href="https://nextjs.org">Next.js!</a>
      </h1>

      <p className={styles.description}>frourio-todo-app</p>

      <div>
        <form style={{ textAlign: 'center' }} onSubmit={createTask}>
          <input value={label} type="text" onChange={inputLabel} />
          <input type="submit" value="ADD" />
        </form>
        <ul className={styles.tasks}>
          {tasks.map((task) => (
            <li key={task.id}>
              <label>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleDone(task)}
                />
                <span>{task.label}</span>
              </label>
              <input
                type="button"
                value="DELETE"
                style={{ float: 'right' }}
                onClick={() => deleteTask(task)}
              />
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  )
}

export default Home
