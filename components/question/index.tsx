import React, { FC } from 'react'
import { Answers, DeterminedPrompt, Text } from '~/server/common/prompts'
import { Flipped, spring } from 'react-flip-toolkit'
import styles from '~/styles/Question.module.css'
import ReactMarkdown from 'react-markdown'
import hash from 'object-hash'

const show = (text: Text) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ReactMarkdown linkTarget="_brank">{text.en}</ReactMarkdown>
}

const onElementAppear = (el: HTMLElement, index: number) =>
  spring({
    onUpdate: (val) => {
      if (typeof val === 'number') {
        el.style.opacity = String(val)
      }
    },
    delay: index * 50
  })

export interface QuestionProps {
  answers: Answers
  question: DeterminedPrompt
  onChoice?: (name: keyof Answers, value: string) => void
  onTouch?: () => void
  touched: boolean
  addInfo?: unknown
  addError?: unknown
}

export interface QuestinoInputProps extends QuestionProps {
  question: DeterminedPrompt & { type: 'input' }
}

const QuestinoInput: FC<QuestinoInputProps> = ({
  answers,
  question,
  touched,
  onChoice,
  addError,
  onTouch
}) => {
  return (
    <Flipped
      flipId={`question-${question.name}`}
      onAppear={onElementAppear}
      stagger
    >
      <div>
        <div
          className={`${styles.message} ${
            (!(question.valid ?? answers[question.name]) ||
              typeof addError === 'string') &&
            touched
              ? styles.error
              : ''
          }`}
        >
          {question.message}
        </div>
        <div className={styles.ctrls}>
          <input
            type="text"
            value={answers[question.name] ?? ''}
            onChange={(e) => onChoice?.(question.name, e.target.value)}
            onFocus={() => onTouch?.()}
            onInput={() => onTouch?.()}
          />
        </div>
      </div>
    </Flipped>
  )
}

export interface QuestinoListProps extends QuestionProps {
  question: DeterminedPrompt & { type: 'list' }
}

const QuestinoList: FC<QuestinoListProps> = ({
  answers,
  question,
  touched,
  addError,
  onChoice
}) => {
  const chosen = question.choices.filter(
    (c) => c.value === answers[question.name]
  )[0]
  return (
    <>
      <Flipped
        flipId={`question-${question.name}`}
        onAppear={onElementAppear}
        stagger
      >
        <div>
          <div
            className={`${styles.message} ${
              (chosen.disabled || typeof addError === 'string') && touched
                ? styles.error
                : ''
            }`}
          >
            {question.message}
          </div>
          <div className={styles.ctrls}>
            {question.choices.map((c, i) => (
              <button
                key={i}
                className={`${styles.btn}${
                  (answers[question.name] ?? question.default) === c.value
                    ? ` ${styles.active}`
                    : ''
                }${c.disabled ? ` ${styles.disabled}` : ''}`}
                onClick={() => c.disabled || onChoice?.(question.name, c.value)}
              >
                <div className={styles.radioIcon} />
                <div>{c.name}</div>
                {c.disabled && (
                  <div className={styles.hint}>{show(c.disabled)}</div>
                )}
              </button>
            ))}
          </div>
        </div>
      </Flipped>
      {chosen?.notes?.map((note, i) => (
        <Flipped
          key={i}
          flipId={`note-${hash(note)}`}
          onAppear={onElementAppear}
          stagger
        >
          <div
            className={`${styles.note} ${styles[note.severity]}`}
            key={i}
            tabIndex={0}
          >
            {show(note.text)}
          </div>
        </Flipped>
      ))}
    </>
  )
}

const Question: FC<QuestionProps> = (props) => {
  const { question, addInfo, addError } = props
  return (
    <div className={styles.card}>
      {question.type === 'input' ? (
        <QuestinoInput {...props} question={question} />
      ) : (
        <QuestinoList {...props} question={question} />
      )}
      {([
        [addInfo, 'info'],
        [addError, 'error']
      ] as const).map(
        ([add, severity]) =>
          typeof add === 'string' && (
            <Flipped
              key={severity}
              flipId={`question-${question.name}-add-${severity}`}
              onAppear={onElementAppear}
              stagger
            >
              <div
                className={`${styles.note} ${styles[severity]}`}
                tabIndex={0}
              >
                {add}
              </div>
            </Flipped>
          )
      )}
    </div>
  )
}

export default Question
