import { generate } from '$/service/generate'
import { createJestDbContext } from '$/utils/database/jest-context'
import { randSuffix } from '$/utils/random'
import { createRandomAnswers } from '$/utils/answers/random'
import path from 'path'
import fs from 'fs'
import { getPortPromise } from 'portfinder'
import {
  cmdEscapeSingleInput,
  shellEscapeSingleInput
} from '$/utils/shell/escape'
import fg from 'fast-glob'
import YAML from 'yaml'
import assert from 'assert'
import { execFile } from 'child_process'
import { promisify } from 'util'
import { Answers } from '$/common/prompts'
const execFileAsync = promisify(execFile)

const randomNum = Number(process.env.TEST_CFA_RANDOM_NUM || '3')
const dbCtx = createJestDbContext()
jest.setTimeout(360000)

const createShellRunner = (answers: Answers) =>
  `node ./bin/index --answers ${shellEscapeSingleInput(
    JSON.stringify(answers)
  )}`
const createCmdRunner = (answers: Answers) =>
  `node ./bin/index --answers ${cmdEscapeSingleInput(JSON.stringify(answers))}`

const tempSandbox = async (
  answers: Answers,
  main: (dir: string) => Promise<void>
) => {
  const tmpDir = process.env.TEST_CFA_TMP_DIR || './.tmp'
  const dir = path.resolve(tmpDir, randSuffix())
  answers.dir = dir
  try {
    await main(dir)

    // Clean up
    await fs.promises.rm(dir, { recursive: true })
    // await fs.promises.rmdir(dir)
  } catch (e: unknown) {
    console.error(`Failed. ${dir}`)
    console.error(createCmdRunner(answers))
    console.error(createShellRunner(answers))
    await fs.promises.writeFile(
      path.resolve(dir, '.test-error.txt'),
      e instanceof Error ? e.message : String(e)
    )
    throw e
  }
}

test.each(Array.from({ length: randomNum }))('create', async () => {
  const answers = await createRandomAnswers(dbCtx)
  const clientPort = await getPortPromise({ port: 10000 })
  const serverPort = await getPortPromise({ port: clientPort + 1 })
  await tempSandbox(answers, async (dir: string) => {
    await generate(
      {
        ...answers,
        clientPort,
        serverPort
      },
      path.resolve(__dirname, '..')
    )
    expect((await fs.promises.stat(dir)).isDirectory()).toBe(true)
    await fs.promises.writeFile(
      path.resolve(dir, '.test-info.txt'),
      JSON.stringify(answers) +
        '\n\n' +
        createCmdRunner(answers) +
        '\n\n' +
        createShellRunner(answers)
    )

    // Validate all json files
    {
      const jsonFiles = await fg([
        path.posix.resolve(dir, '**/*.json'),
        path.posix.resolve(dir, '**/.prettierrc')
      ])
      expect(jsonFiles.length).toBeGreaterThan(0)
      for (const f of jsonFiles) {
        const content = await fs.promises.readFile(f)
        expect(() => content.toJSON(), `JSON validation for ${f}`).not.toThrow()
      }
    }

    // Validate all yaml files
    {
      const yamlFiles = await fg([path.posix.resolve(dir, '**/*.{yml,yaml}')])
      for (const f of yamlFiles) {
        const content = (await fs.promises.readFile(f)).toString()
        expect(
          () => YAML.parse(content),
          `YAML validation for ${f}`
        ).not.toThrow()
      }
    }

    const envFiles = await fg([path.posix.resolve(dir, '**/.env')])
    const allEnv = envFiles.map((f) => fs.readFileSync(f).toString()).join('\n')
    assert(answers.pm)

    // SQLite name found
    if (
      answers.orm !== 'none' &&
      answers.orm !== 'typeorm' &&
      answers.db === 'sqlite'
    ) {
      expect(answers.dbFile?.length).toBeGreaterThan(0)
      expect(allEnv).toContain(answers.dbFile)
    }

    // DB info found
    if (answers.orm !== 'none' && answers.db !== 'sqlite') {
      expect(answers.dbHost?.length).toBeGreaterThan(0)
      expect(answers.dbPort?.length).toBeGreaterThan(0)
      expect(answers.dbPass?.length).toBeGreaterThan(0)
      expect(answers.dbName?.length).toBeGreaterThan(0)
      expect(answers.dbUser?.length).toBeGreaterThan(0)
      expect(allEnv).toContain(answers.dbHost)
      expect(allEnv).toContain(answers.dbPort)
      expect(allEnv).toContain(answers.dbPass)
      expect(allEnv).toContain(answers.dbName)
      expect(allEnv).toContain(answers.dbUser)
    }

    // npm/yarn install client
    {
      await execFileAsync(answers.pm, ['install'], {
        cwd: dir
      })
    }

    // npm/yarn install server
    {
      await execFileAsync(
        answers.pm,
        ['install', answers.pm === 'npm' ? '--prefix' : '--cwd', 'server'],
        {
          cwd: dir
        }
      )
    }

    // typecheck
    {
      await execFileAsync(answers.pm, ['run', 'typecheck'], {
        cwd: dir
      })
    }

    // eslint
    {
      await execFileAsync(answers.pm, ['run', 'lint:fix'], {
        cwd: dir
      })
    }

    // test
    if (answers.testing !== 'none') {
      await execFileAsync(answers.pm, ['test'], {
        cwd: dir
      })
    }

    // build:client
    {
      await execFileAsync(answers.pm, ['run', 'build:client'], {
        cwd: dir
      })
    }

    // build:server
    {
      await execFileAsync(answers.pm, ['run', 'build:server'], {
        cwd: dir
      })
    }
  })
})
