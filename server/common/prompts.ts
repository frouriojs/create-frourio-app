type PromptName =
  | 'dir'
  | 'server'
  | 'building'
  | 'mode'
  | 'target'
  | 'aspida'
  | 'reactHooks'
  | 'db'
  | 'postgresqlDbHost'
  | 'postgresqlDbPort'
  | 'postgresqlDbUser'
  | 'postgresqlDbPass'
  | 'postgresqlDbName'

export type Answers = Partial<Record<PromptName, string>>
export type Text = { en: string }

export type Note = {
  severity: 'info' | 'warn' | 'error'
  text: Text
}

type Lazy<T> = T | ((ans: Answers) => T)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RemoveLazy<T> = T extends (ans: Answers) => any
  ? never
  : T extends (infer U)[]
  ? RemoveLazy<U>[]
  : T extends object
  ? { [key in keyof T]: RemoveLazy<T[key]> }
  : T

type Choice = {
  name: string
  value: string
  disabled?: Lazy<null | Text>
  notes?: Lazy<Note[]>
}

export type Prompt = {
  name: PromptName
  message: Lazy<string>
  default?: string
  when?: Lazy<boolean>
  valid?: Lazy<boolean>
} & ({ type: 'list'; choices: Choice[] } | { type: 'input'; notes?: Lazy<Note[]> })

export type DeterminedPrompt = RemoveLazy<Prompt>

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
    name: 'building',
    message: 'Building mode',
    type: 'list',
    choices: [
      { name: 'Static (export)', value: 'static' },
      { name: 'Basic (build)', value: 'basic' }
    ],
    default: 'static'
  },
  {
    name: 'aspida',
    message: 'HTTP client of aspida',
    choices: [
      { name: 'axios', value: 'axios' },
      { name: 'fetch', value: 'fetch' }
    ],
    type: 'list',
    default: 'axios'
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
  },
  {
    name: 'db',
    message: 'Database kind',
    choices: [
      { name: 'SQLite', value: 'sqlite' },
      { name: 'PostgreSQL', value: 'postgresql' }
    ],
    type: 'list',
    default: 'sqlite'
  },
  ...(
    [
      ['Host', 'HOST'],
      ['Port', 'PORT'],
      ['Name', 'DATABASE'],
      ['User', 'USERNAME'],
      ['Pass', 'PASSWORD']
    ] as const
  ).map(([what, label]) => {
    const db = 'postgresql'

    return {
      name: `${db}Db${what}` as const,
      message: (ans: Answers) =>
        `dev DB ${label}: server/prisma/.env API_DATABASE_URL (${getPrismaDbUrl({
          ...ans,
          [`${db}Db${what}`]: ans[`${db}Db${what}`] || 'HERE',
          [`${db}DbPass`]: ans[`${db}DbPass`] ? '***' : what === 'Pass' ? 'HERE' : ''
        })}) =`,
      type: 'input' as const,
      default: (() => {
        switch (what) {
          case 'Host':
            return 'localhost'
          case 'Port':
            return '5432'
          default:
            return undefined
        }
      })(),
      valid: (ans: Answers) => {
        const val = ans[`${db}Db${what}`]

        if (!val) return false

        switch (what) {
          case 'Port':
            return /[1-9]\d*/.test(val) && 1 <= +val && +val <= 65353
          case 'Pass':
            return true
          default:
            return Boolean(val)
        }
      },
      when: (ans: Answers) => ans.db === db
    }
  })
]

/* eslint-disable @typescript-eslint/no-explicit-any */
export const calculatePrompts = (answers: Answers, target: any = cfaPrompts): any => {
  if (target === null) return target
  if (Array.isArray(target)) {
    return target.map((e: any) => calculatePrompts(answers, e)).filter((e: any) => e !== undefined)
  }
  if (typeof target === 'object') {
    const res: any = {}
    for (const key of Object.getOwnPropertyNames(target)) {
      if (target[key] === undefined) continue
      res[key] = calculatePrompts(answers, target[key])
    }
    if (res.when === false) return undefined
    return res
  }
  if (typeof target === 'function') return target(answers)
  return target
}

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

export const initPrompts = (answers: Answers): DeterminedPrompt[] =>
  calculatePrompts({ ...getAllDefaultAnswers(), ...answers })

export const removeUnnecessary = <T extends Answers>(answers: T): T => {
  const res = { ...answers }
  const usedKeys = Object.create(null)
  const c: DeterminedPrompt[] = calculatePrompts(answers)
  c.forEach((el) => (usedKeys[el.name] = true))

  cfaPrompts.forEach((p) => {
    if (!(p.name in usedKeys)) res[p.name] = undefined
  })

  return res
}

export const addAllUndefined = <T extends Answers>(answers: T): T => {
  const res = { ...answers }

  cfaPrompts.forEach((p) => {
    if (!(p.name in res)) res[p.name] = undefined
  })

  return res
}

export const isAnswersValid = (answers: Answers) => {
  const c: DeterminedPrompt[] = calculatePrompts(answers)
  return c.every((el): boolean => {
    const value = answers[el.name]

    const { valid } = el
    if (valid !== undefined) return valid

    if (el.type === 'list') {
      return (el.choices.filter((choice) => choice.value === value)[0]?.disabled ?? false) === false
    }

    if (el.type === 'input') {
      return !!value
    }

    throw new Error('el.type is illegal')
  })
}

export type CommonDbInfo = {
  dbHost?: string
  dbPort?: string
  dbName?: string
  dbUser?: string
  dbPass?: string
}

export const getCommonDbInfo = (answers: Answers): CommonDbInfo => {
  const info: CommonDbInfo = {}
  if (answers.db !== 'sqlite') {
    ;(['Host', 'Port', 'Name', 'User', 'Pass'] as const).forEach((what) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      info[`db${what}`] = (answers as any)[`${answers.db}Db${what}`] || ''
    })
  }
  return info
}

export const getPrismaDbUrl = (answers: Answers): string => {
  if (answers.db === 'sqlite') return 'file:./dev.db'

  const info = getCommonDbInfo(answers)

  return `postgresql://${info.dbUser}:${info.dbPass}@${info.dbHost}:${info.dbPort}/${info.dbName}`
}
