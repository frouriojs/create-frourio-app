import styles from '~/styles/TerminalConsole.module.css'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { default as AnsiUp } from 'ansi_up'
const ansi_up = new AnsiUp()
ansi_up.use_classes = true

const scrollToBottom = (el: HTMLElement) => {
  el.scrollTo(0, el.scrollHeight)
}

export interface TerminalConsoleProps {
  log?: string
  rounded?: boolean
}

const TerminalConsole: FC<TerminalConsoleProps> = ({ log: log0, rounded }) => {
  const [log, setLog] = useState('')
  const markUpLog = useMemo(() => ansi_up.ansi_to_html(log ?? ''), [log])
  const [autoscroll, setAutoscroll] = useState(true)
  const ref = useRef<HTMLPreElement | null>(null)

  if (log !== log0) {
    if (ref.current) {
      setAutoscroll(
        ref.current.offsetHeight + ref.current.scrollTop >
          ref.current.scrollHeight - 20
      )
    }
    setLog(log0 ?? '')
  }

  useEffect(() => {
    if (ref.current && autoscroll) {
      scrollToBottom(ref.current)
    }
  }, [log])

  return (
    <pre
      ref={ref}
      className={`${styles.container} ${rounded ? styles.rounded : ''}`}
      dangerouslySetInnerHTML={{ __html: markUpLog }}
    />
  )
}

export default TerminalConsole
