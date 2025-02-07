import path from 'path';
import type { DbContext } from './context';
import { createDbContext } from './context';

export const createTestDbContext = (): DbContext => {
  const tmpDir = process.env.TEST_CFA_TMP_DIR || '/tmp/cfa-test';
  const sqliteTmpDir = path.resolve(tmpDir, 'sqlite');

  return createDbContext(sqliteTmpDir);
};
