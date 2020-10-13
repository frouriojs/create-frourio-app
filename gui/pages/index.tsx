import Head from 'next/head'
import { useCallback, useState, FormEvent, ChangeEvent } from 'react'
import useAspidaSWR from '@aspida/swr'
import styles from '~/styles/Home.module.css'
import { apiClient } from '~/utils/apiClient'
import { prompts } from '$/common/prompts'

const Home = () => {
  const { data: tasks, error, mutate: setTasks } = useAspidaSWR(apiClient.tasks)
  const [answers] = useState<Record<string, string>>({})
  const questions = prompts('test-next', answers)

  if (error) return <div>failed to load</div>
  if (!tasks) return <div>loading...</div>

  return (
    <div className={styles.container}>
      <Head>
        <title>frourio-todo-app</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <img src="/images/logo.svg" alt="Frourio Logo" className={styles.frourio} />

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://github.com/frouriojs/frourio">frourio!</a>
        </h1>

        <p className={styles.description}>create-frourio-app</p>

        {
          questions.map(question => (
            <div key={question.name}>
              <div>{question.message}</div>
              {question.type === 'input' ? <input type="text" /> : question.choices.map(c => <div>{c.label}</div>)}
            </div>
          ))
        }
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}

export default Home
