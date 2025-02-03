import type { TemplateContext } from './template-context'

type PromptName = 'dir' | 'server' | 'aspida' | 'reactHooks'

export type Answers = Partial<Record<PromptName, string>>

export type Prompt = { name: PromptName; message: string } & (
  | { type: 'list'; choices: { name: string; value: string }[]; default: string }
  | { type: 'input'; default?: undefined }
)

export const cfaPrompts: Prompt[] = [
  {
    name: 'dir',
    message: 'Directory name (create new)',
    type: 'input'
  },
  {
    name: 'server',
    message: 'Server engine',
    type: 'list',
    choices: [
      { name: 'Fastify (5x faster)', value: 'fastify' },
      { name: 'Express', value: 'express' }
    ],
    default: 'fastify'
  },
  {
    name: 'aspida',
    message: 'HTTP client of aspida',
    choices: [
      { name: 'fetch', value: 'fetch' },
      { name: 'axios', value: 'axios' }
    ],
    type: 'list',
    default: 'fetch'
  },
  {
    name: 'reactHooks',
    message: 'React Hooks for data fetching',
    type: 'list',
    choices: [
      { name: 'SWR', value: 'swr' },
      { name: 'React Query', value: 'query' },
      { name: 'None', value: 'none' }
    ],
    default: 'swr'
  }
]

/* eslint-disable @typescript-eslint/no-explicit-any */
export const getAllDefaultAnswers = (): Answers => {
  const def: any = {}
  cfaPrompts.forEach((prompt) => (def[prompt.name] = prompt.default))
  return def
}

export const omitDefaults = (answers: Answers): Answers => {
  const res: any = { ...answers }
  const defs: any = getAllDefaultAnswers()
  for (const key in defs) {
    if (res[key] === defs[key]) delete res[key]
  }
  return res
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export const addAllUndefined = (answers: TemplateContext): TemplateContext => {
  const res = { ...answers }

  cfaPrompts.forEach((p) => {
    if (!(p.name in res)) res[p.name] = undefined
  })

  return res
}

export const isAnswersValid = (answers: Answers) => {
  return cfaPrompts.every((el): boolean => {
    switch (el.type) {
      case 'list':
        return true
      case 'input':
        return !!answers[el.name]
      default:
        throw new Error(el satisfies never)
    }
  })
}
