import Head from 'next/head'
import { useCallback, useState, useMemo } from 'react'
import useAspidaSWR from '@aspida/swr'
import styles from '~/styles/Home.module.css'
import { apiClient } from '~/utils/apiClient'
import { Answers, initPrompts } from '$/common/prompts'

const Home = () => {
  const { data: info, error } = useAspidaSWR(apiClient.info)
  const [answers, setAnswers] = useState<Answers | undefined>()
  const prompts = useMemo(() => info ? initPrompts(info.editors) : null, [info])
  const questions = useMemo(() => answers && prompts?.(answers), [prompts, answers])
  const canCreate = useMemo(() => questions?.every(q => q.type !== 'input' || (answers?.[q.name] ?? q.default)), [questions, answers])
  const choice = useCallback((name: keyof Answers, val: string) => setAnswers({ ...answers, [name]: val }), [answers])
  const create = useCallback(() => answers && apiClient.info.$patch({ body: { answers }}), [answers])

  if (error) return <div>failed to load</div>
  if (info && !answers) setAnswers(info.answers)
  if (!answers || !questions) return <div>loading...</div>

  return (
    <>
      <Head>
        <title>frourio-todo-app</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <img src="/images/logo.svg" alt="Frourio Logo" className={styles.frourio} />

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://github.com/frouriojs/frourio" target="_brank">frourio!</a>
        </h1>

        <p className={styles.description}>create-frourio-app</p>

        {
          questions.map(question => (
            <div key={question.name} className={styles.card}>
              <div className={styles.message}>{question.message}</div>
              {question.type === 'input' ? <input type="text" value={answers[question.name] ?? question.default ?? ''}
                onChange={(e) => choice(question.name, e.target.value)}
              /> : question.choices.map((c, i) =>
                <div key={i} className={`${styles.btn}${(answers[question.name] ?? question.default) === c.value ? ` ${styles.active}` : ''}`}
                  onClick={() => choice(question.name, c.value)}
                >
                  <div className={styles.radioIcon} /><div>{c.name}</div>
                </div>
              )}
            </div>
          ))
        }
      </main>

      <footer className={styles.footer}>
        <button disabled={!canCreate} onClick={create}>Create</button>
      </footer>
    </>
  )
}

export default Home
