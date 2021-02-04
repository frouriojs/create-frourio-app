import axios from 'axios'
import { generate } from '$/service/generate'
import { createJestDbContext } from '$/utils/database/jest-context'
import { randInt, randSuffix } from '$/utils/random'
import { createRandomAnswers } from '$/utils/answers/random'
import tcpPortUsed from 'tcp-port-used'
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
import { execFile, spawn } from 'child_process'
import { promisify } from 'util'
import { Answers } from '$/common/prompts'
const execFileAsync = promisify(execFile)

const randomNum = Number(process.env.TEST_CFA_RANDOM_NUM || '3')
const dbCtx = createJestDbContext()
jest.setTimeout(1000 * 60 * 20)

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
    console.error(
      `Failed. ${dir}\n${createCmdRunner(answers)}\n${createShellRunner(
        answers
      )}`
    )
    await fs.promises.writeFile(
      path.resolve(dir, '.test-error.txt'),
      e instanceof Error
        ? e.name + '\n\n' + e.message + '\n\nCall Stack\n' + e.stack
        : String(e)
    )
    await fs.promises.rename(
      dir,
      path.resolve(path.dirname(dir), path.basename(dir) + '-failed')
    )
    throw e
  }
}

test.each(Array.from({ length: randomNum }))('create', async () => {
  const answers = await createRandomAnswers(dbCtx)
  const randPort = 1024 + randInt(63000 - 1024)
  const clientPort = await getPortPromise({ port: randPort })
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
        const content = (await fs.promises.readFile(f)).toString()
        expect(
          () => JSON.parse(content),
          `JSON validation for ${f}`
        ).not.toThrow()
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

    {
      // Project scope test
      if (answers.testing !== 'none') {
        await execFileAsync(answers.pm, ['test'], {
          cwd: dir
        })
      }
    }

    {
      const proc = spawn('node', [path.resolve(dir, 'server/index.js')], {
        stdio: ['ignore', 'inherit', 'inherit'],
        cwd: path.resolve(dir, 'server')
      })

      try {
        await tcpPortUsed.waitUntilUsedOnHost(
          serverPort,
          '127.0.0.1',
          500,
          5000
        )

        // Appearance test
        const client = axios.create({
          baseURL: `http://localhost:${serverPort}/api`
        })

        const res1 = await client.get('tasks')
        expect(res1.data).toHaveLength(0)

        await client.post('tasks', { label: 'test' })

        const res2 = await client.get('tasks')
        expect(res2.data).toHaveLength(1)
        expect(res2.data[0].label).toEqual('test')

        await expect(
          client.get('user', { headers: { authorization: 'token' } })
        ).rejects.toHaveProperty('response.status', answers.server === 'fastify' ? 400 : 401)
        await expect(
          client.post('token', { id: 'hoge', pass: 'huga' })
        ).rejects.toHaveProperty('response.status', 401)

        const res3 = await client.post('token', { id: 'id', pass: 'pass' })
        await expect(
          client.get('user', {
            headers: { authorization: `Bearer ${res3.data.token}` }
          })
        ).resolves.toHaveProperty('data.name', 'sample user')
      } finally {
        proc.kill()
      }
    }
  })
})
