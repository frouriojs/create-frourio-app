import React, { FC } from 'react'
import { Answers, Prompt } from 'common/prompts'
import { Flipped, spring } from 'react-flip-toolkit'
import styles from 'styles/Question.module.css'

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
  question: Prompt
  onChoice?: (name: keyof Answers, value: string) => void
  onTouch?: () => void
  touched: boolean
  addInfo?: unknown
  addError?: unknown
}

export interface QuestionInputProps extends QuestionProps {
  question: Prompt & { type: 'input' }
}

const QuestionInput: FC<QuestionInputProps> = ({
  answers,
  question,
  touched,
  onChoice,
  addError,
  onTouch
}) => {
  return (
    <Flipped flipId={`question-${question.name}`} onAppear={onElementAppear} stagger>
      <div>
        <div
          className={`${styles.message} ${
            (!answers[question.name] || typeof addError === 'string') && touched ? styles.error : ''
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

export interface QuestionListProps extends QuestionProps {
  question: Prompt & { type: 'list' }
}

const QuestionList: FC<QuestionListProps> = ({
  answers,
  question,
  touched,
  addError,
  onChoice
}) => {
  return (
    <Flipped flipId={`question-${question.name}`} onAppear={onElementAppear} stagger>
      <div>
        <div
          className={`${styles.message} ${
            typeof addError === 'string' && touched ? styles.error : ''
          }`}
        >
          {question.message}
        </div>
        <div className={styles.ctrls}>
          {question.choices.map((c, i) => (
            <button
              key={i}
              className={`${styles.btn}${
                (answers[question.name] ?? question.default) === c.value ? ` ${styles.active}` : ''
              }`}
              onClick={() => onChoice?.(question.name, c.value)}
            >
              <div className={styles.radioIcon} />
              <div>{c.name}</div>
            </button>
          ))}
        </div>
      </div>
    </Flipped>
  )
}

const Question: FC<QuestionProps> = (props) => {
  const { question, addInfo, addError } = props
  return (
    <div className={styles.card}>
      {question.type === 'input' ? (
        <QuestionInput {...props} question={question} />
      ) : (
        <QuestionList {...props} question={question} />
      )}
      {(
        [
          [addInfo, 'info'],
          [addError, 'error']
        ] as const
      ).map(
        ([add, severity]) =>
          typeof add === 'string' && (
            <Flipped
              key={severity}
              flipId={`question-${question.name}-add-${severity}`}
              onAppear={onElementAppear}
              stagger
            >
              <div className={`${styles.note} ${styles[severity]}`} tabIndex={0}>
                {add}
              </div>
            </Flipped>
          )
      )}
    </div>
  )
}

export default Question
