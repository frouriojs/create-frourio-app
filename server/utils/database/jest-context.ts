import {
  AllDbContext,
  createMysqlContext,
  createPgContext,
  createSqliteContext
} from './context'

export const createJestDbContext = (): AllDbContext => {
  const tmpDir = process.env.TEST_CFA_TMP_DIR || './.tmp/sqlite'
  const keep = process.env.TEST_CFA_KEEP_DB === 'yes'

  const ctx: AllDbContext = {
    mysql: createMysqlContext(),
    sqlite: createSqliteContext(tmpDir),
    pg: createPgContext()
  }

  beforeAll(async () => {
    await ctx.pg.up()
    await ctx.sqlite.up()
    await ctx.mysql.up()
  })

  afterAll(async () => {
    if (!keep) {
      await ctx.pg.deleteAll(await ctx.pg.getAllNames())
      await ctx.sqlite.deleteAll(await ctx.sqlite.getAllNames())
      await ctx.mysql.deleteAll(await ctx.mysql.getAllNames())
    }
    await ctx.pg.down()
    await ctx.sqlite.down()
    await ctx.mysql.down()
  })

  return ctx
}
