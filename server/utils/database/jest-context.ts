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
    pg: createPgContext(),
    sqlite: createSqliteContext(tmpDir),
    mysql: createMysqlContext()
  }

  beforeAll(async (done) => {
    await ctx.pg.up()
    await ctx.sqlite.up()
    await ctx.mysql.up()
    done()
  })

  afterAll(async (done) => {
    if (!keep) {
      await ctx.pg.deleteAll(await ctx.pg.getAllNames())
      await ctx.sqlite.deleteAll(await ctx.sqlite.getAllNames())
      await ctx.mysql.deleteAll(await ctx.mysql.getAllNames())
    }
    await ctx.pg.down()
    await ctx.sqlite.down()
    await ctx.mysql.down()
    done()
  })

  return ctx
}
