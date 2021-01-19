import React, { FC } from 'react'
import { Answers, DeterminedPrompt, Text } from '~/server/common/prompts'
import { Flipped, spring } from 'react-flip-toolkit'
import styles from '~/styles/Question.module.css'
import ReactMarkdown from 'react-markdown'
import hash from 'object-hash'

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
}

const Question: FC<QuestionProps> = ({ answers, question, onChoice }) => {
  const show = (text: Text) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <ReactMarkdown linkTarget="_brank">{text.en}</ReactMarkdown>
  }
  return (
    <div className={styles.card}>
      {(() => {
        if (question.type === 'input') {
          return (
            <Flipped
              flipId={`question-${question.name}`}
              onAppear={onElementAppear}
              stagger
            >
              <div>
                <div
                  className={`${styles.message} ${
                    question.valid ?? answers[question.name] ? '' : styles.error
                  }`}
                >
                  {question.message}
                </div>
                <div className={styles.ctrls}>
                  <input
                    type="text"
                    value={answers[question.name] ?? ''}
                    onChange={(e) => onChoice?.(question.name, e.target.value)}
                  />
                </div>
              </div>
            </Flipped>
          )
        } else {
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
                      question.valid ?? !chosen.disabled ? '' : styles.error
                    }`}
                  >
                    {question.message}
                  </div>
                  <div className={styles.ctrls}>
                    {question.choices.map((c, i) => (
                      <div
                        key={i}
                        className={`${styles.btn}${
                          (answers[question.name] ?? question.default) ===
                          c.value
                            ? ` ${styles.active}`
                            : ''
                        }${c.disabled ? ` ${styles.disabled}` : ''}`}
                        onClick={() =>
                          c.disabled || onChoice?.(question.name, c.value)
                        }
                      >
                        <div className={styles.radioIcon} />
                        <div>{c.name}</div>
                        {c.disabled && (
                          <div className={styles.hint}>{show(c.disabled)}</div>
                        )}
                      </div>
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
                  >
                    {show(note.text)}
                  </div>
                </Flipped>
              ))}
            </>
          )
        }
      })()}
    </div>
  )
}

export default Question
