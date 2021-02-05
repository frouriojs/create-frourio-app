import {
  AllDbContext,
  createMysqlContext,
  createPgContext,
  createSqliteContext
} from './context'

export const createJestDbContext = (): AllDbContext => {
  const tmpDir = process.env.TEST_CFA_TMP_DIR || './.tmp/sqlite'

  const ctx: AllDbContext = {
    pg: createPgContext(),
    sqlite: createSqliteContext(tmpDir),
    mysql: createMysqlContext()
  }

  return ctx
}
