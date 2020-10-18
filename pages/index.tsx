import Head from 'next/head'
import { useCallback, useState, useMemo } from 'react'
import useAspidaSWR from '@aspida/swr'
import axios from 'axios'
import GitHubButton from 'react-github-btn'
import styles from '~/styles/Home.module.css'
import { apiClient } from '~/utils/apiClient'
import { Answers, initPrompts } from '$/common/prompts'
import { STATUS } from '$/common/types'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const Home = () => {
  const { data: info, error } = useAspidaSWR(apiClient.info)
  const [answers, setAnswers] = useState<Answers | undefined>()
  const [serverStatus, setServerStatus] = useState<STATUS>('waiting')
  const prompts = useMemo(() => (info ? initPrompts(info.editors) : null), [
    info
  ])
  const questions = useMemo(() => answers && prompts?.(answers), [
    prompts,
    answers
  ])
  const canCreate = useMemo(
    () =>
      questions?.every(
        (q) => q.type !== 'input' || (answers?.[q.name] ?? q.default)
      ),
    [questions, answers]
  )
  const choice = useCallback(
    (name: keyof Answers, val: string) =>
      setAnswers({ ...answers, [name]: val }),
    [answers]
  )
  const create = useCallback(async () => {
    if (!canCreate || !answers) return

    setServerStatus('installing')

    const { frontPort } = await apiClient.info.$patch({ body: { answers } })
    const href = `http://${location.hostname}:${frontPort}`

    try {
      // eslint-disable-next-line
      while (true) {
        await sleep(1000)
        await apiClient.status.$get()
      }
    } catch (e) {
      // eslint-disable-next-line
      while (true) {
        await sleep(1000)
        try {
          await axios.get(href)
          location.href = href
          // eslint-disable-next-line
        } catch (e) {}
      }
    }
  }, [answers, canCreate])

  if (error) return <div>failed to load</div>
  if (info && !answers) setAnswers(info.answers)
  if (!answers || !questions) return <div>loading...</div>

  return (
    <>
      <Head>
        <title>create-frourio-app</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <img src="/images/logo.svg" alt="Frourio Logo" className={styles.logo} />

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to{' '}
          <a href="https://github.com/frouriojs/frourio" target="_brank">
            frourio!
          </a>
        </h1>

        <p className={styles.description}>create-frourio-app</p>

        {questions.map((question) => (
          <div key={question.name} className={styles.card}>
            <div className={styles.message}>{question.message}</div>
            <div className={styles.ctrls}>
              {question.type === 'input' ? (
                <input
                  type="text"
                  value={answers[question.name] ?? question.default ?? ''}
                  onChange={(e) => choice(question.name, e.target.value)}
                />
              ) : (
                question.choices.map((c, i) => (
                  <div
                    key={i}
                    className={`${styles.btn}${
                      (answers[question.name] ?? question.default) === c.value
                        ? ` ${styles.active}`
                        : ''
                    }`}
                    onClick={() => choice(question.name, c.value)}
                  >
                    <div className={styles.radioIcon} />
                    <div>{c.name}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </main>

      <div
        className={`${styles.createBtn}${
          canCreate ? '' : ` ${styles.disabled}`
        }`}
        onClick={create}
      >
        Create
      </div>

      <div className={styles.contribution}>
        <img src="/images/contribution.svg" alt="contribution" />
        <div>
          Can you align the center line shift?
          <br />
          Contribute to{' '}
          <a
            href="https://github.com/frouriojs/create-frourio-app"
            target="_brank"
            title="frouriojs/create-frourio-app"
          >
            GitHub
          </a>{' '}
          in React.js
        </div>
      </div>

      {serverStatus !== 'waiting' && (
        <div className={styles.installing}>
          <div>
            <div className={styles.installingTitle}>
              Installing and start project on tarminal...
            </div>
            <div className={styles.installingDesc}>
              Please do not close the browser until it automatically changes to
              this screen.
            </div>
            <div className={styles.star}>
              <img src="/images/star.svg" alt="star" />
              <div>
                <div className={styles.starDesc}>
                  Do you like frourio?
                  <br />
                  I&apos;d love it if you starred!
                </div>
                <GitHubButton
                  href="https://github.com/frouriojs/frourio"
                  data-icon="octicon-star"
                  data-size="large"
                  data-show-count={true}
                  aria-label="Star frouriojs/frourio on GitHub"
                >
                  Star
                </GitHubButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Home
