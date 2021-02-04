/* eslint-disable @typescript-eslint/no-explicit-any */
import { Answers, cfaPrompts, isAnswersValid } from '$/common/prompts'
import { AllDbContext } from '$/utils/database/context'
import { randChoice } from '$/utils/random'

export const createRandomAnswers = async (
  dbCtx: AllDbContext,
  num = 0
): Promise<Answers> => {
  if (num === 1000) throw new Error('Infinite loop')
  const ans: Answers = {}

  // Choice
  cfaPrompts.forEach((p) => {
    ;(ans as any)[p.name] = p.default
    if (p.type === 'list') {
      ;(ans as any)[p.name] = randChoice(
        p.choices.map((choice) => choice.value)
      )
    }
  })

  // Branch names
  ans.deployBranch = randChoice(['master', 'main', 'trunk'])

  // Deploy (Never used actually in test)
  ans.serverSourcePath = randChoice([
    '/srv/api-servert-test',
    '/home/testuser/foo',
    'C:\\Server Data (test)'
  ])

  // Database
  if (ans.orm === 'typeorm' && ans.db === 'sqlite') {
    ans.db = 'mysql'
  }
  if (process.env.TEST_SQLITE_ONLY === 'yes') {
    if (ans.orm === 'typeorm') ans.orm = 'prisma'
    ans.db = 'sqlite'
  }
  if (!isAnswersValid({ ...ans, skipDbChecks: 'true' }))
    return await createRandomAnswers(dbCtx, num + 1)
  if (ans.orm !== 'none') {
    switch (ans.db) {
      case 'mysql': {
        const info = await dbCtx.mysql.createNew()
        ans.dbHost = info.host
        ans.dbPort = info.port.toString()
        ans.dbPass = info.password
        ans.dbUser = info.user
        ans.dbName = info.database
        break
      }
      case 'postgresql': {
        const info = await dbCtx.pg.createNew()
        ans.dbHost = info.host
        ans.dbPort = info.port.toString()
        ans.dbPass = info.password
        ans.dbUser = info.user
        ans.dbName = info.database
        break
      }
      case 'sqlite': {
        const info = await dbCtx.sqlite.createNew()
        ans.dbFile = info.filename
        break
      }
      default:
        throw new Error('Unreachable: Unknown answer orm.')
    }
  }
  return ans
}
