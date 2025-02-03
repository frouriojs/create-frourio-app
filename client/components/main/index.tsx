import Head from 'next/head'
import { createApiClient } from 'utils/apiClient'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import PrimaryButton from 'components/primary-button'
import TerminalConsole from 'components/terminal-console'
import Question from 'components/question'
import styles from 'styles/Home.module.css'
import questionStyles from 'styles/Question.module.css'
import { Flipped, Flipper } from 'react-flip-toolkit'
import hash from 'object-hash'
import { Answers, cfaPrompts, getAllDefaultAnswers, isAnswersValid } from 'common/prompts'
import { cmdEscapeSingleInput, shellEscapeSingleInput } from 'common/escape'
import { ServerStatus } from 'api/status'
import { LocalPathInfo } from 'api/localPath'
import CommandInput from 'components/command-input'

export interface MainProps {
  serverStatus?: ServerStatus
  mutate?: () => void
  useServer?: boolean
}

const Main: FC<MainProps> = ({ serverStatus, mutate, useServer }) => {
  const [touched, setTouched] = useState<true | { [key: string]: true }>({})
  const [answers, setAnswers] = useState<Answers | undefined>()
  const [created, setCreated] = useState(false)
  const [log, setLog] = useState('')
  const [closedOverlay, setClosedOverlay] = useState(false)
  const [ready, setReady] = useState(false)
  const [localPathInfo, setLocalPathInfo] = useState<LocalPathInfo | undefined>()
  const [localPathInfoFetching, setlocalPathInfoFetching] = useState(true)

  const { clientPort } = serverStatus ?? {}
  const { dir } = answers ?? {}
  const devUrl = clientPort && `http://localhost:${clientPort}`

  // NOTE: WebSocket effects depend nothing to prevent losting notification while re-creating.

  useEffect(() => {
    if (useServer) {
      let log1 = ''
      const ws = new WebSocket(`ws://${location.host}/ws/`)
      ws.onmessage = async (ev) => {
        const dat = ev.data instanceof Blob ? await ev.data.text() : String(ev.data)
        log1 += dat
        setLog(log1)
      }
      return () => ws.close()
    }
  }, [])

  useEffect(() => {
    if (useServer) {
      const ws = new WebSocket(`ws://${location.host}/ws/ready/`)
      let text = ''
      ws.onmessage = async (ev) => {
        const dat = ev.data instanceof Blob ? await ev.data.text() : String(ev.data)
        text += dat
        if (dat && text.startsWith('ready')) {
          setReady(true)
        }
      }
      return () => ws.close()
    }
  }, [])

  const canCreate = useMemo(() => answers && isAnswersValid(answers), [answers])
  const choice = useCallback(
    (name: keyof Answers, val: string) =>
      setAnswers({ ...getAllDefaultAnswers(), ...answers, [name]: val }),
    [answers]
  )

  const isClientSide = typeof window !== 'undefined'
  const apiClient = useMemo(
    () => isClientSide && useServer && createApiClient(),
    [isClientSide, useServer]
  )

  if (useServer && apiClient) {
    apiClient.answers.get().then((prevAnswers) => {
      if (!answers) {
        setAnswers({ ...getAllDefaultAnswers(), ...prevAnswers.body })
      }
    })
  }

  const create = useCallback(async () => {
    setTouched(true)
    if (!apiClient || !canCreate || !answers) {
      alert('Cannot proceed because conditions are not met. Please review your configurations.')
      return
    }

    const info = await apiClient.localPath.$post({ body: { path: dir || '' } })

    setLocalPathInfo(info)
    setlocalPathInfoFetching(false)

    if (info.canContinue !== null) {
      alert(info.canContinue)
      return
    }

    await apiClient.answers.$patch({ body: answers })
    mutate?.()
    setCreated(true)
  }, [apiClient, answers, canCreate])

  if (!answers) setAnswers({ ...getAllDefaultAnswers() })
  if (serverStatus?.status === 'installing' && !created) {
    setCreated(true)
  }

  useEffect(() => {
    let canceled = false
    setlocalPathInfoFetching(true)
    if (typeof dir === 'string') {
      if (isClientSide && apiClient) {
        apiClient.localPath.$post({ body: { path: dir } }).then((info) => {
          if (!canceled) {
            setLocalPathInfo(info)
            setlocalPathInfoFetching(false)
          }
        })
      }
    } else {
      setLocalPathInfo(undefined)
    }
    return () => void (canceled = true)
  }, [dir, isClientSide, apiClient])

  return (
    <Flipper
      flipKey={`${closedOverlay ? 'closed:' : 'open:'}${hash(answers || {})}${hash(
        localPathInfo || {}
      )}`}
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
          {cfaPrompts.map(
            (question) =>
              answers && (
                <Question
                  key={question.name}
                  answers={answers}
                  question={question}
                  onChoice={choice}
                  touched={touched === true || (touched[question.name] ?? false)}
                  addError={question.name === 'dir' && localPathInfo?.canContinue}
                  addInfo={question.name === 'dir' && localPathInfo?.absPath}
                  onTouch={() => {
                    if (touched !== true) {
                      setTouched({
                        ...touched,
                        [question.name]: true
                      })
                    }
                  }}
                />
              )
          )}
        </div>
        {(!useServer || process.env.NODE_ENV === 'development') && (
          <Flipped flipId="manual-install" stagger>
            <>
              <div className={questionStyles.card}>
                <h4 className={questionStyles.message}>Shell</h4>
                <div className={questionStyles.ctrls}>
                  <CommandInput
                    value={
                      answers &&
                      `npm init frourio-app --answers ${shellEscapeSingleInput(
                        JSON.stringify(answers)
                      )}`
                    }
                  />
                </div>
              </div>
              <div className={questionStyles.card}>
                <h4 className={questionStyles.message}>Command Prompt</h4>
                <div className={questionStyles.ctrls}>
                  <CommandInput
                    value={
                      answers &&
                      `npm init frourio-app --answers ${cmdEscapeSingleInput(
                        JSON.stringify(answers)
                      )}`
                    }
                  />
                </div>
              </div>
            </>
          </Flipped>
        )}
        {closedOverlay && serverStatus?.status === 'installing' && (
          <Flipped flipId="flip-console" stagger>
            <div>
              <TerminalConsole log={log} rounded />
            </div>
          </Flipped>
        )}

        {serverStatus?.status === 'installing' && (
          <Flipped flipId="open-button" stagger>
            <div>
              <div style={{ marginTop: '16px' }}>
                <PrimaryButton
                  onClick={() => {
                    if (devUrl) {
                      window.open(devUrl, '_blank')
                    }
                  }}
                  disabled={!ready}
                >
                  Open {devUrl}
                </PrimaryButton>
              </div>
            </div>
          </Flipped>
        )}
      </main>

      {useServer && serverStatus?.status === 'waiting' && (
        <Flipped flipId="create-button" stagger>
          <div style={{ marginTop: '16px', paddingBottom: 32 }}>
            <PrimaryButton
              onClick={create}
              disabled={
                (!canCreate && touched === true) ||
                localPathInfoFetching ||
                localPathInfo?.canContinue !== null
              }
            >
              Create
            </PrimaryButton>
          </div>
        </Flipped>
      )}

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
            <PrimaryButton onClick={() => setClosedOverlay(true)}>Close</PrimaryButton>
          </div>
        </div>
      )}
    </Flipper>
  )
}

export default Main
