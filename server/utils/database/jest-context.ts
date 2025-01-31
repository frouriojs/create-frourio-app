import { createDbContext, DbContext } from './context'
import path from 'path'

export const createJestDbContext = (): DbContext => {
  const tmpDir = process.env.TEST_CFA_TMP_DIR || '/tmp/cfa-test'
  const sqliteTmpDir = path.resolve(tmpDir, 'sqlite')

  return createDbContext(sqliteTmpDir)
}
