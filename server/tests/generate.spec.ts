import axios from 'axios';
import { execFile, spawn } from 'child_process';
import { cmdEscapeSingleInput, shellEscapeSingleInput } from 'common/escape';
import type { Answers } from 'common/prompts';
import fg from 'fast-glob';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { getPortPromise } from 'portfinder';
import { generate } from 'service/generate';
import { npmInstall } from 'service/npmInstall';
import tcpPortUsed from 'tcp-port-used';
import { randInt, randSuffix } from 'tests/random';
import { promisify } from 'util';
import { expect, test } from 'vitest';
import YAML from 'yaml';
import { createRandomAnswers } from './answers/random';
import { createTestDbContext } from './database/test-context';

const execFileAsync = promisify(execFile);

const Red16x16PngBinary = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
  0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x10, 0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x91, 0x68,
  0x36, 0x00, 0x00, 0x00, 0x17, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0xf8, 0xcf, 0xc0, 0x40,
  0x12, 0x22, 0x4d, 0xf5, 0xa8, 0x86, 0x51, 0x0d, 0x43, 0x4a, 0x03, 0x00, 0x90, 0xf9, 0xff, 0x01,
  0xf9, 0xe1, 0xfa, 0x78, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
]);

const createShellRunner = (answers: Answers) =>
  `node ./bin/index --answers ${shellEscapeSingleInput(JSON.stringify(answers))}`;
const createCmdRunner = (answers: Answers) =>
  `node ./bin/index --answers ${cmdEscapeSingleInput(JSON.stringify(answers))}`;

const tempSandbox = async (answers: Answers, main: (dir: string) => Promise<void>) => {
  const tmpDir = process.env.TEST_CFA_TMP_DIR || '/tmp/cfa-test';
  try {
    await fs.promises.mkdir(tmpDir, { recursive: true });
  } catch (_: unknown) {
    // ignore
  }
  const dir = path.resolve(tmpDir, randSuffix());
  answers.dir = dir;
  try {
    await main(dir);

    // Clean up
    try {
      await fs.promises.rmdir(dir, { recursive: true });
    } catch (_: unknown) {
      // ignore
      // NOTE: Sometimes failing on Windows
    }
  } catch (e: unknown) {
    console.error(`Failed. ${dir}\n${createCmdRunner(answers)}\n${createShellRunner(answers)}`);
    try {
      await fs.promises.writeFile(
        path.resolve(dir, '.test-error.txt'),
        e instanceof Error
          ? `${e.name}\n\n${e.message}\n\nCall Stack\n${e.stack}\n\n${JSON.stringify(e)}`
          : String(e),
      );
    } catch (_: unknown) {
      // ignore
    }
    try {
      await fs.promises.rename(
        dir,
        path.resolve(path.dirname(dir), `${path.basename(dir)}-failed`),
      );
    } catch (_: unknown) {
      // ignore
    }
    throw e;
  }
};

