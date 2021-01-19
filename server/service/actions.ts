import { typeormDBs } from '../common/dbInfo'
import { Answers } from '../common/prompts'

export const createActions = (
  answers: Answers
): {
  answers: Answers & { dbModule: string; dbUrl: string }
  actions: (
    | { type: 'add'; files: string; templateDir: string }
    | { type: 'move'; patterns: Record<string, string> }
    | { type: 'remove'; file: string }
  )[]
} => {
  const newAnswers = { prismaDB: 'none', ...answers, dbModule: '', dbUrl: '' }
  const addedList: { type: 'add'; files: string; templateDir: string }[] = [
    {
      type: 'add',
      files: '**',
      templateDir: `core/${answers.server}`
    }
  ]

  if (answers.orm === 'typeorm') {
    addedList.push({
      type: 'add',
      files: '**',
      templateDir: `core/${answers.server}-typeorm`
    })
  }

  if (answers.daemon !== 'none') {
    addedList.push({
      type: 'add',
      files: '**',
      templateDir: `daemon/${answers.daemon}`
    })
  }

  newAnswers.dbModule = ''

  if (answers.orm === 'prisma') {
    newAnswers.dbUrl =
      answers.db === 'sqlite'
        ? `file:${answers.dbFile}`
        : `${answers.db}://${answers.dbUser}:${answers.dbPass}@${answers.dbHost}:${answers.dbPort}/${answers.dbName}`

    addedList.push({
      type: 'add',
      files: '**',
      templateDir: 'orm/prisma'
    })
  } else if (answers.orm === 'typeorm') {
    newAnswers.dbModule = `",\n    "${
      typeormDBs[answers.db as keyof typeof typeormDBs].name
    }": "${typeormDBs[answers.db as keyof typeof typeormDBs].ver}`

    addedList.push({
      type: 'add',
      files: '**',
      templateDir: 'orm/typeorm'
    })
  }

  if (answers.testing !== 'none') {
    addedList.push({
      type: 'add',
      files: '**',
      templateDir: `testing/${answers.testing}`
    })

    addedList.push({
      type: 'add',
      files: '**',
      templateDir: `testing/${answers.client}`
    })

    if (answers.aspida === 'fetch' && answers.client !== 'sapper') {
      addedList.push({
        type: 'add',
        files: '**',
        templateDir: 'testing/fetch'
      })
    }
  }

  if (answers.ci !== 'none') {
    addedList.push({
      type: 'add',
      files: '**',
      templateDir: `ci/${answers.ci}`
    })
  }

  return {
    answers: newAnswers,
    actions: [
      {
        type: 'add',
        files: '**',
        templateDir: `client/${answers.client}`
      },
      {
        type: 'add',
        files: 'server/**',
        templateDir: ''
      },
      ...addedList,
      ...(answers.client === 'next' &&
      answers.reactHooks === 'none' &&
      answers.testing === 'jest'
        ? [
            {
              type: 'remove' as const,
              file: 'test/testUtils.tsx'
            }
          ]
        : []),
      {
        type: 'move',
        patterns: { gitignore: '.gitignore' }
      }
    ]
  }
}
