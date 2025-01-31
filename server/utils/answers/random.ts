/* eslint-disable @typescript-eslint/no-explicit-any */
import { Answers, cfaPrompts, isAnswersValid } from '$/common/prompts'
import { AllDbContext } from '$/utils/database/context'
import { randChoice } from '$/utils/random'

export const createRandomAnswers = async (dbCtx: AllDbContext, num = 0): Promise<Answers> => {
  if (num === 1000) throw new Error('Infinite loop')
  const ans: Answers = {}

  // Choice
  cfaPrompts.forEach((p) => {
    ;(ans as any)[p.name] = p.default
    if (p.type === 'list') {
      ;(ans as any)[p.name] = randChoice(p.choices.map((choice) => choice.value))
    } else {
      // To pass the non-empty check
      ;(ans as any)[p.name] = 'test-foo'
    }
  })

  // Database
  if (process.env.TEST_CFA_FIX_DB) ans.db = process.env.TEST_CFA_FIX_DB

  if (!isAnswersValid({ ...ans, skipDbChecks: 'true' })) {
    return await createRandomAnswers(dbCtx, num + 1)
  }

  switch (ans.db) {
    case 'postgresql': {
      await dbCtx.pg.up()
      const info = await dbCtx.pg.createNew()
      ans.postgresqlDbHost = info.host
      ans.postgresqlDbPort = info.port.toString()
      ans.postgresqlDbPass = info.password
      ans.postgresqlDbUser = info.user
      ans.postgresqlDbName = info.database
      break
    }
    case 'sqlite': {
      await dbCtx.sqlite.up()
      const info = await dbCtx.sqlite.createNew()
      ans.sqliteDbFile = info.filename
      break
    }
    default:
      throw new Error('Unreachable: Unknown answer db.')
  }

  return ans
}
