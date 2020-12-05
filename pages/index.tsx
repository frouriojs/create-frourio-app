import Head from 'next/head'
import { useCallback, useState, useMemo } from 'react'
import useAspidaSWR from '@aspida/swr'
import axios from 'axios'
import GitHubButton from '~/components/react-github-btn'
import styles from '~/styles/Home.module.css'
import { apiClient } from '~/utils/apiClient'
import { Answers, initPrompts } from '$/common/prompts'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const waitInstalling = async () => {
  let serverPort = 0
  const href =
    process.env.ENV === 'development'
      ? `http://${location.hostname}:3001`
      : location.origin

  try {
    // eslint-disable-next-line
    while (true) {
      await sleep(1000)
      const res = await apiClient.status.$get({ config: { timeout: 3000 } })
      serverPort = res.serverPort
    }
  } catch (e) {
    // eslint-disable-next-line
    while (true) {
      await sleep(1000)
      try {
        await Promise.all([
          axios.get(href, { timeout: 3000 }),
          axios.get(`http://${location.hostname}:${serverPort}/api/tasks`, {
            timeout: 3000
          })
        ])
        location.href = href
        // eslint-disable-next-line
      } catch (e) {}
    }
  }
}

const Home = () => {
  const { data, error } = useAspidaSWR(apiClient.answers)
  const { data: serverStatus, mutate: setServerStatus } = useAspidaSWR(
    apiClient.status
  )
  const [answers, setAnswers] = useState<Answers | undefined>()
  const [created, setCreated] = useState(false)
  const questions = useMemo(() => answers && initPrompts(answers), [answers])
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

    await apiClient.answers.$patch({ body: answers })

    setServerStatus()
    setCreated(true)
    waitInstalling()
  }, [answers, canCreate])

  if (error) return <div>failed to load</div>
  if (data && !answers) setAnswers(data)
  if (!answers || !serverStatus || !questions) return <div>loading...</div>
  if (serverStatus.status === 'installing' && !created) {
    setCreated(true)
    waitInstalling()
  }

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

      {serverStatus.status !== 'waiting' && (
        <div className={styles.installing}>
          <div>
            <div className={styles.installingTitle}>
              Installing and start project on terminal...
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
