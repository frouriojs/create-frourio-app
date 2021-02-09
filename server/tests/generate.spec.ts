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
import realExecutablePath from 'real-executable-path'
import { npmInstall } from '$/service/completed'
const execFileAsync = promisify(execFile)

const randomNum = Number(process.env.TEST_CFA_RANDOM_NUM || '1')
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
  try {
    await fs.promises.mkdir(tmpDir, { recursive: true })
  } catch (e: unknown) {
    // ignore
  }
  const dir = path.resolve(tmpDir, randSuffix())
  answers.dir = dir
  try {
    await main(dir)

    // Clean up
    try {
      await fs.promises.rmdir(dir, { recursive: true })
    } catch (e: unknown) {
      // ignore
      // NOTE: Sometimes failing on Windows
    }
  } catch (e: unknown) {
    console.error(
      `Failed. ${dir}\n${createCmdRunner(answers)}\n${createShellRunner(
        answers
      )}`
    )
    try {
      await fs.promises.writeFile(
        path.resolve(dir, '.test-error.txt'),
        e instanceof Error
          ? e.name + '\n\n' + e.message + '\n\nCall Stack\n' + e.stack
          : String(e)
      )
    } catch (e2: unknown) {
      // ignore
    }
    try {
      await fs.promises.rename(
        dir,
        path.resolve(path.dirname(dir), path.basename(dir) + '-failed')
      )
    } catch (e2: unknown) {
      // ignore
    }
    throw e
  }
}

test.each(Array.from({ length: randomNum }))('create', async () => {
  const dbCtx = createJestDbContext()
  try {
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
          path.resolve(dir, '**/*.json').replace(/\\/g, '/'),
          path.resolve(dir, '**/.prettierrc').replace(/\\/g, '/')
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
        const yamlFiles = await fg([
          path.resolve(dir, '**/*.{yml,yaml}').replace(/\\/g, '/')
        ])
        for (const f of yamlFiles) {
          const content = (await fs.promises.readFile(f)).toString()
          expect(
            () => YAML.parse(content),
            `YAML validation for ${f}`
          ).not.toThrow()
        }
      }

      const envFiles = await fg([
        path.resolve(dir, '**/.env').replace(/\\/g, '/')
      ])
      const allEnv = envFiles
        .map((f) => fs.readFileSync(f).toString())
        .join('\n')
      assert(answers.pm)
      const npmClientPath = await realExecutablePath(answers.pm)

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
      const serverDir = path.resolve(dir, 'server')

      // npm/yarn install
      await npmInstall(dir, npmClientPath, process.stdout)
      await npmInstall(serverDir, npmClientPath, process.stdout)

      // typecheck
      await execFileAsync(npmClientPath, ['run', 'typecheck'], {
        cwd: dir
      })

      // eslint
      await execFileAsync(npmClientPath, ['run', 'lint:fix'], {
        cwd: dir
      })

      // build:client
      await execFileAsync(npmClientPath, ['run', 'build:client'], {
        cwd: dir
      })

      // build:server
      await execFileAsync(npmClientPath, ['run', 'build:server'], {
        cwd: dir
      })

      // migrations
      if (answers.orm === 'prisma') {
        await execFileAsync(npmClientPath, ['run', 'migrate:dev'], {
          cwd: serverDir
        })
      } else if (answers.orm === 'typeorm') {
        await execFileAsync(npmClientPath, ['run', 'migration:run'], {
          cwd: serverDir
        })
      }

      // Project scope test
      if (answers.testing !== 'none') {
        await execFileAsync(npmClientPath, ['test'], {
          cwd: dir
        })
      }

      // Integration test
      {
        const nodePath = await realExecutablePath('node')
        const proc = spawn(nodePath, [path.resolve(dir, 'server/index.js')], {
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
          ).rejects.toHaveProperty(
            'response.status',
            answers.server === 'fastify' ? 400 : 401
          )
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
          try {
            await tcpPortUsed.waitUntilFreeOnHost(
              serverPort,
              '127.0.0.1',
              500,
              5000
            )
          } catch (e: unknown) {
            proc.kill('SIGKILL')
          }
        }
      }
    })
    const keep = process.env.TEST_CFA_KEEP_DB === 'yes'
    if (!keep) {
      await dbCtx.pg.deleteAll(await dbCtx.pg.getAllNames())
      await dbCtx.sqlite.deleteAll(await dbCtx.sqlite.getAllNames())
      await dbCtx.mysql.deleteAll(await dbCtx.mysql.getAllNames())
    }
  } finally {
    try {
      await dbCtx.pg.down()
      await dbCtx.sqlite.down()
      await dbCtx.mysql.down()
    } catch (e: unknown) {
      console.error('Failed to clean up databases.')
      console.error(e)
    }
  }
})
