import { AllDbContext, createPgContext, createSqliteContext } from './context'
import path from 'path'

export const createJestDbContext = (): AllDbContext => {
  const tmpDir = process.env.TEST_CFA_TMP_DIR || '/tmp/cfa-test'
  const sqliteTmpDir = path.resolve(tmpDir, 'sqlite')

  return { pg: createPgContext(), sqlite: createSqliteContext(sqliteTmpDir) }
}
