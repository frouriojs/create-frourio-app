import {
  AllDbContext,
  createMysqlContext,
  createPgContext,
  createSqliteContext
} from './context'
import path from 'path'

export const createJestDbContext = (): AllDbContext => {
  const tmpDir = process.env.TEST_CFA_TMP_DIR || './.tmp'
  const sqliteTmpDir = path.resolve(tmpDir, 'sqlite')

  const ctx: AllDbContext = {
    pg: createPgContext(),
    sqlite: createSqliteContext(sqliteTmpDir),
    mysql: createMysqlContext()
  }

  return ctx
}
