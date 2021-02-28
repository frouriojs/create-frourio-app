import {
  Answers,
  CommonDbInfo,
  getCommonDbInfo,
  getPrismaDbUrl
} from './prompts'

// This is something like `computed value`.
// Additional keys should not include the same key on Answers.
export type TemplateContext = Answers &
  CommonDbInfo & {
    clientPort: number
    serverPort: number
    // value for prisma DATABASE_URL
    prismaDbUrl?: string
    // used for typeorm.ConnectionOptions.type
    typeormDb: string | undefined
  }

export const answersToTemplateContext = (
  answers: Answers & { clientPort: number; serverPort: number }
): TemplateContext => {
  const templateContext: TemplateContext = {
    ...answers,
    typeormDb: answers.db === 'postgresql' ? 'postgres' : answers.db,
    ...getCommonDbInfo(answers),
    prismaDbUrl: getPrismaDbUrl(answers)
  }

  return templateContext
}
