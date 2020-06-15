import Head from 'next/head'
import { useCallback, useState, FormEvent, ChangeEvent } from 'react'
import { apiClient } from '~/utils/apiClient'
import { Task } from '~/server/types'
import UserBanner from '~/components/UserBanner'

type Props = {
  tasks: Task[]
}

const Home = (props: Props) => {
  const [label, setLabel] = useState('')
  const [tasks, setTasks] = useState(props.tasks)

  const inputLavel = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setLabel(e.target.value),
    []
  )

  const createTask = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      if (!label) return

      await apiClient.tasks.post({ body: { label } })
      setLabel('')
      setTasks(await apiClient.tasks.$get())
    },
    [label]
  )

  const toggleDone = useCallback(async (task: Task) => {
    await apiClient.tasks._taskId(task.id).patch({ body: { done: !task.done } })
    setTasks(await apiClient.tasks.$get())
  }, [])

  const removeTask = useCallback(async (task: Task) => {
    await apiClient.tasks._taskId(task.id).delete()
    setTasks(await apiClient.tasks.$get())
  }, [])

  return (
    <div className="container">
      <Head>
        <title>frourio-todo-app</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <UserBanner />

        <h1 className="title">
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className="description">frourio-todo-app</p>

        <div>
          <form style={{ textAlign: 'center' }} onSubmit={createTask}>
            <input value={label} type="text" onChange={inputLavel} />
            <input type="submit" value="ADD" />
          </form>
          <ul className="tasks">
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
                  onClick={() => removeTask(task)}
                />
              </li>
            ))}
          </ul>
        </div>
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className="logo" />
        </a>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        .logo {
          height: 1em;
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
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}

Home.getInitialProps = async () => ({
  tasks: await apiClient.tasks.$get()
})

export default Home