test(
  'generate',
  async () => {
    const dbCtx = createTestDbContext();
    try {
      const answers = await createRandomAnswers(dbCtx);
      const randPort = 1024 + randInt(63000 - 1024);
      const clientPort = await getPortPromise({ port: randPort });
      const serverPort = await getPortPromise({ port: clientPort + 1 });
      await tempSandbox(answers, async (dir: string) => {
        await generate({ ...answers, clientPort, serverPort }, path.resolve(__dirname, '..'));
        expect((await fs.promises.stat(dir)).isDirectory()).toBe(true);
        await fs.promises.writeFile(
          path.resolve(dir, '.test-info.txt'),
          `${JSON.stringify(answers)}\n\n${createCmdRunner(answers)}\n\n${createShellRunner(
            answers,
          )}`,
        );

        // Validate all json files
        {
          const jsonFiles = await fg([
            path.resolve(dir, '**/*.json').replace(/\\/g, '/'),
            path.resolve(dir, '**/.prettierrc').replace(/\\/g, '/'),
          ]);
          expect(jsonFiles.length).toBeGreaterThan(0);
          for (const f of jsonFiles) {
            const content = (await fs.promises.readFile(f)).toString();
            expect(() => JSON.parse(content), `JSON validation for ${f}`).not.toThrow();
          }
        }

        // Validate all yaml files
        {
          const yamlFiles = await fg([path.resolve(dir, '**/*.{yml,yaml}').replace(/\\/g, '/')]);
          for (const f of yamlFiles) {
            const content = (await fs.promises.readFile(f)).toString();
            expect(() => YAML.parse(content), `YAML validation for ${f}`).not.toThrow();
          }
        }

        const serverDir = path.resolve(dir, 'server');

        // npm install
        await npmInstall(dir);

        // eslint
        await execFileAsync('npm', ['run', 'fix:lint'], {
          cwd: dir,
          shell: process.platform === 'win32',
        });

        // typecheck
        await execFileAsync('npm', ['run', 'generate'], {
          cwd: dir,
          shell: process.platform === 'win32',
        });
        await execFileAsync('npm', ['run', 'typecheck'], {
          cwd: dir,
          shell: process.platform === 'win32',
        });

        // build:client
        await execFileAsync('npm', ['run', 'build:client'], {
          cwd: dir,
          shell: process.platform === 'win32',
        });

        // build:server
        await execFileAsync('npm', ['run', 'build:server'], {
          cwd: dir,
          shell: process.platform === 'win32',
        });

        // migrations
        await execFileAsync('npm', ['run', 'migrate:dev'], {
          cwd: serverDir,
          shell: process.platform === 'win32',
        });

        // Project scope test
        await execFileAsync('npm', ['test'], {
          cwd: dir,
          shell: process.platform === 'win32',
        });

        // Integration test
        {
          const proc = spawn('node', [path.resolve(serverDir, 'index.js')], {
            stdio: ['ignore', 'inherit', 'inherit'],
            cwd: serverDir,
            shell: process.platform === 'win32',
          });

          try {
            await tcpPortUsed.waitUntilUsedOnHost(serverPort, '127.0.0.1', 500, 10000);

            const slash = answers.server === 'fastify' ? '' : '/';

            // Appearance test
            const client = axios.create({ baseURL: `http://localhost:${serverPort}` });

            // There are seeder tasks at first
            {
              const res = await client.get(`/api/tasks${slash}`);
              expect(res.data).toHaveLength(2);
            }

            // Add one task
            await client.post(`/api/tasks${slash}`, { label: 'test' });

            // Get added task
            {
              const res = await client.get(`/api/tasks${slash}`);
              expect(res.data).toHaveLength(3);
              expect(res.data[2].label).toEqual('test');
            }

            // Cannot login with illegal token
            await expect(
              client.get(`/api/user${slash}`, { headers: { authorization: 'token' } }),
            ).rejects.toHaveProperty('response.status', 401);

            // Cannot login with invalid password
            await expect(
              client.post(`/api/token${slash}`, { id: 'hoge', pass: 'huga' }),
            ).rejects.toHaveProperty('response.status', 401);

            // Create correct authorization using correct password
            const {
              data: { token },
            } = await client.post(`/api/token${slash}`, { id: 'id', pass: 'pass' });

            const headers = { authorization: `Bearer ${token}` };

            // Get user information with credential
            {
              const user = await client.get(`/api/user${slash}`, { headers });
              expect(user).toHaveProperty('data.name', 'sample user');
              expect(user).toHaveProperty(
                'data.icon',
                expect.stringContaining('static/icons/dummy.svg'),
              );
            }

            const resStaticIcon = await client.get('/static/icons/dummy.svg');
            expect(resStaticIcon.headers).toHaveProperty('content-type', 'image/svg+xml');
            const form = new FormData();

            // NOTE: Multer has a bug if there is no filename
            // https://github.com/expressjs/multer/issues/553
            form.append('icon', Red16x16PngBinary, 'red16x16.png');

            await client.post(`/api/user${slash}`, form, {
              headers: { ...headers, ...form.getHeaders() },
            });

            {
              const user = await client.get(`/api/user${slash}`, { headers });
              expect(user).toHaveProperty(
                'data.icon',
                expect.stringContaining('upload/icons/user-icon'),
              );
            }

            const resUploadIcon = await client.get(`/upload/icons/user-icon`);
            expect(resUploadIcon.status).toEqual(200);
          } finally {
            await new Promise<void>((resolve, reject) => {
              proc.on('close', resolve);
              proc.once('error', reject);
              proc.kill();
            });
          }
        }
      });

      try {
        await dbCtx.down();
        await dbCtx.getAllNames().then(dbCtx.deleteAll);
      } catch (e: unknown) {
        console.error('Failed to delete one database.');
        console.error(e);
      }
    } catch (e: unknown) {
      try {
        await dbCtx.down();
      } catch (e: unknown) {
        console.error('Failed to clean up databases.');
        console.error(e);
      }

      throw e;
    }
  },
  1000 * 60 * 20,
);
