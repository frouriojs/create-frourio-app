import Head from 'next/head'
import { createApiClient } from '~/utils/apiClient'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import GitHubButton from '~/components/react-github-btn'
import PrimaryButton from '~/components/primary-button'
import TerminalConsole from '~/components/terminal-console'
import Question from '~/components/question'
import styles from '~/styles/Home.module.css'
import questionStyles from '~/styles/Question.module.css'
import { Flipped, Flipper } from 'react-flip-toolkit'
import hash from 'object-hash'
import { Answers, getAllDefaultAnswers, initPrompts } from '$/common/prompts'
import { shellEscapeSingleInput } from '$/utils/shell/escape'
import { ServerStatus } from '~/server/api/status'

const Credits = () => {
  return (
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
  )
}

export interface MainProps {
  serverStatus?: ServerStatus
  revalidate?: () => void
  useLocalNetwork?: boolean
}

const Main: FC<MainProps> = ({ serverStatus, revalidate, useLocalNetwork }) => {
  const [answers, setAnswers] = useState<Answers | undefined>()
  const [created, setCreated] = useState(false)
  const [log, setLog] = useState('')
  const [closedOverlay, setClosedOverlay] = useState(false)

  useEffect(() => {
    if (useLocalNetwork ?? false) {
      let log1 = ''
      const ws = new WebSocket(`ws://${location.host}/ws/`)
      ws.onmessage = async (ev) => {
        const dat = await (ev.data as Blob).text()
        log1 += dat
        setLog(log1)
      }
      return () => ws.close()
    }
  }, [useLocalNetwork])

  const questions = useMemo(() => answers && initPrompts(answers), [answers])
  const canCreate = useMemo(() => {
    return questions?.every((q) => {
      switch (q.type) {
        case 'input':
          return answers?.[q.name] ?? q.default
        case 'list':
          return !q.choices.filter((c) => c.value === answers?.[q.name])[0]
            ?.disabled
      }
    })
  }, [questions, answers])
  const choice = useCallback(
    (name: keyof Answers, val: string) =>
      setAnswers({ ...getAllDefaultAnswers(), ...answers, [name]: val }),
    [answers]
  )

  const apiClient = useMemo(() => useLocalNetwork && createApiClient(), [
    useLocalNetwork
  ])

  const create = useCallback(async () => {
    if (!apiClient) return
    if (!canCreate || !answers) return
    const db = await apiClient.dbConnection.$post({ body: answers })
    if (!db.enabled) {
      return alert(`Failed to connect to database:\n\n${db.err}`)
    }

    await apiClient.answers.$patch({ body: answers })
    revalidate?.()
    setCreated(true)
  }, [answers, canCreate])

  if (!answers) setAnswers({ ...getAllDefaultAnswers() })
  if (serverStatus?.status === 'installing' && !created) {
    setCreated(true)
  }

  const devUrl = `http://localhost:${serverStatus?.clientPort}`

  return (
    <Flipper
      flipKey={`${closedOverlay ? 'closed:' : 'open:'}${hash(answers || {})}`}
    >
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

        <div>
          {questions?.map(
            (question) =>
              answers && (
                <Question
                  key={question.name}
                  answers={answers}
                  question={question}
                  onChoice={choice}
                />
              )
          )}
        </div>
        {process.env.NODE_ENV === 'development' && (
          <div className={questionStyles.ctrls}>
            <input
              style={{ width: '100%' }}
              type="text"
              value={
                answers &&
                `${
                  process.env.NODE_ENV === 'development'
                    ? 'node ./bin/index.js'
                    : answers.pm === 'yarn'
                    ? 'yarn create frourio-app'
                    : 'npm init frourio-app'
                } --answers ${shellEscapeSingleInput(JSON.stringify(answers))}`
              }
              readOnly
            />
          </div>
        )}
        {closedOverlay && serverStatus?.status === 'installing' && (
          <Flipped flipId="flip-console">
            <div>
              <TerminalConsole log={log} rounded />
            </div>
          </Flipped>
        )}

        {serverStatus?.status === 'installing' && (
          <div style={{ marginTop: '16px' }}>
            <PrimaryButton>Open {devUrl}</PrimaryButton>
          </div>
        )}

        {closedOverlay && serverStatus?.status === 'installing' && (
          <Flipped flipId="credits">
            <div>
              <Credits />
            </div>
          </Flipped>
        )}
      </main>

      {useLocalNetwork && serverStatus?.status === 'waiting' && (
        <Flipped flipId="create-button" stagger>
          <div style={{ marginTop: '16px' }}>
            <PrimaryButton onClick={create} disabled={!canCreate}>
              Create
            </PrimaryButton>
          </div>
        </Flipped>
      )}

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

      {!closedOverlay && serverStatus?.status === 'installing' && (
        <div className={styles.installing}>
          <div>
            <div className={styles.installingTitle}>
              Installing and start project on terminal...
            </div>
            <Flipped flipId="flip-console">
              <div>
                <TerminalConsole log={log} />
              </div>
            </Flipped>
            <PrimaryButton onClick={() => setClosedOverlay(true)}>
              Close
            </PrimaryButton>
            <Flipped flipId="credits">
              <div>
                <Credits />
              </div>
            </Flipped>
          </div>
        </div>
      )}
    </Flipper>
  )
}

export default Main
