import { Answers, CommonDbInfo, getCommonDbInfo, getPrismaDbUrl } from './prompts'

// This is something like `computed value`.
// Additional keys should not include the same key on Answers.
export type TemplateContext = Answers &
  CommonDbInfo & { clientPort: number; serverPort: number; prismaDbUrl: string }

export const answersToTemplateContext = (
  answers: Answers & { clientPort: number; serverPort: number }
): TemplateContext => {
  return { ...answers, ...getCommonDbInfo(answers), prismaDbUrl: getPrismaDbUrl(answers) }
}
